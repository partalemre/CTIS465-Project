using CORE.APP.Models;
using CORE.APP.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Movies.APP.Domain;
using System.ComponentModel.DataAnnotations;

namespace Movies.APP.Features.Directors
{
    public class DirectorUpdateRequest : Request, IRequest<CommandResponse>
    {
        [Required, StringLength(50, MinimumLength = 2)]
        public string FirstName { get; set; }

        [Required, StringLength(50, MinimumLength = 2)]
        public string LastName { get; set; }

        public bool IsRetired { get; set; }
    }

    public class DirectorUpdateHandler : Service<Director>, IRequestHandler<DirectorUpdateRequest, CommandResponse>
    {
        public DirectorUpdateHandler(DbContext db) : base(db)
        {
        }

        public async Task<CommandResponse> Handle(DirectorUpdateRequest request, CancellationToken cancellationToken)
        {
            if (await DbSet().AnyAsync(d => d.Id != request.Id && d.FirstName == request.FirstName.Trim() && d.LastName == request.LastName.Trim(), cancellationToken))
                return Error("Director with the same name exists!");
            var existingEntity = await DbSet().SingleOrDefaultAsync(d => d.Id == request.Id, cancellationToken);
            if (existingEntity is null)
                return Error("Director not found!");
            existingEntity.FirstName = request.FirstName.Trim();
            existingEntity.LastName = request.LastName.Trim();
            existingEntity.IsRetired = request.IsRetired;
            await UpdateAsync(existingEntity, cancellationToken);
            return Success("Director updated successfully.", existingEntity.Id);
        }
    }
}
