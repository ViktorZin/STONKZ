using Microsoft.EntityFrameworkCore;
using STONKZ.Server.Models;

namespace STONKZ.Server.Data
{
    public class UserDataContext : DbContext
    {
        public DbSet<UserData> UserDatas { get; set; } = null!;

        public DbSet<OwnedStonkz> OwnedStonkzs { get; set; } = null!;

        public UserDataContext() { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=StonkzAppData;",
                options => options.EnableRetryOnFailure());

        }


    }
}
