# Etapa 1: Build com o SDK do .NET 10
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copiar ficheiros .csproj para cache
COPY ["src/Backend/FalaInglesAI.Domain/FalaInglesAI.Domain.csproj", "src/Backend/FalaInglesAI.Domain/"]
COPY ["src/Backend/FalaInglesAI.Application/FalaInglesAI.Application.csproj", "src/Backend/FalaInglesAI.Application/"]
COPY ["src/Backend/FalaInglesAI.Infrastructure/FalaInglesAI.Infrastructure.csproj", "src/Backend/FalaInglesAI.Infrastructure/"]
COPY ["src/Backend/FalaInglesAI.API/FalaInglesAI.API.csproj", "src/Backend/FalaInglesAI.API/"]

# Restaurar dependências
RUN dotnet restore "src/Backend/FalaInglesAI.API/FalaInglesAI.API.csproj"

# Copiar todo o código-fonte restante e publicar
COPY . .
WORKDIR "/app/src/Backend/FalaInglesAI.API"
RUN dotnet publish "FalaInglesAI.API.csproj" -c Release -o /out

# Etapa 2: Runtime ASP.NET do .NET 10
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /out .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "FalaInglesAI.API.dll"]