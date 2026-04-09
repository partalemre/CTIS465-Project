using CORE.APP.Domain;

namespace Movies.APP.Domain
{
    public class MovieGenre : Entity
    {
        public int MovieId { get; set; }
        public Movie Movie { get; set; } // navigation property

        public int GenreId { get; set; }
        public Genre Genre { get; set; } // navigation property
    }
}
