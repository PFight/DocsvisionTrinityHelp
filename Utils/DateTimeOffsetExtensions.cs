using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrinityHelp
{
    public static class DateTimeOffsetExtensions
    {
        public static DateTime StartOfDay(this DateTime dateTime)
        {
            return dateTime.Date;
        }
        public static DateTime EndOfDay(this DateTime dateTime)
        {
            return dateTime.Date.AddDays(1).AddTicks(-1);
        }
    }
}
