FROM node:20-bookworm-slim

# On installe openssl au niveau du système Linux du container
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# On génère le client à l'intérieur du container pour être sûr
RUN npx prisma generate

EXPOSE 5000

CMD ["npm", "run", "dev"]