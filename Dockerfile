# Utilisation d'une version légère de Node.js
FROM node:20-slim

WORKDIR /app

# Installation des dépendances en premier (optimisation du cache Docker)
COPY package*.json ./
RUN npm install

# Copie du reste des fichiers
COPY . .

# Nuxt utilise le port 3000 par défaut
EXPOSE 3000

# Commande pour lancer le serveur de développement
CMD ["npm", "run", "dev"]