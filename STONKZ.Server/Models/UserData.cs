namespace STONKZ.Server.Models
{
    public class UserData
    {
        public int Id { get; set; }
        public string UserName {  get; set; }
        public decimal AccountBalance { get; set; }
        public DateTime GameDay { get; set; }
        public decimal TransactionFee { get; set; }
    }
}
