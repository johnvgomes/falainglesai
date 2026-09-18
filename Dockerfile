FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

COPY ["src/Backend/FalaInglesAI.Domain/FalaInglesAI.Domain.csproj", "src/Backend/FalaInglesAI.Domain/"]
COPY ["src/Backend/FalaInglesAI.Application/FalaInglesAI.Application.csproj", "src/Backend/FalaInglesAI.Application/"]
COPY ["src/Backend/FalaInglesAI.Infrastructure/FalaInglesAI.Infrastructure.csproj", "src/Backend/FalaInglesAI.Infrastructure/"]
COPY ["src/Backend/FalaInglesAI.API/FalaInglesAI.API.csproj", "src/Backend/FalaInglesAI.API/"]

RUN dotnet restore "src/Backend/FalaInglesAI.API/FalaInglesAI.API.csproj"

COPY . .
WORKDIR "/app/src/Backend/FalaInglesAI.API"
RUN dotnet publish "FalaInglesAI.API.csproj" -c Release -o /out

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /out .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "FalaInglesAI.API.dll"]