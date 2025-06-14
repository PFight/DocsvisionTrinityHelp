using DocsVision.BackOffice.CardLib.CardDefs;
using DocsVision.Platform.WebClient;
using DocsVision.Platform.WebClient.Models;
using DocsVision.Platform.WebClient.Models.Generic;
using DocsVision.WebClientLibrary.ObjectModel.Services.EntityLifeCycle;
using DocsVision.WebClientLibrary.ObjectModel.Services.EntityLifeCycle.Options;
using System;
using System.Collections.Generic;
using System.Web.Http;
using TrinityHelp.Feature1.Models;

namespace TrinityHelp.Feature1
{
    public class CreateStaffDocumentController : ApiController
    {
        private readonly ICurrentObjectContextProvider _currentObjectContextProvider;
        private readonly ILifeCycleServiceEx cardLifeCycle;
        private readonly Dictionary<Guid, string> documentName = new Dictionary<Guid, string>()
        {
            { Constants.Kinds.StaffContract, "Трудовой договор" },
            { Constants.Kinds.StaffContractAddition, "Доп. соглашение - {0}" },
            { Constants.Kinds.StaffStatement, "Заявление сотрудника - {0}" },
            { Constants.Kinds.StaffOrder, "Приказ - {0}" },
            { Constants.Kinds.StaffVacationSchedule, "График отпусков" },
        };

        public CreateStaffDocumentController(
            ICurrentObjectContextProvider currentObjectContextProvider,
            ILifeCycleServiceEx cardLifeCycleEx)
        {
            _currentObjectContextProvider = currentObjectContextProvider;
            cardLifeCycle = cardLifeCycleEx;
        }

        [HttpPost]
        public CommonResponse<CreateStaffDocumentResponse> Create(CreateStaffDocumentRequest request)
        {
            var sessionContext = _currentObjectContextProvider.GetOrCreateCurrentSessionContext();

            Guid documentKind;
            switch(request.DocumentType)
            {
                case StaffDocumentType.Contract:
                    documentKind = Constants.Kinds.StaffContract; 
                    break;
                case StaffDocumentType.ContractAddition:
                    documentKind = Constants.Kinds.StaffContractAddition;
                    break;
                case StaffDocumentType.Statement:
                    documentKind = Constants.Kinds.StaffStatement;
                    break;
                case StaffDocumentType.Order:
                    documentKind = Constants.Kinds.StaffOrder; 
                    break;
                case StaffDocumentType.VacationShedule: 
                    documentKind = Constants.Kinds.StaffVacationSchedule; 
                    break;
                default: throw new InvalidOperationException("Unknown document type");
            }
            var lifeCycle = cardLifeCycle.GetCardLifeCycle(CardDocument.ID);
            var documentId = lifeCycle.Create(sessionContext, new CardCreateLifeCycleOptions()
            {
                CardKindId = documentKind
            });
            var document = sessionContext.AdvancedCardManager.GetCardData(documentId);
            var documentMainInfo = document.Sections[CardDocument.MainInfo.ID].FirstRow;
            string name = documentName[documentKind];
            if (name.Contains("{0}"))
            {
                name = String.Format(name, request.EventName);
            }
            documentMainInfo[CardDocument.MainInfo.Name] = name;
            documentMainInfo[CardDocument.MainInfo.RegDate] = request.Date;

            var documentStaff = document.Sections[Constants.Staff.ID].FirstRow;
            documentStaff[Constants.Staff.Employee] = request.EmployeeId;

            return CommonResponse.CreateSuccess(new CreateStaffDocumentResponse()
            {
                DocumentId = documentId,
                DocumentName = name
            });
        }
    }
}
