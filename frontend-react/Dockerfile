# ----- Étape 1 : Le "Build" (avec Node.js) -----
# On utilise une image Node.js version 18
FROM node:18-alpine AS build

# On définit le répertoire de travail
WORKDIR /app

# On copie d'abord les "package.json" pour utiliser le cache
COPY frontend-react/package.json frontend-react/package-lock.json ./
RUN npm install

# On copie le reste du code source du frontend
COPY frontend-react/ .

# On lance la commande de build de Vite pour créer les fichiers statiques
RUN npm run build

# ----- Étape 2 : L'Image Finale (avec Nginx) -----
# On utilise l'image officielle Nginx, très légère
FROM nginx:1.25-alpine

# On copie les fichiers statiques (du dossier /dist) de l'étape de build...
# ... vers le dossier HTML par défaut de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# (Optionnel) Copier une configuration Nginx personnalisée (pas nécessaire pour l'instant)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# On expose le port 80 (le port par défaut de Nginx)
EXPOSE 80