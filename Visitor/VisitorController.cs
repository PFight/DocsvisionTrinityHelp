using DocsVision.Helpers;
using DocsVision.Platform.ObjectManager;
using DocsVision.Platform.ObjectManager.SearchModel;
using DocsVision.Platform.WebClient;
using DocsVision.Platform.WebClient.Diagnostics;
using DocsVision.Platform.WebClient.Models;
using DocsVision.Platform.WebClient.Models.Generic;
using System;
using System.Collections.Generic;
using System.Web.Http;
using TrinityHelp.Visitor.Models;

namespace TrinityHelp.Feature1
{
    public class VisitorController : ApiController
    {
        private readonly ICurrentObjectContextProvider _currentObjectContextProvider;

        public VisitorController(
            ICurrentObjectContextProvider currentObjectContextProvider)
        {
            _currentObjectContextProvider = currentObjectContextProvider;
        }

        [HttpPost]
        public CommonResponse<List<FoundVisitor>> Find(FindVisitorsRequest request)
        {
            Trace.TraceInformation("Find visitor: " + JsonHelper.SerializeToJson(request));

            var sessionContext = _currentObjectContextProvider.GetOrCreateCurrentSessionContext();

            
            SearchQuery searchQuery = sessionContext.Session.CreateSearchQuery();
            CardTypeQuery typeQuery = searchQuery.AttributiveSearch.CardTypeQueries.AddNew(Constants.Visitor.ID);

            SectionQuery sectionQuery = typeQuery.SectionQueries.AddNew(Constants.Visitor.MainInfo.ID);

            sectionQuery.ConditionGroup.Operation = ConditionGroupOperation.Or;
            if (!String.IsNullOrWhiteSpace(request.Passport))
            {
                sectionQuery.ConditionGroup.Conditions.AddNew(Constants.Visitor.MainInfo.Passport, DocsVision.Platform.ObjectManager.Metadata.FieldType.String, ConditionOperation.Contains, request.Passport);
            }
            if (!String.IsNullOrWhiteSpace(request.Phone))
            {
                sectionQuery.ConditionGroup.Conditions.AddNew(Constants.Visitor.MainInfo.MainPhoneNumber, DocsVision.Platform.ObjectManager.Metadata.FieldType.String, ConditionOperation.Contains, request.Phone);
                sectionQuery.ConditionGroup.Conditions.AddNew(Constants.Visitor.MainInfo.ContactPhone, DocsVision.Platform.ObjectManager.Metadata.FieldType.String, ConditionOperation.Contains, request.Phone);
            }
            if (!String.IsNullOrWhiteSpace(request.ContactPhone))
            {
                sectionQuery.ConditionGroup.Conditions.AddNew(Constants.Visitor.MainInfo.MainPhoneNumber, DocsVision.Platform.ObjectManager.Metadata.FieldType.String, ConditionOperation.Contains, request.ContactPhone);
                sectionQuery.ConditionGroup.Conditions.AddNew(Constants.Visitor.MainInfo.ContactPhone, DocsVision.Platform.ObjectManager.Metadata.FieldType.String, ConditionOperation.Contains, request.ContactPhone);
            }
            if (request.BirthDate != null)
            {
                sectionQuery.ConditionGroup.Conditions.AddNew(Constants.Visitor.MainInfo.BirthDate, DocsVision.Platform.ObjectManager.Metadata.FieldType.Date, ConditionOperation.Equals, request.BirthDate);
            }

            var fioGroup = sectionQuery.ConditionGroup.ConditionGroups.AddNew();
            {
                fioGroup.Operation = ConditionGroupOperation.And;
                if (request.LastName != null)
                {
                    fioGroup.Conditions.AddNew(Constants.Visitor.MainInfo.LastName, DocsVision.Platform.ObjectManager.Metadata.FieldType.String, ConditionOperation.Contains, request.LastName);
                }
                if (request.FirstName != null)
                {
                    fioGroup.Conditions.AddNew(Constants.Visitor.MainInfo.FirstName, DocsVision.Platform.ObjectManager.Metadata.FieldType.String, ConditionOperation.Contains, request.FirstName);
                }
                if (request.SecondaryName != null)
                {
                    fioGroup.Conditions.AddNew(Constants.Visitor.MainInfo.FirstName, DocsVision.Platform.ObjectManager.Metadata.FieldType.String, ConditionOperation.Contains, request.SecondaryName);
                }
            }


            string query = searchQuery.GetXml(null, true);

            Trace.TraceInformation("Find visitor: " + query);

            CardDataCollection cardCollection = sessionContext.Session.CardManager.FindCards(query);

            Trace.TraceInformation("Found " + cardCollection.Count);

            var result = new List<FoundVisitor>();
            foreach (var visitorResult in cardCollection)
            {
                try
                {
                    var visitorId = visitorResult.Id;
                    var visitorData = sessionContext.AdvancedCardManager.GetCardData(visitorId);
                    var visitorMainInfo = visitorData.Sections[Constants.Visitor.MainInfo.ID].FirstRow;
                    result.Add(new FoundVisitor() 
                    {
                        CardId = visitorId,
                        FirstName = visitorMainInfo.GetString(Constants.Visitor.MainInfo.FirstName),
                        LastName = visitorMainInfo.GetString(Constants.Visitor.MainInfo.LastName),
                        SecondaryName = visitorMainInfo.GetString(Constants.Visitor.MainInfo.SecondaryName),
                        BirthDate = visitorMainInfo.GetDateTime(Constants.Visitor.MainInfo.BirthDate),
                        Phone = visitorMainInfo.GetString(Constants.Visitor.MainInfo.MainPhoneNumber),
                        Passport = visitorMainInfo.GetString(Constants.Visitor.MainInfo.Passport),
                    });
                }
                catch (Exception ex)
                {
                    Trace.TraceError("Can't load found visitor " + visitorResult.Id);
                    Trace.TraceError(ex);
                }
            }

            return CommonResponse.CreateSuccess(result);
        }
    }
}
