const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// Obtener todos los restaurantes
router.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    res.status(200).json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
