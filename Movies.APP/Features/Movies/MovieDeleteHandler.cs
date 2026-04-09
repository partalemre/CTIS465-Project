using CORE.APP.Models;
using CORE.APP.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.APP.Domain;

namespace Movies.APP.Features.Movies
{
    public class MovieDeleteRequest : Request, IRequest<CommandResponse>
    {
    }

    public class MovieDeleteHandler : Service<Movie>, IRequestHandler<MovieDeleteRequest, CommandResponse>
    {
        public MovieDeleteHandler(DbContext db) : base(db)
        {
        }

        protected override IQueryable<Movie> DbSet()
        {
            return base.DbSet().Include(m => m.MovieGenres);
        }

        public async Task<CommandResponse> Handle(MovieDeleteRequest request, CancellationToken cancellationToken)
        {
            var existingEntity = await DbSet().SingleOrDefaultAsync(m => m.Id == request.Id, cancellationToken);
            if (existingEntity is null)
                return Error("Movie not found!");
            Delete(existingEntity.MovieGenres);
            await DeleteAsync(existingEntity, cancellationToken);
            return Success("Movie deleted successfully.", existingEntity.Id);
        }
    }
}
