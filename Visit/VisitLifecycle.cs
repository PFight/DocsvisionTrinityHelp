using DocsVision.Platform.WebClient;
using DocsVision.WebClientLibrary.ObjectModel.Services.EntityLifeCycle.Options;
using DocsVision.WebClientLibrary.ObjectModel.Services.EntityLifeCycle;
using System;
using DocsVision.Platform.WebClient.Diagnostics;

namespace TrinityHelp
{
    /// <summary>
    /// Declares default card life cycle
    /// </summary>
    public class VisitLifecycle : BaseCardLifeCycleEx, IDefaultCardLifeCycleEx
    {
        private readonly Guid cardTypeId = Constants.Visit.ID;

        /// <inheritdoc />
        public override Guid CardTypeId
        {
            get { return this.cardTypeId; }
        }

        /// <summary>
        /// Creates a new instance of <see cref="DefaultCardLifeCycle"/>
        /// </summary>
        public VisitLifecycle()
        {
        }

        /// <inheritdoc />
        public override Guid Create(SessionContext sessionContext, CardCreateLifeCycleOptions options)
        {

            Trace.TraceError("Dbg TrinityHelp: create kind " + options.CardKindId);

            if (options.TemplateId != null && options.TemplateId != Guid.Empty)
            {
                return sessionContext.AdvancedCardManager.CreateCard(options.TemplateId.Value);
            }
            else
            {
                var cardId = sessionContext.AdvancedCardManager.CreateCard(this.cardTypeId, options.CardKindId);
                var card = sessionContext.AdvancedCardManager.GetCardData(cardId);

                var systemRow = card.Sections[Constants.Visit.System.ID].FirstRow;
                systemRow[Constants.Visit.System.State] = Constants.Visit.MainStateID;

                Trace.TraceError("Dbg TrinityHelp: " + cardId + " " + systemRow[Constants.Visitor.System.State]);
                return cardId;
            }
        }
    }
}


