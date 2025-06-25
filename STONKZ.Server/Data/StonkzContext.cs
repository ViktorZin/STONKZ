using Microsoft.EntityFrameworkCore;
using STONKZ.Server.Models;

namespace STONKZ.Server.Data
{
    public class StonkzContext : DbContext
    {
        public DbSet<Stonk>         Stonkz      { get; set; }
        public DbSet<StonkData>     StonkDataz  { get; set; }


        public StonkzContext() { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=StonkzAppData;");
        }

    }
}
