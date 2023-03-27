const express = require("express");
const router = express.Router();
const CityOverview = require("../models/CityOverview");
const { isAuthenticated, isAdmin } = require("../middlewares/jwt");


// GET /city-overviews
router.get("/", async (req, res) => {
  try {
    const cityOverviews = await CityOverview.find();
    res.json(cityOverviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

// GET /city-overviews/:city

router.get("/:city", async (req, res) => {
  try {
    const { city } = req.params;
    let cityOverview = await CityOverview.findOne({ cityName: city });

    if (!cityOverview) {
      // Si no se encuentra un documento en la base de datos, devolver un error
      return res.status(404).json({ message: "La ciudad solicitada no se encontró en la base de datos" });
    }

    res.json(cityOverview);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor" + err.message);
  }
});


// GET /city-overviews/:id
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

// POST /users/city-overviews/:cityOverviewId- añadir a los favoritos
router.post("/:cityOverviewId", async (req, res) => {
  try {
    const { cityOverviewId } = req.params;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const cityOverview = await CityOverview.findById(cityOverviewId);

    if (!user) {
      return res.status(404).json({ msg: "Lo sentimos, debe registrarse para añadirlo a tus favoritos" });
    }

    if (!cityOverview) {
      return res.status(404).json({ msg: "No se ha encontrado este destino" });
    }

    if (user.cityOverviews.includes(cityOverviewId)) {
      return res.status(400).json({ msg: "Ya existe este destino en tu cuenta" });
    }

    user.cityOverviews.push(cityOverviewId);
    await user.save();

    res.json({ msg: "Añadido a tus favoritos" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});


router.delete("/:id",isAuthenticated, async (req, res) => {
  console.log(req.user);
  try {
    const { id } = req.params;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ msg: "Usuario no autentificado" });
    }
    const isAdminRequest = user.role === 'admin';
    const userId = user.id;
    const userDoc = await User.findById(userId);
    const cityOverview = await CityOverview.findById(id);
    if (!cityOverview) {
      return res.status(404).json({ msg: "No se ha encontrado este destino" });
    }
    if (isAdminRequest) {
      // Delete city overview from the database
      await cityOverview.remove();
      res.json({ msg: "Destino se ha eliminado de la base de datos" });
    } else {
      // Delete city overview from user account
      if (!userDoc) {
        return res.status(404).json({ msg: "No se ha encontrado este usuario" });
      }
      if (!userDoc.cityOverviews.includes(id)) {
        return res.status(404).json({ msg: "No se ha encontrado el destino en la cuenta del usuario" });
      }
      userDoc.cityOverviews.pull(id);
      await userDoc.save();
      res.json({ msg: "Destino eliminado de la cuenta de usuario" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor: " + err.message);
  }
});



module.exports = router;

