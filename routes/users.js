const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users - Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-__v').sort({ username: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET /api/users/:id - Récupérer un utilisateur par ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-__v');

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// POST /api/users - Créer un nouvel utilisateur
router.post('/', async (req, res) => {
  try {
    const { username, email, bio } = req.body;

    // Validation
    if (!username || !email) {
      return res.status(400).json({ 
        message: 'Le nom d\'utilisateur et l\'email sont requis' 
      });
    }

    const newUser = new User({
      username,
      email,
      bio: bio || ''
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Nom d\'utilisateur ou email déjà utilisé' 
      });
    }
    res.status(400).json({ message: 'Erreur de création', error: error.message });
  }
});

// PUT /api/users/:id - Mettre à jour un utilisateur
router.put('/:id', async (req, res) => {
  try {
    const { username, email, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, bio },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json(updatedUser);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Nom d\'utilisateur ou email déjà utilisé' 
      });
    }
    res.status(400).json({ message: 'Erreur de mise à jour', error: error.message });
  }
});

// DELETE /api/users/:id - Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.json({ message: 'Utilisateur supprimé avec succès', user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: 'Erreur de suppression', error: error.message });
  }
});

module.exports = router;