FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copia todo o repositório
COPY . .

# Localiza o arquivo .csproj da API dinamicamente independente do casing da pasta
RUN CSPROJ=$(find . -name "FalaInglesAI.API.csproj" | head -n 1) && \
    dotnet restore "$CSPROJ" && \
    dotnet publish "$CSPROJ" -c Release -o /out

# Imagem final de execução
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /out .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "FalaInglesAI.API.dll"]