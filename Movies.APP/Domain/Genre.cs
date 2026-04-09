using CORE.APP.Domain;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Movies.APP.Domain
{
    public class Genre : Entity
    {
        [Required, StringLength(50)]
        public string Name { get; set; }

        public List<MovieGenre> MovieGenres { get; set; } = new List<MovieGenre>(); // navigation property

        [NotMapped]
        public List<int> MovieIds
        {
            get => MovieGenres.Select(mg => mg.MovieId).ToList();
            set => MovieGenres = value.Select(mid => new MovieGenre() { MovieId = mid }).ToList();
        }
    }
}
