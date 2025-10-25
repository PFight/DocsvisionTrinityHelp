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
    public class CreateOrderResponse
    {
        /// <summary>
        /// Идентификатор обработанного документа.
        /// </summary>
        public Guid OrderId { get; set; }
    }
}
