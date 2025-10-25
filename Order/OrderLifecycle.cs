using DocsVision.Platform.WebClient;
using DocsVision.WebClientLibrary.ObjectModel.Services.EntityLifeCycle.Options;
using DocsVision.WebClientLibrary.ObjectModel.Services.EntityLifeCycle;
using System;
using DocsVision.Platform.WebClient.Diagnostics;

namespace TrinityHelp.Lifecycle
{
    /// <summary>
    /// Declares default card life cycle
    /// </summary>
    public class OrderLifecycle : BaseCardLifeCycleEx, IDefaultCardLifeCycleEx
    {
        private readonly Guid cardTypeId = Constants.Order.ID;

        /// <inheritdoc />
        public override Guid CardTypeId
        {
            get { return this.cardTypeId; }
        }

        /// <summary>
        /// Creates a new instance of <see cref="DefaultCardLifeCycle"/>
        /// </summary>
        public OrderLifecycle()
        {
        }

        /// <inheritdoc />
        public override Guid Create(SessionContext sessionContext, CardCreateLifeCycleOptions options)
        {

            if (options.TemplateId != null && options.TemplateId != Guid.Empty)
            {
                return sessionContext.AdvancedCardManager.CreateCard(options.TemplateId.Value);
            }
            else
            {
                var cardId = sessionContext.AdvancedCardManager.CreateCard(this.cardTypeId, options.CardKindId);
                var card = sessionContext.AdvancedCardManager.GetCardData(cardId);

                var systemRow = card.Sections[Constants.Order.System.ID].FirstRow;
                systemRow[Constants.Order.System.State] = Constants.Order.FirstStateID;

                return cardId;
            }
        }
    }
}


