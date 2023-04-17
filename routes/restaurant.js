const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');

// bACKLOG Obtener todos los restaurantes
router.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();

    res.status(200).json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// BACKLOG Ruta para crear un nuevo restaurante en un fututo
router.post('/restaurants', async (req, res) => {
  const { name, foodType, city } = req.body;
  const restaurant = new Restaurant({ name, foodType, city });

  try {
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
