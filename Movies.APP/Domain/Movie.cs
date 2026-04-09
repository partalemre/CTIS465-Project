using CORE.APP.Domain;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Movies.APP.Domain
{
    public class Movie : Entity
    {
        [Required, StringLength(200)]
        public string Name { get; set; }

        public DateTime? ReleaseDate { get; set; }

        public decimal TotalRevenue { get; set; }

        public int DirectorId { get; set; }

        public Director Director { get; set; } // navigation property

        public List<MovieGenre> MovieGenres { get; set; } = new List<MovieGenre>(); // navigation property

        [NotMapped]
        public List<int> GenreIds
        {
            get => MovieGenres.Select(mg => mg.GenreId).ToList();
            set => MovieGenres = value.Select(gid => new MovieGenre() { GenreId = gid }).ToList();
        }
    }
}
