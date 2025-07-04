namespace STONKZ.Server.Models
{
    public class OwnedStonkz
    {
        public int Id { get; set; }
        public int StonkId { get; set; }
        public decimal PricePerStonk { get; set; }
        public DateTime BoughtDate { get; set; }

        public UserData UserData { get; set; }
    }
}
