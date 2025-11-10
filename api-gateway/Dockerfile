# ----- Étape 1 : Le Build -----
FROM maven:3.9-eclipse-temurin-17-focal AS build

WORKDIR /app

# 1. Copier le pom.xml PARENT
COPY pom.xml .

# 2. Copier les pom.xml de TOUS les modules
# (Nous devons le faire pour que Maven comprenne le projet multi-modules)
COPY api-gateway/pom.xml ./api-gateway/
COPY service-ressources/pom.xml ./service-ressources/
COPY service-reservations/pom.xml ./service-reservations/
COPY service-utilisateurs/pom.xml ./service-utilisateurs/

# 3. Télécharger TOUTES les dépendances du projet
# Docker mettra cette étape en cache.
RUN mvn dependency:go-offline

# 4. Copier TOUT le reste du code source
COPY . .

# 5. Compiler (package) SEULEMENT le service dont nous avons besoin.
# Cette étape sera rapide car les dépendances sont déjà en cache.
RUN mvn package -Dmaven.test.skip=true -pl api-gateway -am

# ----- Étape 2 : L'Image Finale -----
FROM eclipse-temurin:17-jre-focal
WORKDIR /app

COPY --from=build /app/api-gateway/target/api-gateway-1.0.0-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]