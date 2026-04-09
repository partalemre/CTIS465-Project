using CORE.APP.Models;
using CORE.APP.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.APP.Domain;
using System.ComponentModel.DataAnnotations;

namespace Movies.APP.Features.Movies
{
    public class MovieUpdateRequest : Request, IRequest<CommandResponse>
    {
        [Required, StringLength(200, MinimumLength = 1)]
        public string Name { get; set; }

        public DateTime? ReleaseDate { get; set; }

        public decimal TotalRevenue { get; set; }

        public int DirectorId { get; set; }

        public List<int> GenreIds { get; set; } = new List<int>();
    }

    public class MovieUpdateHandler : Service<Movie>, IRequestHandler<MovieUpdateRequest, CommandResponse>
    {
        public MovieUpdateHandler(DbContext db) : base(db)
        {
        }

        protected override IQueryable<Movie> DbSet()
        {
            return base.DbSet().Include(m => m.MovieGenres);
        }

        public async Task<CommandResponse> Handle(MovieUpdateRequest request, CancellationToken cancellationToken)
        {
            if (await DbSet().AnyAsync(m => m.Id != request.Id && m.Name == request.Name.Trim(), cancellationToken))
                return Error("Movie with the same name exists!");
            var existingEntity = await DbSet().SingleOrDefaultAsync(m => m.Id == request.Id, cancellationToken);
            if (existingEntity is null)
                return Error("Movie not found!");
            Delete(existingEntity.MovieGenres);
            existingEntity.GenreIds = request.GenreIds;
            existingEntity.Name = request.Name.Trim();
            existingEntity.ReleaseDate = request.ReleaseDate;
            existingEntity.TotalRevenue = request.TotalRevenue;
            existingEntity.DirectorId = request.DirectorId;
            await UpdateAsync(existingEntity, cancellationToken);
            return Success("Movie updated successfully.", existingEntity.Id);
        }
    }
}
