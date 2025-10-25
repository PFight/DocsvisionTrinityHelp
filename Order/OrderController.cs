using DocsVision.BackOffice.CardLib.CardDefs;
using DocsVision.BackOffice.ObjectModel;
using DocsVision.BackOffice.ObjectModel.Services;
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
    public class OrderController : ApiController
    {
        private readonly ICurrentObjectContextProvider _currentObjectContextProvider;
        private readonly ILifeCycleServiceEx cardLifeCycle;

        public OrderController(
            ICurrentObjectContextProvider currentObjectContextProvider,
            ILifeCycleServiceEx cardLifeCycleEx)
        {
            _currentObjectContextProvider = currentObjectContextProvider;
            cardLifeCycle = cardLifeCycleEx;
        }

        [HttpPost]
        public CommonResponse<CreateOrderResponse> Create(CreateOrderRequest request)
        {
            var sessionContext = _currentObjectContextProvider.GetOrCreateCurrentSessionContext();

            var referenceListService = sessionContext.ObjectContext.GetService<IReferenceListService>();

            var visitor = sessionContext.AdvancedCardManager.GetCardData(request.VisitorId);
            var visitorMainInfo = visitor.Sections[Constants.Visitor.MainInfo.ID].FirstRow;
            var referenceListId = visitorMainInfo[Constants.Visitor.MainInfo.Links];
            ReferenceList referenceList = null;
            if (referenceListId == null || (Guid)referenceListId == Guid.Empty) 
            {
                referenceList = referenceListService.CreateReferenceList();
                sessionContext.ObjectContext.SaveObject(referenceList);
                visitorMainInfo[Constants.Visitor.MainInfo.Links] = referenceList.GetObjectId();
            } 
            else
            {
                referenceList = sessionContext.ObjectContext.GetObject<ReferenceList>(referenceListId);
            }

            var lifeCycle = cardLifeCycle.GetCardLifeCycle(Constants.Order.ID);
            var orderId = lifeCycle.Create(sessionContext, new CardCreateLifeCycleOptions()
            {
                CardKindId = Constants.Order.MainKindID
            });
            var order = sessionContext.AdvancedCardManager.GetCardData(orderId);
            var orderMainInfo = order.Sections[Constants.Order.MainInfo.ID].FirstRow;
            orderMainInfo[Constants.Order.MainInfo.Visitor] = request.VisitorId;

            referenceListService.CreateReference(referenceList, null, orderId, Constants.Order.ID, false);
            sessionContext.ObjectContext.AcceptChanges();

            return CommonResponse.CreateSuccess(new CreateOrderResponse()
            {
                OrderId = orderId
            });
        }
    }
}
