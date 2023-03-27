const router = require('express').Router();
const Trip = require('../models/Trip');

// @desc    Get all trip plan
// @route   GET /trip plan
// @access  Private
router.get('/', async (req, res, next) => {
    try {
      const trips = await Trip.find();
      res.status(200).json(trips);
    } catch (error) {
      next(error)
    }
  });

  
// @desc    Get a specific trip plan
// @route   GET /trip/:tripId
// @access  Private/ user 
router.get('/:tripId', async (req, res, next) => {
  const { tripId } = req.params;
  try {
    const trip = await Trip.findById(tripId);
    res.status(200).json(trip);
  } catch (error) {
    next(error)
  }
});

// @desc    Create one trip plan
// @route   POST /courses
// @access  Public
router.post('/', async (req, res, next) => {
  try {
    const newTrip = await Trip.create(req.body);
    res.status(201).json(newTrip);
  } catch (error) {
    next(error)
  }
});

// @desc    Edit one trip
// @route   PUT /trip/:tripId
// @access  Public
router.put('/:tripId', async (req, res, next) => {
  const { tripId } = req.params;
  try {
    const response = await Trip.findByIdAndUpdate(tripId, req.body, { new: true });
    console.log(response)
    // res.redirect(`/courses/${tripId}`) //==> only to see on Postman if we edited right
    res.status(204).json({ message: 'OK' });
  } catch (error) {
    next(error)
  }
});

// @desc    Delete one trip plan 
// @route   DELETE /trip/:tripId
// @access  Private/ User
router.delete('/:tripId', async (req, res, next) => {
  const { tripId } = req.params;
  try {
    const deletedTrip = await Trip.findByIdAndDelete(tripId);
    res.status(200).json(deletedTrip);
  } catch (error) {
    next(error)
  }
});


  
  module.exports = router;
