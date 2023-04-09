const router = require('express').Router();
const Favorite = require('../models/Favorite')
const { isAuthenticated } = require('../middlewares/jwt');

// @desc    Get all favorites for a specific trip
// @route   GET /favorite/trip/:tripId
// @access  Private
router.get('/trip/:tripId', isAuthenticated, async (req, res, next) => {
  try {
    const { tripId } = req.params;
    const favoriteTrip = await Favorite.find({ trip: tripId });
    res.status(200).json(favoriteTrip);
  } catch (error) {
    next(error);
  }
});

// @desc    Create a new favorite for a specific trip
// @route   POST /favorite
// @access  Private
router.post('/', isAuthenticated, async (req, res, next) => {
  try {
    const { _id: user_id } = req.payload;
    const { trip, title, description } = req.body;
    if (!trip || !title || !description) {
      return res.status(400).json({ message: 'Missing required data' });
    }
    const createdFavorite = await Favorite.create({ trip, title, description, user: user_id });
    res.status(201).json(createdFavorite);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

// @desc    Delete one favorite
// @route   DELETE /favorite/:favoriteId
// @access  User
// router.delete('/:favoriteId', isAuthenticated, async (req, res, next) => {
//   const { favoriteId } = req.params
//   try {
//       const deleteFavorite = await Favorite.findByIdAndDelete(favoriteId)
//       res.status(201).json(deleteFavorite)
//   } catch (error) {
//       next(error)
//   }
// });


// @desc    Delete one favorite
// @route   DELETE /favorite/:favoriteId
// @access  User
router.delete('/:favoriteId', isAuthenticated, async (req, res, next) => {
    try {
      const { favoriteId } = req.params;
      const { _id: user_id } = req.payload;
      const favorite = await Favorite.findById(favoriteId);
      if (!favorite) {
        return res.status(404).json({ message: 'Favorite not found' });
      }
      if (favorite.user.toString() !== user_id) {
        return res.status(403).json({ message: 'You are not authorized to delete this favorite' });
      }
      await favorite.remove();
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });
  
module.exports = router;