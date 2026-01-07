using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrinityHelp.Visit.Models
{
    public class VisitItem
    {
        public string Code { get; set; }

        public string Name { get; set; }

        public Guid Recipient { get; set; }

        public string RecipientName { get; set; }

        public string Comment { get; set; }

        public int Count { get; set; }

        public ItemSource Source { get; set; }
    }
}
