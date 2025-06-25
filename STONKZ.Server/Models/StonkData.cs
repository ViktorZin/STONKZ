using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace STONKZ.Server.Models
{
    public class StonkData
    {
        public int      StonkDataId         { get; set; }
        public DateTime Date                { get; set; }
        public decimal  Price               { get; set; }
        public decimal  Open                { get; set; }
        public decimal  High                { get; set; }
        public decimal  Low                 { get; set; }
        public long     Volume              { get; set; }
        public double   ChangePercentage    { get; set; }
    }
}
