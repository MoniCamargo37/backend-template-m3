const router = require('express').Router();
const Favorite = require('../models/Favorite')
const { isAuthenticated } = require('../middlewares/jwt');

//BACKLOG
// @desc    Get all favorites for a specific trip
// @route   GET /favorite/trip/:tripId
// @access  Private

router.get('/city-overview/:cityId', isAuthenticated, async (req, res, next) => {
  try {
    const { cityId } = req.params;
    const favoriteCityOverview = await Favorite.find(({ cityOverview: cityId }));
    res.status(200).json(favoriteCityOverview);
  } catch (error) {
    next(error);
  }
});

//BACKLOG
// @desc Get all favorite cityOverviews of a user
// @route GET /api/v1/favorite
// @access Private
router.get('/', isAuthenticated, async (req, res, next) => {
  const userId = req.payload._id;
  try {
      const userDB = await User.findById(userId);
      const favorite = await Favorite.find({user: userId})
      .populate({
          // path: 'cityOverview',
          populate: {path: 'itineraryPic', path: 'cityName'}
      });
      const preFavorite = JSON.parse(JSON.stringify(favorite));
      const favoriteCityoverview = await Promise.all(preFavorite.map(async (cityOverview) => {
          return await getFavorites(cityOverview.cityName, userDB);
      }))
      res.status(200).json({
          user: {
              username: userDB.username,
              image: userDB.image
          },
          favoriteCityoverview
      })
  } catch (error) {
      console.log(error)
  }
});

//BACKLOG
// @desc Add or remove a cityOverview from user favorites
// @route POST /api/v1/favorite/:cityoverviewId
// @access Private
router.post('/:cityoverviewId', isAuthenticated, async (req, res, next) => {
  const { cityoverviewId } = req.params;
  const userId = req.payload._id;
  try {
       const favorite = await Favorite.findOne({cityoverviewId, userId});
       if(!like) {
          const newFavorite = await Favorite.create({cityoverviewId, userId});
          res.status(200).json(newFavorite);
       } else {
          const newFavorite = await Favorite.findOneAndDelete({cityoverviewId, userId});
           res.status(200).json(newFavorite);  
       }
  } catch (error) {
      console.log(error);
  }
});



module.exports = router;

