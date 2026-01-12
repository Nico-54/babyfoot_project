FROM node:20-slim

WORKDIR /app

# On installe les dépendances
COPY package*.json ./
RUN npm install

# Le reste du code est monté via les volumes dans docker-compose
# mais on COPY quand même pour la cohérence
COPY . .

EXPOSE 5000

# On utilise l'exécutable installé localement
CMD ["npm", "run", "dev"]