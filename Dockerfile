# Utiliser l'image officielle de Node.js comme image de base
FROM node:18-alpine

# Définir le répertoire de travail à l'intérieur du conteneur
WORKDIR /app

# Copier le fichier package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier tout le code de l'application dans le conteneur
COPY . .

# Construire l'application React pour la production
RUN npm run build

# Installer un serveur HTTP simple pour servir le contenu statique
RUN npm install -g serve

# Exposer le port sur lequel l'application sera disponible
EXPOSE 80

# Démarrer l'application en utilisant le serveur HTTP simple
CMD ["serve", "-s", "build", "-l", "80"]
