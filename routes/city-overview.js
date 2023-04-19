const express = require("express");
const router = express.Router();
const CityOverview = require("../models/CityOverview");
const openAIConnection = require("../utils/openAIConnection");
const { isAuthenticated, isAdmin } = require("../middlewares/jwt");
const sendQuery = require('../utils/bingImageSearch');

// @desc    get all cityOverviews 
// @route   GET /api/v1/city-overview"
// @access  Public
router.get("/", async (req, res) => {
  try {
    const cityOverviews = await CityOverview.find();
    res.json(cityOverviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

// @desc    most Searched cityOverview
// @route   GET /api/v1//city-overview/mostSearched"
// @access  Public
router.get("/mostSearched", async (req, res) => {
  try {
    const cityOverviews = await CityOverview.find().sort({ numSearches: -1 }).limit(10);
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
        let { city } = req.params;
    
        let cityOverview = await CityOverview.findOne({ cityName: city });
    
        if (!cityOverview) {
          let myCity = new CityOverview;
          myCity.cityName = city;
          myCity.country = city.split('(')[1].split(')')[0];
          myCity.numSearches = 1;
          openAIResponse = await openAIConnection(
            "Escribe una larga descripción seria y precisa de dos párrafos sobre la ciudad de " + city + " y sus alrededores con un eslogan final que atraiga visitantes. Envía al final la latitud y la longitud en este formato: (latitud,longitud)", 1, 1);
          myCity.description = openAIResponse.choices.split('(')[0];
          myCity.coordinates = openAIResponse.choices.split('(')[1].split(')')[0];
    
          //Now we need to find the images for this city
          let image1 = await sendQuery(`Vista Panorámica de ${myCity.country}, ${myCity.cityName}`);
          let image2 = await sendQuery(`Lugar histórico de ${myCity.country}, ${myCity.cityName}`);
          let image3 = await sendQuery(`Monumento  de ${myCity.country}, ${myCity.cityName}`);
          myCity.destinationPics = [image1, image2];
          myCity.itineraryPic = image3;
          await myCity.save();
          return res.status(200).send(myCity);
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

// @desc    Delete cityOverview from database
// @route   DELETE /api/v1/city-overview/:id
// @access  Private/isAdmin
router.delete("/delete/:id", isAuthenticated, isAdmin, async (req, res) => {
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

