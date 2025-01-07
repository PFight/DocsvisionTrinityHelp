using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrinityHelp.Feature1.Models
{
    public enum AccountingDocumentType
    {
        Act,
        Upd,
        Torg12,
        Account,
        Contract
    }

    /// <summary>
    /// Класс, определяющий параметры запроса.
    /// </summary>
    public class CreateAccountingDocumentRequest
    {
        public Guid PaymentId { get; set; }

        public AccountingDocumentType DocumentType { get; set; }
    }
}
