# Utiliser Node.js comme base
FROM node:16

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier les fichiers du backend et le dossier partagé
# Copier les fichiers du frontend et le dossier partagé
COPY . .
COPY ./shared /usr/src/shared
# Copie le dossier shared dans l'image Docker

# Exposer le port utilisé par votre application backend
EXPOSE 41101

# Commande pour démarrer le backend
CMD ["npm", "run", "dev"]