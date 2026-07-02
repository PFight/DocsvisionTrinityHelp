using DocsVision.BackOffice.ObjectModel;
using DocsVision.BackOffice.ObjectModel.Services;
using DocsVision.Helpers;
using DocsVision.Platform.ObjectManager;
using DocsVision.Platform.ObjectManager.SearchModel;
using DocsVision.Platform.WebClient;
using DocsVision.Platform.WebClient.Diagnostics;
using DocsVision.Platform.WebClient.Models;
using DocsVision.Platform.WebClient.Models.Generic;
using DocsVision.WebClientLibrary.ObjectModel.Services.EntityLifeCycle;
using DocsVision.WebClientLibrary.ObjectModel.Services.EntityLifeCycle.Options;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using TrinityHelp.Visit.Models;
using static TrinityHelp.Constants;

namespace TrinityHelp.Feature1
{
    public class VisitController : ApiController
    {
        private readonly ICurrentObjectContextProvider _currentObjectContextProvider;
        private readonly ILifeCycleServiceEx cardLifeCycle;

        public VisitController(
            ICurrentObjectContextProvider currentObjectContextProvider,
            ILifeCycleServiceEx cardLifeCycleEx)
        {
            _currentObjectContextProvider = currentObjectContextProvider;
            this.cardLifeCycle = cardLifeCycleEx;
        }

        [HttpPost]
        public CommonResponse<CreateVisitResponse> Create(CreateVisitRequest request)
        {
            Trace.TraceInformation("Creating visit: " + JsonHelper.SerializeToJson(request));

            var sessionContext = _currentObjectContextProvider.GetOrCreateCurrentSessionContext();

            var referenceListService = sessionContext.ObjectContext.GetService<IReferenceListService>();

            var visitorId = request.VisitorId;
            if (visitorId == Guid.Empty)
            {
                SearchQuery searchQuery = sessionContext.Session.CreateSearchQuery();
                CardTypeQuery typeQuery = searchQuery.AttributiveSearch.CardTypeQueries.AddNew(Constants.Visitor.ID);

                SectionQuery sectionQuery = typeQuery.SectionQueries.AddNew(Constants.Visitor.MainInfo.ID);

                sectionQuery.ConditionGroup.Operation = ConditionGroupOperation.Or;
                if (!String.IsNullOrWhiteSpace(request.VisitorPassport))
                {
                    sectionQuery.ConditionGroup.Conditions.AddNew(Constants.Visitor.MainInfo.Passport, DocsVision.Platform.ObjectManager.Metadata.FieldType.String, ConditionOperation.Equals, request.VisitorPassport);
                }
                else if (!String.IsNullOrWhiteSpace(request.VisitorPhone))
                {
                    sectionQuery.ConditionGroup.Conditions.AddNew(Constants.Visitor.MainInfo.MainPhoneNumber, DocsVision.Platform.ObjectManager.Metadata.FieldType.String, ConditionOperation.Equals, request.VisitorPhone);
                    if (request.VisitorPhone != null && request.VisitorPhone.Length == 7 && request.VisitorPhone[4] == '.')
                    {
                        // Parse value like 1408.77, wich is 14.08.1977
                        var date = new DateTime(1900 + Int32.Parse(request.VisitorPhone.Substring(5, 2)), Int32.Parse(request.VisitorPhone.Substring(2, 2)), Int32.Parse(request.VisitorPhone.Substring(0, 2)));
                        sectionQuery.ConditionGroup.Conditions.AddNew(Constants.Visitor.MainInfo.BirthDate, DocsVision.Platform.ObjectManager.Metadata.FieldType.Date, ConditionOperation.Equals, date);
                    }
                }

                string query = searchQuery.GetXml(null, true);

                Trace.TraceInformation("Searching visitor: " + query);

                CardDataCollection cardCollection = sessionContext.Session.CardManager.FindCards(query);

                Trace.TraceInformation("Found " + cardCollection.Count);

                if (cardCollection.Count > 0)
                {
                    visitorId = cardCollection[0].Id;
                }
            }
            if (visitorId == Guid.Empty)
            {
                throw new ArgumentOutOfRangeException(nameof(request.VisitorId));
            }

            Trace.TraceInformation("Visitor id: " + visitorId);

            CreateVisit(request, sessionContext, visitorId, out var visitId, out var numberText);

            return CommonResponse.CreateSuccess(sessionContext, request.VisitorId, new CreateVisitResponse()
            {
                VisitId = visitId,
                VisitNumber = numberText
            });
        }

        [HttpPost]
        public CommonResponse MergeDublicates([FromUri] Guid visitorId, [FromUri] Guid dublicateVisitorId)
        {
            if (visitorId == dublicateVisitorId)
                throw new Exception("Выберите другого посетителя (вы выбрали ту же карточку)");
            if (visitorId == Guid.Empty || dublicateVisitorId == Guid.Empty)
                throw new ArgumentNullException("Переданы некорректные параметры (" + visitorId.ToString() + ", " + dublicateVisitorId.ToString());

            Trace.TraceInformation("Merging visits from dublicate: " + dublicateVisitorId + " to " + visitorId);

            List<VisitorVisit> visits = new List<VisitorVisit>();

            var sessionContext = _currentObjectContextProvider.GetOrCreateCurrentSessionContext();
            var numeratorRuleService = sessionContext.ObjectContext.GetService<INumerationRulesService>();

            Trace.TraceInformation("Loading loading visits for visitor dublicate: " + dublicateVisitorId);
            var dublicateVisitorData = sessionContext.AdvancedCardManager.GetCardData(dublicateVisitorId);
            var dublicateVisitsSection = dublicateVisitorData.Sections[Constants.Visitor.Visits.ID].GetAllRows();
            foreach (var visitRow in dublicateVisitsSection)
            {
                var visitId = (Guid)visitRow[Constants.Visitor.Visits.Visit];
                var visit = LoadVisit(sessionContext, visitId, dublicateVisitorData);
                visits.Add(visit);
            }

            Trace.TraceInformation("Loading loading original visits for visitor : " + visitorId);
            List<VisitorVisit> originalVisits = new List<VisitorVisit>();
            var visitorData = sessionContext.AdvancedCardManager.GetCardData(dublicateVisitorId);
            var visitsSection = visitorData.Sections[Constants.Visitor.Visits.ID].GetAllRows();
            foreach (var visitRow in visitsSection)
            {
                var visitId = (Guid)visitRow[Constants.Visitor.Visits.Visit];
                var visit = LoadVisit(sessionContext, visitId, visitorData);
                originalVisits.Add(visit);
            }

            Trace.TraceInformation("Copying from dublicate to visitor");

            foreach (var visit in visits)
            {
                if (!originalVisits.Any(x => x.Comment?.Contains(visit.Id.ToString()) ?? false))
                {
                    Trace.TraceInformation("Copying visit " + visit.Id + " " + visit.Date.ToString());

                    CreateVisit(new CreateVisitRequest()
                    {
                        VisitorId = visitorId,
                        Comment = visit.Comment + "[merged from " + dublicateVisitorId + ", old visit id: " + visit.Id.ToString() + "]",
                        DutyId = visit.DutyId.ToString(),
                        Date = visit.Date,
                        Items = visit.Items.Select(item => new CreateVisitItem()
                        {
                            Code = item.Code,
                            Comment = item.Comment,
                            Recipient = item.Recipient,
                            RecipientName = item.RecipientName
                        }).ToList()
                    }, sessionContext, visitorId, out var visitId, out var numberText);

                    Trace.TraceInformation("Visit " + visit.Id + " copied. New visit id " + visitId + ", number: " + numberText);
                }
                else
                {
                    Trace.TraceInformation("Visit " + visit.Id + " already copied earlier.");
                }
            }

            var appPoolSessionContext = this._currentObjectContextProvider.GetOrCreateApplicationPoolSessionContext();
            appPoolSessionContext.AdvancedCardManager.DeleteCard(dublicateVisitorId);

            return CommonResponse.CreateSuccess();
        }

        private void CreateVisit(CreateVisitRequest request, SessionContext sessionContext, Guid visitorId, out Guid visitId, out string numberText)
        {
            var visitor = sessionContext.AdvancedCardManager.GetCardData(visitorId);

            visitId = Guid.Empty;
            if (!String.IsNullOrEmpty(request.VisitNumber))
            {
                visitId = FindVisitByNumber(request.VisitNumber, sessionContext);
            }

            if (visitId == Guid.Empty)
            {
                var lifeCycle = cardLifeCycle.GetCardLifeCycle(Constants.Visit.ID);
                visitId = lifeCycle.Create(sessionContext, new CardCreateLifeCycleOptions()
                {
                    CardKindId = Constants.Visit.MainKindID
                });

                // Add reference from visitor to visit
                var visitsRow = visitor.Sections[Constants.Visitor.Visits.ID].CreateRow();
                visitsRow[Constants.Visitor.Visits.Visit] = visitId;


            }

            // Add reference from visit to visitor
            var visit = sessionContext.AdvancedCardManager.GetCardData(visitId);
            var visitMainInfo = visit.Sections[Constants.Visit.MainInfo.ID].FirstRow;
            visitMainInfo[Constants.Visit.MainInfo.Visitor] = visitorId;

            // Set date, comment, duty
            visitMainInfo[Constants.Visit.MainInfo.DateTime] = request.Date;
            visitMainInfo[Constants.Visit.MainInfo.Comment] = request.Comment;
            visitMainInfo[Constants.Visit.MainInfo.Duty] = request.DutyId;

            // Set or generate number
            var numeratorRuleService = sessionContext.ObjectContext.GetService<INumerationRulesService>();
            var visitBaseCard = sessionContext.ObjectContext.GetObject<BaseCard>(visitId);
            numberText = request.VisitNumber;
            if (visitMainInfo.GetString(Constants.Visit.MainInfo.Number) != request.VisitNumber || request.VisitNumber == null || request.VisitNumber == String.Empty)
            {
                BaseCardNumber number;
                if (!String.IsNullOrEmpty(request.VisitNumber))
                {
                    number = numeratorRuleService.CreateTextNumber(visitBaseCard, request.VisitNumber);
                }
                else
                {
                    NumerationRulesRule rule = sessionContext.ObjectContext.GetObject<NumerationRulesRule>(Constants.Visit.NumerationRuleID);
                    number = numeratorRuleService.CreateNumber(visit, visitBaseCard, rule);
                }
                numberText = number.Number;
                visitMainInfo[Constants.Visit.MainInfo.Number] = number.GetObjectId();
            }

            // Set default state
            var visitSystemInfo = visit.Sections[Constants.Visit.System.ID].FirstRow;
            visitSystemInfo[Constants.Visit.System.State] = Constants.Visit.MainStateID;

            // Set items
            var recipients = visitor.Sections[Constants.Visitor.Recipients.ID].GetAllRows();
            var visitorMainInfo = visitor.Sections[Constants.Visitor.MainInfo.ID].FirstRow;
            visit.Sections[Constants.Visit.Items.ID].Rows.Clear();
            foreach (var item in request.Items)
            {
                var itemsSection = visit.Sections[Constants.Visit.Items.ID];
                var itemRow = itemsSection.CreateRow();
                itemRow[Constants.Visit.Items.ItemCode] = item.Code;
                itemRow[Constants.Visit.Items.Count] = 1;
                itemRow[Constants.Visit.Items.Comment] = item.Comment;
                if (item.Recipient != Guid.Empty)
                {
                    itemRow[Constants.Visit.Items.Recipient] = item.Recipient;
                }
                else if (!String.IsNullOrEmpty(item.RecipientName))
                {
                    bool recipientFound = false;
                    foreach (var recipient in recipients)
                    {
                        var name = recipient[Constants.Visitor.Recipients.FirstName]?.ToString();
                        if (name?.ToLower().Trim() == item.RecipientName.ToLower().Trim())
                        {
                            itemRow[Constants.Visit.Items.Recipient] = recipient.Id;
                            recipientFound = true;
                            break;
                        }
                    }
                    if (!recipientFound)
                    {
                        if (item.RecipientName.ToLower().Trim() == visitorMainInfo[Constants.Visitor.MainInfo.FirstName]?.ToString().ToLower().Trim())
                        {
                            itemRow[Constants.Visit.Items.Recipient] = Guid.Empty;
                        }
                        else
                        {
                            itemRow[Constants.Visit.Items.Comment] = item.RecipientName;
                        }
                    }
                }
            }

            sessionContext.ObjectContext.AcceptChanges();

            Trace.TraceInformation("Complete visit creation. Visit id: " + visitId + ", Visit number: " + numberText);
        }

        [HttpGet]
        public CommonResponse<List<VisitorVisit>> GetVisits([FromUri] Guid visitorId)
        {
            List<VisitorVisit> visits = new List<VisitorVisit>();

            var sessionContext = _currentObjectContextProvider.GetOrCreateCurrentSessionContext();
            var numeratorRuleService = sessionContext.ObjectContext.GetService<INumerationRulesService>();
            
            Trace.TraceInformation("Loading loading visits for visitor: " + visitorId);
            var visitorData = sessionContext.AdvancedCardManager.GetCardData(visitorId);
            var visitsSection = visitorData.Sections[Constants.Visitor.Visits.ID].GetAllRows();
            foreach (var visitRow in visitsSection)
            {
                var visitId = (Guid)visitRow[Constants.Visitor.Visits.Visit];
                var visit = LoadVisit(sessionContext, visitId, visitorData);
                visits.Add(visit);
            }
            return CommonResponse.CreateSuccess(visits);
        }

        [HttpPost]
        public CommonResponse<List<VisitorVisit>> FindVisitsByDate([FromBody] FindVisitsRequest request)
        {
            List<VisitorVisit> visits = new List<VisitorVisit>();

            var sessionContext = _currentObjectContextProvider.GetOrCreateCurrentSessionContext();
            var numeratorRuleService = sessionContext.ObjectContext.GetService<INumerationRulesService>();

            Trace.TraceInformation("Loading loading visits: " + JsonHelper.SerializeToJson(request));

            SearchQuery searchQuery = sessionContext.Session.CreateSearchQuery();
            CardTypeQuery typeQuery = searchQuery.AttributiveSearch.CardTypeQueries.AddNew(Constants.Visitor.ID);

            SectionQuery sectionQuery = typeQuery.SectionQueries.AddNew(Constants.Visit.MainInfo.ID);

            sectionQuery.ConditionGroup.Operation = ConditionGroupOperation.And;
            
            sectionQuery.ConditionGroup.Conditions.AddNew(Constants.Visit.MainInfo.DateTime, DocsVision.Platform.ObjectManager.Metadata.FieldType.DateTime, ConditionOperation.GreaterEqual, request.From.StartOfDay());
            sectionQuery.ConditionGroup.Conditions.AddNew(Constants.Visit.MainInfo.DateTime, DocsVision.Platform.ObjectManager.Metadata.FieldType.DateTime, ConditionOperation.LessEqual, request.To.EndOfDay());

            string query = searchQuery.GetXml(null, true);

            Trace.TraceInformation("Searching visits: " + query);

            CardDataCollection cardCollection = sessionContext.Session.CardManager.FindCards(query);
            foreach (var visitCard in cardCollection)
            {
                var visitId = visitCard.Id;
                try
                {
                    var visit = LoadVisit(sessionContext, visitId);
                    visits.Add(visit);
                }
                catch (Exception ex)
                {
                    Trace.TraceError(ex);
                }
            }

            return CommonResponse.CreateSuccess(visits);
        }

        [HttpGet]
        public CommonResponse<VisitorVisit> GetVisit([FromUri] Guid visitId)
        {
            var sessionContext = _currentObjectContextProvider.GetOrCreateCurrentSessionContext();
            VisitorVisit visit = LoadVisit(sessionContext, visitId);
            return CommonResponse.CreateSuccess(visit);
        }

        [HttpGet]
        public CommonResponse<VisitorVisit> GetVisitByNumber([FromUri] string visitNumber)
        {
            var sessionContext = _currentObjectContextProvider.GetOrCreateCurrentSessionContext();
            Guid visitId = FindVisitByNumber(visitNumber, sessionContext);
            if (visitId != Guid.Empty)
            {
                VisitorVisit visit = LoadVisit(sessionContext, visitId);
                return CommonResponse.CreateSuccess(visit);
            }
            else
            {
                return CommonResponse.CreateError<VisitorVisit>("Visit not found");
            }
        }

        private static Guid FindVisitByNumber(string visitNumber, SessionContext sessionContext)
        {
            SearchQuery searchQuery = sessionContext.Session.CreateSearchQuery();
            CardTypeQuery typeQuery = searchQuery.AttributiveSearch.CardTypeQueries.AddNew(Constants.Visit.ID);
            SectionQuery sectionQuery = typeQuery.SectionQueries.AddNew(Constants.Visit.Numbers.ID);
            sectionQuery.ConditionGroup.Operation = ConditionGroupOperation.And;
            sectionQuery.ConditionGroup.Conditions.AddNew(Constants.Visit.Numbers.Number, DocsVision.Platform.ObjectManager.Metadata.FieldType.String, ConditionOperation.Equals, visitNumber);
            string query = searchQuery.GetXml(null, true);
            CardDataCollection cardCollection = sessionContext.Session.CardManager.FindCards(query);
            Trace.TraceInformation("Searching visit by number " + visitNumber + ", found: " + cardCollection.Count);
            if (cardCollection.Count > 0)
            {
                return cardCollection[0].Id;
            }
            else
            {
                return Guid.Empty;
            }
        }

        private VisitorVisit LoadVisit(SessionContext sessionContext, Guid visitId, CardData visitorData = null)
        {
            
            var numeratorRuleService = sessionContext.ObjectContext.GetService<INumerationRulesService>();

            Trace.TraceInformation("Loading visitId: " + visitId);
            var visitData = sessionContext.AdvancedCardManager.GetCardData(visitId);
            var visitMainInfo = visitData.Sections[Constants.Visit.MainInfo.ID].FirstRow;
            var visit = new VisitorVisit();
            visit.Id = visitData.Id;
            visit.Date = visitMainInfo.GetDateTime(Constants.Visit.MainInfo.DateTime) ?? DateTime.MinValue;
            visit.Comment = visitMainInfo.GetString(Constants.Visit.MainInfo.Comment) ?? String.Empty;
            visit.VisitorId = visitMainInfo.GetGuid(Constants.Visit.MainInfo.Visitor) ?? Guid.Empty;
            if (visitorData == null)
            {
                visitorData = sessionContext.AdvancedCardManager.GetCardData(visit.VisitorId);
            }
            var visitorMainInfo = visitorData.Sections[Constants.Visitor.MainInfo.ID].FirstRow;

            visit.DutyId = visitMainInfo.GetGuid(Constants.Visit.MainInfo.Duty) ?? Guid.Empty;
            if (visit.DutyId != Guid.Empty)
            {
                Trace.TraceInformation("Loading duty: " + visit.DutyId);
                var employee = sessionContext.ObjectContext.GetObject<StaffEmployee>(visit.DutyId);
                visit.DutyName = employee.DisplayString;
            }

            Trace.TraceInformation("Loading visit number.");
            var visitBaseCard = sessionContext.ObjectContext.GetObject<BaseCard>(visitId);
            visit.VisitNumber = numeratorRuleService.GetNumber(visitBaseCard, visitMainInfo.GetGuid(Constants.Visit.MainInfo.Number) ?? Guid.Empty)?.Number;

            visit.Items = new List<VisitItem>();
            var visitItemsData = visitData.Sections[Constants.Visit.Items.ID].GetAllRows();
            Trace.TraceInformation("Loading items count: " + visitItemsData.Count);
            foreach (var itemData in visitItemsData)
            {
                Trace.TraceInformation("Loading item: " + itemData.Id);

                var item = new VisitItem();
                item.Code = itemData.GetString(Constants.Visit.Items.ItemCode);
                item.Name = itemData.GetString(Constants.Visit.Items.ItemName);
                item.Recipient = itemData.GetGuid(Constants.Visit.Items.Recipient) ?? Guid.Empty;
                if (item.Recipient != Guid.Empty && visitorData.Sections[Constants.Visitor.Recipients.ID].RowExists(item.Recipient))
                {
                    Trace.TraceInformation("Loading recipient: " + item.Recipient);
                    RowData recepientRow = null;
                    try
                    {
                        recepientRow = visitorData.Sections[Constants.Visitor.Recipients.ID].GetRow(item.Recipient);
                    }
                    catch (Exception ex)
                    {
                        Trace.TraceError(ex);
                    }
                    if (recepientRow != null)
                    {
                        item.RecipientName = recepientRow.GetString(Constants.Visitor.Recipients.FirstName);
                        var family = recepientRow.GetString(Constants.Visitor.Recipients.LastName);
                        if (!String.IsNullOrEmpty(family))
                        {
                            item.RecipientName += " " + family;
                        }
                        var relation = recepientRow.GetInt32(Constants.Visitor.Recipients.Relationship);
                        if (relation != null)
                        {
                            var relationName = recepientRow.Section.Fields[Constants.Visitor.Recipients.Relationship].Type.EnumValues.First(x => x.Value == relation).Name;
                            item.RecipientName += " (" + relationName + ")";
                        }
                    }
                }
                else if (item.Recipient == Guid.Empty && itemData.GetGuid(Constants.Visit.Items.Recipient) != null)
                {
                    item.RecipientName = visitorMainInfo.GetString(Constants.Visitor.MainInfo.FirstName);
                }

                item.Count = itemData.GetInt32(Constants.Visit.Items.Count) ?? 1;
                item.Comment = itemData.GetString(Constants.Visit.Items.Comment);
                item.Source = (ItemSource)(itemData.GetInt32(Constants.Visit.Items.Source) ?? (int)ItemSource.Common);
                visit.Items.Add(item);
            }

            return visit;
        }
    }
}
