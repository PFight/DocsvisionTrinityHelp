using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrinityHelp
{

    public class CreateVisitItem
    {
        public string Code { get; set; }
        public string RecipientName { get; set; }

        public Guid Recipient { get; set; }

        public string Comment { get; set; }
    }

    /// <summary>
    /// Класс, определяющий параметры запроса.
    /// </summary>
    public class CreateVisitRequest
    {
        public string VisitNumber { get; set; }

        public DateTime Date { get; set; }

        public Guid VisitorId { get; set; }
        public string VisitorPassport { get; set; }
        public string VisitorPhone { get; set; }

        public string Comment { get; set; }

        public string DutyId { get; set; }

        public List<CreateVisitItem> Items { get; set; } = new List<CreateVisitItem> { };
    }
}
