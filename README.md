# Backend MERN - Application Blog

Backend API pour une application de blog développée avec Node.js, Express et MongoDB.

## 🚀 Démarrage

### Prérequis
- Node.js (v14 ou supérieur)
- MongoDB (v4.4 ou supérieur)

### Installation

1. Installer les dépendances :
```bash
npm install
```

2. Configurer les variables d'environnement :
Créer un fichier `.env` à la racine :
```
MONGODB_URI=mongodb://localhost:27017/mern_blog
PORT=3000
```

3. Démarrer MongoDB :
```bash
# Sur Linux/Mac
sudo systemctl start mongod

# Sur Windows
net start MongoDB
```

4. Démarrer le serveur :
```bash
# Mode développement (avec rechargement automatique)
npm run dev

# Mode production
npm start
```

Le serveur sera accessible sur `http://localhost:3000`

## 📁 Structure du Projet

```
backend/
├── models/           # Modèles Mongoose
│   ├── User.js
│   ├── Post.js
│   └── Comment.js
├── routes/           # Routes API
│   ├── users.js
│   ├── posts.js
│   └── comments.js
├── server.js         # Point d'entrée
├── package.json
└── .env
```

## 🔌 Routes API

### Users
- `GET /api/users` - Liste tous les utilisateurs
- `GET /api/users/:id` - Détails d'un utilisateur
- `POST /api/users` - Créer un utilisateur
- `PUT /api/users/:id` - Modifier un utilisateur
- `DELETE /api/users/:id` - Supprimer un utilisateur

### Posts
- `GET /api/posts` - Liste tous les posts
- `GET /api/posts/:id` - Détails d'un post
- `POST /api/posts` - Créer un post
- `PUT /api/posts/:id` - Modifier un post
- `DELETE /api/posts/:id` - Supprimer un post
- `POST /api/posts/:id/like` - Liker un post
- `GET /api/posts/:id/comments` - Commentaires d'un post
- `POST /api/posts/:id/comments` - Ajouter un commentaire

### Comments
- `GET /api/comments` - Liste tous les commentaires
- `GET /api/comments/:id` - Détails d'un commentaire
- `PUT /api/comments/:id` - Modifier un commentaire
- `DELETE /api/comments/:id` - Supprimer un commentaire

## 📊 Modèles de Données

### User
```javascript
{
  username: String (unique, requis),
  email: String (unique, requis),
  bio: String (optionnel),
  timestamps: true
}
```

### Post
```javascript
{
  title: String (requis),
  content: String (requis),
  author: ObjectId (ref: User),
  likes: Number (default: 0),
  tags: [String],
  timestamps: true
}
```

### Comment
```javascript
{
  text: String (requis),
  author: ObjectId (ref: User),
  post: ObjectId (ref: Post),
  timestamps: true
}
```
