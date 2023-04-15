const express = require('express');
const router = express.Router();

//lo dejo por ahora por si tengo que usarla luego
router.get("/", async (req, res) => {
  try {
      const Activity = await Activity.find();
      res.json(Activity);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error en el servidor");
    }
  });
  
// @desc Create a new day trip
// @route POST /api/v1/day-trips
// @access Private user
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



module.exports = router;
