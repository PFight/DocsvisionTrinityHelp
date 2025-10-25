using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrinityHelp.Feature1.Models
{

    /// <summary>
    /// Класс, определяющий параметры запроса.
    /// </summary>
    public class CreateOrderRequest
    {
        public Guid VisitorId { get; set; }
    }
}
