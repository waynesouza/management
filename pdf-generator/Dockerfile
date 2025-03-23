# Use uma imagem base com Temurin 21
FROM eclipse-temurin:21-jdk-alpine

# Defina o diretório de trabalho
WORKDIR /app

# Copie o arquivo de build da aplicação para o container
COPY target/*.jar app.jar

# Exponha a porta que a aplicação usará
EXPOSE 8080

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
