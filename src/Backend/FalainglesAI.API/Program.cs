var builder = WebApplication.CreateBuilder(args);

// 1. Configurar serviços OpenAPI / Swagger
builder.Services.AddOpenApi();

// 2. Configurar CORS para permitir o frontend no Netlify e o ambiente local
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                  "https://falainglesai.netlify.app",
                  "http://localhost:3000"
              )
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// 3. Pipeline HTTP: OpenAPI em desenvolvimento
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// 4. Aplicar política de CORS
app.UseCors("AllowFrontend");

// 5. Endpoint de verificação de status (Health Check)
app.MapGet("/api/health", () => Results.Ok(new
{
    status = "Healthy",
    service = "FalaInglesAI.API",
    version = "1.0.0",
    timestamp = DateTime.UtcNow
}))
.WithName("GetHealthStatus");

// 6. Endpoint de teste para fornecer cenários de conversação ao frontend
app.MapGet("/api/scenarios", () =>
{
    var scenarios = new[]
    {
        new { Id = 1, Title = "Entrevista Técnica", Level = "Intermediário", Description = "Apresentação pessoal, experiência em .NET e projetos." },
        new { Id = 2, Title = "Daily & Reuniões de TI", Level = "Básico / Intermediário", Description = "Explique blockers, tasks e próximos passos da sprint." },
        new { Id = 3, Title = "Imigração & Viagem", Level = "Iniciante", Description = "Responda as perguntas da alfândega com segurança." },
        new { Id = 4, Title = "Café & Restaurante", Level = "Iniciante", Description = "Faça pedidos especiais e tire dúvidas sobre a conta." }
    };

    return Results.Ok(scenarios);
})
.WithName("GetScenarios");

app.Run();