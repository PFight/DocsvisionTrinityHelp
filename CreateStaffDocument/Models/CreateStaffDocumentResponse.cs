using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrinityHelp.Feature1.Models
{
    /// <summary>
    /// Модель ответа сервера.
    /// </summary>
    public class CreateStaffDocumentResponse
    {
        /// <summary>
        /// Идентификатор обработанного документа.
        /// </summary>
        public Guid DocumentId { get; set; }

        public string DocumentName { get; set; }
    }
}
