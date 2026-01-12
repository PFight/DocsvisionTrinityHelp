using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrinityHelp.Visit.Models
{
    public class VisitorVisit
    {
        public Guid Id { get; set; }

        public string VisitNumber { get; set; }

        public DateTime Date { get; set; }

        public Guid VisitorId { get; set; }

        public string Comment { get; set; }

        public Guid DutyId { get; set; }

        public string DutyName { get; set; }

        public List<VisitItem> Items { get; set; } = new List<VisitItem> { };
    }
}
