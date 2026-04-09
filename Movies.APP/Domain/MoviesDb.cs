using Microsoft.EntityFrameworkCore;

namespace Movies.APP.Domain
{
    public class MoviesDb : DbContext
    {
        public DbSet<Movie> Movies { get; set; }
        public DbSet<Director> Directors { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<MovieGenre> MovieGenres { get; set; }

        public MoviesDb(DbContextOptions options) : base(options)
        {
        }
    }
}
