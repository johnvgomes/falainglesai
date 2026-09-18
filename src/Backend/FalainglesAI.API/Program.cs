var builder = WebApplication.CreateBuilder(args);

// ======================================================
// 1. OPENAPI
// ======================================================

builder.Services.AddOpenApi();


// ======================================================
// 2. CORS
// ======================================================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(
                "https://falainglesai.netlify.app",
                "http://localhost:3000"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});


var app = builder.Build();


// ======================================================
// 3. PIPELINE HTTP
// ======================================================

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");


// ======================================================
// 4. HEALTH CHECK
// ======================================================

app.MapGet("/api/health", () =>
{
    return Results.Ok(new
    {
        status = "Healthy",
        service = "FalaInglesAI.API",
        version = "1.0.0",
        timestamp = DateTime.UtcNow
    });
})
.WithName("GetHealthStatus");


// ======================================================
// 5. CENÁRIOS
// ======================================================

app.MapGet("/api/scenarios", () =>
{
    var scenarios = new[]
    {
        new
        {
            Id = "interview",
            Title = "Entrevista Técnica",
            Level = "B1 - C1",
            Description =
                "Apresentação pessoal, experiência profissional, .NET e projetos."
        },

        new
        {
            Id = "tech",
            Title = "Daily & Reuniões de TI",
            Level = "B2 - C2",
            Description =
                "Explique blockers, tasks e próximos passos da sprint."
        },

        new
        {
            Id = "travel",
            Title = "Imigração & Viagem",
            Level = "A2 - B2",
            Description =
                "Responda perguntas de imigração, aeroporto e viagem."
        },

        new
        {
            Id = "casual",
            Title = "Conversação Casual",
            Level = "A1 - C1",
            Description =
                "Pratique conversas sobre rotina, hobbies e situações cotidianas."
        }
    };

    return Results.Ok(scenarios);
})
.WithName("GetScenarios");


// ======================================================
// 6. CONVERSAÇÃO
// ======================================================
//
// O frontend enviará algo como:
//
// {
//   "message": "My name is John and I am a developer",
//   "scenarioId": "interview"
// }
//
// E o backend responderá:
//
// {
//   "reply": "...",
//   "translationPt": "..."
// }
//
// ======================================================

app.MapPost(
    "/api/conversation/message",
    (ConversationRequest request) =>
    {
        // --------------------------------------------------
        // Validação
        // --------------------------------------------------

        if (string.IsNullOrWhiteSpace(request.Message))
        {
            return Results.BadRequest(new
            {
                error = "A mensagem não pode estar vazia."
            });
        }

        if (string.IsNullOrWhiteSpace(request.ScenarioId))
        {
            return Results.BadRequest(new
            {
                error = "O cenário não foi informado."
            });
        }


        // --------------------------------------------------
        // RESPOSTA TEMPORÁRIA
        //
        // Por enquanto isso simula a inteligência artificial.
        //
        // No próximo passo substituiremos este switch
        // por uma chamada real ao modelo de IA.
        // --------------------------------------------------

        var response = request.ScenarioId.ToLowerInvariant() switch
        {
            "interview" => new ConversationResponse(
                Reply:
                    "That sounds interesting. Could you tell me more about your experience as a developer and the technologies you usually work with?",

                TranslationPt:
                    "Parece interessante. Você poderia me contar mais sobre sua experiência como desenvolvedor e as tecnologias com que costuma trabalhar?"
            ),

            "tech" => new ConversationResponse(
                Reply:
                    "Great. What are you currently working on, and do you have any blockers that could affect your progress?",

                TranslationPt:
                    "Ótimo. Em que você está trabalhando atualmente e existe algum impedimento que possa afetar seu progresso?"
            ),

            "travel" => new ConversationResponse(
                Reply:
                    "Thank you. How long are you planning to stay, and where will you be staying during your trip?",

                TranslationPt:
                    "Obrigado. Quanto tempo você pretende ficar e onde ficará hospedado durante a viagem?"
            ),

            "casual" => new ConversationResponse(
                Reply:
                    "Nice! What do you usually like to do in your free time or on the weekends?",

                TranslationPt:
                    "Legal! O que você geralmente gosta de fazer no seu tempo livre ou nos fins de semana?"
            ),

            _ => new ConversationResponse(
                Reply:
                    "Interesting! Could you tell me a little more about that?",

                TranslationPt:
                    "Interessante! Você poderia me contar um pouco mais sobre isso?"
            )
        };


        // --------------------------------------------------
        // Log simples no Render
        // --------------------------------------------------

        Console.WriteLine(
            $"Conversation | Scenario: {request.ScenarioId} | User: {request.Message}"
        );


        return Results.Ok(response);
    }
)
.WithName("SendConversationMessage");


// ======================================================
// 7. INICIAR A API
// ======================================================

app.Run();


// ======================================================
// MODELOS
// ======================================================

record ConversationRequest(
    string Message,
    string ScenarioId
);

record ConversationResponse(
    string Reply,
    string TranslationPt
);