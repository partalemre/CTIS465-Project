using CORE.APP.Models;
using CORE.APP.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.APP.Domain;
using System.ComponentModel.DataAnnotations;

namespace Movies.APP.Features.Genres
{
    public class GenreUpdateRequest : Request, IRequest<CommandResponse>
    {
        [Required, StringLength(50, MinimumLength = 2)]
        public string Name { get; set; }
    }

    public class GenreUpdateHandler : Service<Genre>, IRequestHandler<GenreUpdateRequest, CommandResponse>
    {
        public GenreUpdateHandler(DbContext db) : base(db)
        {
        }

        public async Task<CommandResponse> Handle(GenreUpdateRequest request, CancellationToken cancellationToken)
        {
            if (await DbSet().AnyAsync(g => g.Id != request.Id && g.Name == request.Name.Trim(), cancellationToken))
                return Error("Genre with the same name exists!");
            var existingEntity = await DbSet().SingleOrDefaultAsync(g => g.Id == request.Id, cancellationToken);
            if (existingEntity is null)
                return Error("Genre not found!");
            existingEntity.Name = request.Name.Trim();
            await UpdateAsync(existingEntity, cancellationToken);
            return Success("Genre updated successfully.", existingEntity.Id);
        }
    }
}
