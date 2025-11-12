const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// GET /api/posts - Récupérer tous les posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET /api/posts/:id - Récupérer un post par ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username email bio');

    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// POST /api/posts - Créer un nouveau post
router.post('/', async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;

    // Validation
    if (!title || !content || !author) {
      return res.status(400).json({ 
        message: 'Titre, contenu et auteur sont requis' 
      });
    }

    const newPost = new Post({
      title,
      content,
      author,
      tags: tags || []
    });

    const savedPost = await newPost.save();
    const populatedPost = await Post.findById(savedPost._id)
      .populate('author', 'username email');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de création', error: error.message });
  }
});

// PUT /api/posts/:id - Mettre à jour un post
router.put('/:id', async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, tags },
      { new: true, runValidators: true }
    ).populate('author', 'username email');

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de mise à jour', error: error.message });
  }
});

// DELETE /api/posts/:id - Supprimer un post
router.delete('/:id', async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    // Supprimer tous les commentaires associés
    await Comment.deleteMany({ post: req.params.id });

    res.json({ message: 'Post supprimé avec succès', post: deletedPost });
  } catch (error) {
    res.status(500).json({ message: 'Erreur de suppression', error: error.message });
  }
});

// POST /api/posts/:id/like - Liker un post
router.post('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    post.likes += 1;
    await post.save();

    res.json({ 
      message: 'Post liké avec succès', 
      likes: post.likes,
      _id: post._id 
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET /api/posts/:id/comments - Récupérer les commentaires d'un post
router.get('/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .populate('author', 'username email')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// POST /api/posts/:id/comments - Ajouter un commentaire
router.post('/:id/comments', async (req, res) => {
  try {
    const { text, author } = req.body;

    if (!text || !author) {
      return res.status(400).json({ 
        message: 'Le texte et l\'auteur sont requis' 
      });
    }

    // Vérifier que le post existe
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post non trouvé' });
    }

    const newComment = new Comment({
      text,
      author,
      post: req.params.id
    });

    const savedComment = await newComment.save();
    const populatedComment = await Comment.findById(savedComment._id)
      .populate('author', 'username email');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de création', error: error.message });
  }
});

module.exports = router;