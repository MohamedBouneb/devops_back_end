const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Le texte du commentaire est requis'],
    trim: true,
    minlength: [1, 'Le commentaire doit contenir au moins 1 caractère'],
    maxlength: [500, 'Le commentaire ne peut pas dépasser 500 caractères']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'auteur est requis']
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, 'Le post associé est requis']
  }
}, {
  timestamps: true
});

// Index pour recherche rapide
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ author: 1 });

module.exports = mongoose.model('Comment', commentSchema);