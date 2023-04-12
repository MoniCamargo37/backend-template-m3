const router = require('express').Router();
const Favorite = require('../models/Favorite')
const { isAuthenticated } = require('../middlewares/jwt');

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

//GET ALL FAVORITE
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


// @desc    Change favorite state/ 
// @route   POST /favorite/:cityoverviewId
// @access  Private
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

