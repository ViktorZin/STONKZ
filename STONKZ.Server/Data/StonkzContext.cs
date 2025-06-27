using Microsoft.EntityFrameworkCore;
using STONKZ.Server.Models;

namespace STONKZ.Server.Data
{
    public class StonkzContext : DbContext
    {
        public DbSet<Stonk> Stonkz { get; set; } = null!;
        public DbSet<StonkData> StonkData { get; set; } = null!;


        public StonkzContext() { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer(@"Data Source=(localdb)\MSSQLLocalDB;Initial Catalog=StonkzAppData;", 
                options => options.EnableRetryOnFailure());
            //optionsBuilder.EnableSensitiveDataLogging(true);
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Stonk>()
                .HasMany(s => s.StonkHistory)
                .WithOne(sd => sd.Stonk)
                .HasForeignKey(sd => sd.StonkId);
        }

    }
}
