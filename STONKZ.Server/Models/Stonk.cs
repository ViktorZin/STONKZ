using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace STONKZ.Server.Models
{
    public class Stonk
    {
        public int                      StonkId         { get; set; }
        public string                   StonkName       { get;  set; }

        public ICollection<StonkData>   StonkHistory    {  get; set; }  
    }
}
