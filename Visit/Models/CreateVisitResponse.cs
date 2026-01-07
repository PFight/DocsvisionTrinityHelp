using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrinityHelp
{
    /// <summary>
    /// Модель ответа сервера.
    /// </summary>
    public class CreateVisitResponse
    {
        /// <summary>
        /// Идентификатор обработанного документа.
        /// </summary>
        public Guid VisitId { get; set; }

        public string VisitNumber { get; set; }
    }
}
