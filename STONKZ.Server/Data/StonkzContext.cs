using Microsoft.EntityFrameworkCore;
using STONKZ.Server.Models;

namespace STONKZ.Server.Data
{
    public class StonkzContext : DbContext
    {
        public DbSet<Stonk> Stonkz { get; set; } = null!;
        public DbSet<StonkData> StonkDataz { get; set; } = null!;


        public StonkzContext() { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=StonkzAppData;");
        }

    }
}
