const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// GET /api/comments - Récupérer tous les commentaires
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('author', 'username email')
      .populate('post', 'title')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET /api/comments/:id - Récupérer un commentaire par ID
router.get('/:id', async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate('author', 'username email')
      .populate('post', 'title');

    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// DELETE /api/comments/:id - Supprimer un commentaire
router.delete('/:id', async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);

    if (!deletedComment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    res.json({ message: 'Commentaire supprimé avec succès', comment: deletedComment });
  } catch (error) {
    res.status(500).json({ message: 'Erreur de suppression', error: error.message });
  }
});

// PUT /api/comments/:id - Mettre à jour un commentaire
router.put('/:id', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Le texte est requis' });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { text },
      { new: true, runValidators: true }
    ).populate('author', 'username email');

    if (!updatedComment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    res.json(updatedComment);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de mise à jour', error: error.message });
  }
});

module.exports = router;