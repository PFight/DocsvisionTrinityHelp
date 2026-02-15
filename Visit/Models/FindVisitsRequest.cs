using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrinityHelp
{
    /// <summary>
    /// Класс, определяющий параметры запроса.
    /// </summary>
    public class FindVisitsRequest
    {
        public DateTime From { get; set; }

        public DateTime To { get; set; }
    }
}
