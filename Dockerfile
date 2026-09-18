FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copia todo o código do backend para compilação
COPY src/Backend ./src/Backend

# Restaura e compila a API
WORKDIR /app/src/Backend/FalaInglesAI.API
RUN dotnet restore FalaInglesAI.API.csproj
RUN dotnet publish FalaInglesAI.API.csproj -c Release -o /out

# Imagem de execução
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /out .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "FalaInglesAI.API.dll"]