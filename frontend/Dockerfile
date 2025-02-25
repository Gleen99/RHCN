# Étape 1 : Utiliser Node.js pour construire l'application
FROM node:22 as build

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers du frontend
COPY . /usr/src/app

# Copier le dossier shared dans l’image Docker
COPY src/shared /usr/src/app/src/shared

# Copie le dossier shared dans l'image Docker

# Construire l'application
RUN npm run build

# Étape 2 : Utiliser NGINX pour servir l'application
FROM nginx:alpine

# Copier les fichiers construits dans le répertoire NGINX
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

# Exposer le port utilisé par NGINX
EXPOSE 80

# Lancer NGINX
CMD ["nginx", "-g", "daemon off;"]