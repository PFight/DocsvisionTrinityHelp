using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrinityHelp.Feature1.Models
{
    public enum StaffDocumentType
    {
        Contract,
        ContractAddition,
        Order,
        Statement,
        VacationShedule
    }

    /// <summary>
    /// Класс, определяющий параметры запроса.
    /// </summary>
    public class CreateStaffDocumentRequest
    {
        public string EventName { get; set; }
        public StaffDocumentType DocumentType { get; set; }
        public Guid EmployeeId { get; set; }

        public DateTime Date { get; set; }
    }
}
