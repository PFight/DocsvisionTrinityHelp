using DocsVision.BackOffice.CardLib.CardDefs;
using DocsVision.BackOffice.ObjectModel;
using DocsVision.Platform.WebClient;
using DocsVision.Platform.WebClient.ExtensionMethods;
using DocsVision.Platform.WebClient.Models;
using DocsVision.Platform.WebClient.Models.Generic;
using DocsVision.WebClientLibrary.ObjectModel.Services.EntityLifeCycle;
using DocsVision.WebClientLibrary.ObjectModel.Services.EntityLifeCycle.Options;
using System;
using System.Diagnostics;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Web.Http;
using TrinityHelp.Feature1.Models;
using static System.Collections.Specialized.BitVector32;

namespace TrinityHelp.Feature1
{
    public class CreateAccountingDocumentController : ApiController
    {
        private readonly ICurrentObjectContextProvider _currentObjectContextProvider;
        private readonly ILifeCycleServiceEx cardLifeCycle;

        public CreateAccountingDocumentController(
            ICurrentObjectContextProvider currentObjectContextProvider,
            ILifeCycleServiceEx cardLifeCycleEx)
        {
            _currentObjectContextProvider = currentObjectContextProvider;
            cardLifeCycle = cardLifeCycleEx;
        }

        [HttpPost]
        public CommonResponse<CreateAccountingDocumentResponse> Create(CreateAccountingDocumentRequest request)
        {
            var sessionContext = _currentObjectContextProvider.GetOrCreateCurrentSessionContext();

            var payment = sessionContext.AdvancedCardManager.GetCardData(request.PaymentId);
            var paymentAccounting = payment.Sections.FirstOrDefault(x => x.Id == Constants.Accounting.ID).FirstRow;
            var paymentPayment = payment.Sections[Constants.Payment.ID].FirstRow;
            var paymentMainInfo = payment.Sections[CardDocument.MainInfo.ID].FirstRow;

            var contract = paymentAccounting[Constants.Accounting.Contract];
            var partner = paymentAccounting[Constants.Accounting.Partner];
            var summ = paymentAccounting[Constants.Accounting.Summ];
            var name = paymentMainInfo[CardDocument.MainInfo.Name];

            Guid documentKind;
            switch(request.DocumentType)
            {
                case AccountingDocumentType.Account:
                    documentKind = Constants.Kinds.Account; 
                    break;
                case AccountingDocumentType.Act:
                case AccountingDocumentType.Torg12:
                case AccountingDocumentType.Upd:
                    documentKind = Constants.Kinds.TransferDocument; 
                    break;
                case AccountingDocumentType.Contract: 
                    documentKind = Constants.Kinds.Contract; 
                    break;
                default: throw new InvalidOperationException("Unknown document type");
            }
            var lifeCycle = cardLifeCycle.GetCardLifeCycle(CardDocument.ID);
            var documentId = lifeCycle.Create(sessionContext, new CardCreateLifeCycleOptions()
            {
                CardKindId = documentKind
            });
            var document = sessionContext.AdvancedCardManager.GetCardData(documentId);
            var documentAccounting = document.Sections[Constants.Accounting.ID].FirstRow;
            var documentMainInfo = document.Sections[CardDocument.MainInfo.ID].FirstRow;
            documentAccounting[Constants.Accounting.Contract] = contract;
            documentAccounting[Constants.Accounting.Partner] = partner;
            documentAccounting[Constants.Accounting.Summ] = summ;
            documentMainInfo[CardDocument.MainInfo.Name] = name;

            if (documentKind == Constants.Kinds.Account) 
            {
                paymentPayment[Constants.Payment.Account] = documentId;
            } 
            else if (documentKind == Constants.Kinds.TransferDocument)
            {
                paymentPayment[Constants.Payment.TransferDocument] = documentId;
                switch (request.DocumentType)
                {
                    case AccountingDocumentType.Upd:
                        documentAccounting[Constants.Accounting.TransferDocumentType] = Constants.Accounting.TransferDocumentTypes.UPD;
                        break;
                    case AccountingDocumentType.Act:
                        documentAccounting[Constants.Accounting.TransferDocumentType] = Constants.Accounting.TransferDocumentTypes.Act;
                        break;
                    case AccountingDocumentType.Torg12:
                        documentAccounting[Constants.Accounting.TransferDocumentType] = Constants.Accounting.TransferDocumentTypes.Torg12;
                        break;
                }

            }
            else if (documentKind == Constants.Kinds.Contract)
            {
                paymentAccounting[Constants.Accounting.Contract] = documentId;
            }

            return CommonResponse.CreateSuccess(sessionContext, request.PaymentId, new CreateAccountingDocumentResponse()
            {
                DocumentId = documentId
            });
        }
    }
}
