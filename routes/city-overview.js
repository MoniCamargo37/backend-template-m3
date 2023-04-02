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
    const { city } = req.params;
    let cityOverview = await CityOverview.findOne({ cityName: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase() });
    if (!cityOverview) {
      let myCity = new CityOverview;
      myCity.cityName = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
      myCity.numSearches = 1;
      const AIresponse = await openAIConnection(
        "Escribe una larga descripción seria y precisa de un párrafo sobre la ciudad de " + city + " y otro sobre los alrededores con un eslogan final que atraiga visitantes. Devuelve el texto, el nombre de la ciudad y el país, sin repetir la ciudad, con dichos campos separados por una | con el siguiente formato ciudad|pais|descripcion. No hay que poner espacios entre la información y la |", 0, 1);
      const arrayResponse = AIresponse.choices[0].text.split('|');
      console.log(arrayResponse);
      const foundCity = arrayResponse[0].replace(/\r?\n|\r/g, '');
      if(foundCity === 'null'){
        return res.status(500).send(null);
      }
      myCity.description = arrayResponse[2].replace(/\r?\n|\r/g, '');
      myCity.country = arrayResponse[1].replace(/\r?\n|\r/g, '');
      myCity.cityName = arrayResponse[0].replace(/\r?\n|\r/g, '');
      //Now we need to find the images
      let image1 = await sendQuery(`Panorámica de la ciudad ${city}, ${myCity.country}`);
      let image2 = await sendQuery(`Parque de la ciudad ${city}, ${myCity.country}`);
      let image3 = await sendQuery(`Monumento de la ciudad ${city}, ${myCity.country}`);
      console.log("Esto es lo que recibimos: ", image1);
      console.log("Esto es lo que recibimos: ", image2);
      console.log("Esto es lo que recibimos: ", image3);
      myCity.destinationPics = [image1, image2];
      myCity.itineraryPic = image3;

      await myCity.save();
      // console.log(myCity);
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


// @desc    Get city by ID
// @route   GET /api/v1/city-overview/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cityOverview = await CityOverview.findById(id);

    if (!cityOverview) {
      return res.status(404).json({ msg: "No se ha encontrado este destino" });
    }

    res.json(cityOverview);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


// @desc    Delete cityOverview from database
// @route   DELETE /api/v1/city-overview/:id
// @access  Private/isAdmin
router.delete("/delete/:id", isAuthenticated,
isAdmin, async (req, res) => {
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

