const express = require("express");
const router = express.Router();
const CityOverview = require("../models/CityOverview");
const { isAuthenticated, isloggedIn,
  isAdmin } = require("../middlewares/jwt");

// @desc    get all cityOverviews 
// @route   GET /api/v1/city-overview"
// @access  Public
// router.get("/", async (req, res) => {
//   try {
//     const cityOverviews = await CityOverview.find();
//     res.json(cityOverviews);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Error en el servidor");
//   }
// });

// @desc    most Searched cityOverview
// @route   GET /api/v1//city-overview/mostSearched"
// @access  Public
router.get("/mostSearched", async (req, res) => {
  try {
    const cityOverviews = await CityOverview.find().sort({ numSearches: -1 }).limit(4);
    res.json(cityOverviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});


// @desc    get cityOverview by cityname and Update numSearches for the selected city
// @route   GET /api/v1/city-overview/:city
// @access  Public
router.get("/:city", async (req, res) => {
  try {
    const { city } = req.params;
    let cityOverview = await CityOverview.findOne({ cityName: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase() });

    if (!cityOverview) {
      return res.status(404).json({ message: "La ciudad solicitada no se encontró en la base de datos" });
    }

    cityOverview.numSearches++;
    
    try {
      // Update numSearches for the selected city
      cityOverview = await CityOverview.findOneAndUpdate(
        { cityName: cityOverview.cityName },
        { $inc: { numSearches: 1 } },
        { new: true }
      );

      res.json(cityOverview);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Error en el servidor" + err.message);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor" + err.message);
  }
});


// @desc    Get city by ID
// @route   GET /api/v1/city-overview/:id
// @access  Public
// router.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const cityOverview = await CityOverview.findById(id);

//     if (!cityOverview) {
//       return res.status(404).json({ msg: "No se ha encontrado este destino" });
//     }

//     res.json(cityOverview);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });


// @desc    Adding favorite city to user account
// @route   POST /api/v1/city-overview/:cityOverviewId
// @access  Private/user
// router.post("/:cityOverviewId", async (req, res) => {
//   try {
//     const { cityOverviewId } = req.params;
//     const userId = req.user.id;
//     const user = await User.findById(userId);
//     const cityOverview = await CityOverview.findById(cityOverviewId);

//     if (!user) {
//       return res.status(404).json({ msg: "Lo sentimos, debe registrarse para añadirlo a tus favoritos" });
//     }

//     if (!cityOverview) {
//       return res.status(404).json({ msg: "No se ha encontrado este destino" });
//     }

//     if (user.cityOverviews.includes(cityOverviewId)) {
//       return res.status(400).json({ msg: "Ya existe este destino en tu cuenta" });
//     }

//     user.cityOverviews.push(cityOverviewId);
//     await user.save();

//     res.json({ msg: "Añadido a tus favoritos" });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Error en el servidor");
//   }
// });

// @desc    Delete cityOverview from database
// @route   DELETE /api/v1/city-overview/:id
// @access  Private/isAdmin
router.delete("/delete/:id",isAuthenticated, isAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCityOverview = await CityOverview.findByIdAndDelete( id );
    res.status(200).json(deletedCityOverview);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor: " + err.message);
  }
});




module.exports = router;

