# Étape 1: Image de base Node.js
FROM node:18-alpine

# Étape 2: Définition du répertoire de travail
WORKDIR /app

# Étape 3: Copie des fichiers de dépendances
COPY package*.json ./

# Étape 4: Installation de TOUTES les dépendances (dev incluses)
RUN npm install


# Étape 5: Copie du code source
COPY . .

# Étape 6: Exposition du port
EXPOSE 3000

# Étape 7: Commande de développement avec hot-reload
CMD ["npm", "run", "dev"]
# ✅ Utilise nodemon pour le rechargement automatique