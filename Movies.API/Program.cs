using Microsoft.EntityFrameworkCore;
using Movies.APP.Domain;

var builder = WebApplication.CreateBuilder(args);

//builder.AddServiceDefaults();

// Add services to the container. IoC (Inversion of Control) Container
// For DbContext Injection
var connectionString = builder.Configuration.GetConnectionString(nameof(MoviesDb)); // "MoviesDb"
builder.Services.AddDbContext<DbContext, MoviesDb>(options => options.UseSqlite(connectionString));

// For Mediator Injection
foreach (var assembly in AppDomain.CurrentDomain.GetAssemblies())
{
    builder.Services.AddMediatR(config => config.RegisterServicesFromAssemblies(assembly));
}

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// For CORS
builder.Services.AddCors();

var app = builder.Build();

//app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// For CORS
app.UseCors(options => options.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

app.Run();
