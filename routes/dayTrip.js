const express = require('express');
const router = express.Router();
const DayTrip = require('../models/DayTrip');
const Restaurant = require('../models/Restaurant');


router.get("/", async (req, res) => {
    try {
      const dayTrip = await DayTrip.find();
      res.json(dayTrip);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error en el servidor");
    }
  });
// Ruta para crear un nuevo DayTrip
router.post('/', async (req, res) => {
  const { activity1, activity2, activity3 } = req.body;
  const dayTrip = new DayTrip({ activity1, activity2, activity3 });

  try {
    await dayTrip.save();
    res.status(201).json(dayTrip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta para agregar restaurantes a un DayTrip específico
router.post('/:id/restaurants', async (req, res) => {
    const dayTripId = req.params.id;
    const { name, foodType, city } = req.body;
  
    const dayTrip = await DayTrip.findById(dayTripId);
    console.log(dayTrip);

    if (!dayTrip) {
      return res.status(400).json({ error: 'El DayTrip especificado no existe' });
    }
    
    if (!dayTrip.Restaurants || dayTrip.Restaurants.length >= 2) {
        return res.status(400).json({ error: 'Ya se han agregado dos restaurantes a este DayTrip' });
      }
    
    const restaurant = new Restaurant({ name, foodType, city });
    console.log(restaurant);
    await restaurant.save();
  
    dayTrip.Restaurants.push(restaurant._id);
    await dayTrip.save();
  
    res.status(201).json(dayTrip);
  });


module.exports = router;
