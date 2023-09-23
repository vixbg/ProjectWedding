using Microsoft.EntityFrameworkCore;

namespace Backend.Models
{
    public class BackendDbContext : DbContext
    {
        public BackendDbContext(DbContextOptions<BackendDbContext> options) 
            : base(options)
        { }

        public DbSet<WeddingGuest> Guests { get; set; }
    }
}