using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrinityHelp.Visitor.Models
{
    public class FindVisitorsRequest
    {
        public string Passport { get; set; }
        public string Phone { get; set; }

        public string ContactPhone { get; set; }

        public DateTime? BirthDate { get; set; }

        public string LastName { get; set; }

        public string FirstName { get; set; }

        public string SecondaryName { get; set; }
    }
}
