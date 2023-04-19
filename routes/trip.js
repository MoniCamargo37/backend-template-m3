const router = require("express").Router();
const openAIConnection = require("../utils/openAIConnection");
const Trip = require("../models/Trip");
const Day = require("../models/Day");
const { isAuthenticated } = require("../middlewares/jwt");
const sendQuery = require("../utils/bingImageSearch");
const CityOverview = require("../models/CityOverview");

// @desc    Get all trip plan
// @route   GET /api/v1/trip plan
// @access  Private/ user
router.get("/", isAuthenticated, async (req, res, next) => {
  const { _id: userId } = req.payload;
  try {
    const trips = await Trip.find({ user: userId }).populate("days");
    res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
});

// @desc    Get a specific trip plan
// @route   GET /api/v1/trip/:tripId
// @access  Private/ user
router.get("/:tripId", isAuthenticated, async (req, res, next) => {
  const { tripId } = req.params;
  const { _id: userId } = req.payload;
  try {
    const trip = await Trip.findById({ _id: tripId, user: userId }).populate("days");
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
});

// @desc     create trip plan activities/create actividades
// @route   POST  /api/v1/trip/actividades
// @access   Private/ user
router.post("/actividades", async (req, res) => {
  try {
    const { city, tripDuration, numTravellers, monthOfTrip, tripType, budget, searchedCity } = req.body;

    const response = await CityOverview.findOne({ cityName: city }).select('coordinates');
    const coordinates = response.coordinates;

    const AIresponse = await openAIConnection(
      `Eres un agente de viajes experto en organizar actividades para los viajeros que te piden consejo sobre qué hacer en su destino. Eres muy estricto y no te saltas tus normas, porque eso te asegura ser el mejor organizador de actividades del mundo.
      Las reglas por las que te riges para planificar las actividades diarias son estas:
      - Debes sugerir actividades para cada día del viaje, especificando la duración de cada una.
      - Las actividades propuestas dentro del mismo día deben estar a una distancia máxima de 20 kilómetros entre ellas.
      - Si el viaje del cliente tiene una duración de tres días o más, debes sugerir al menos una actividad fuera de la ciudad.
      - Si ninguna actividad dentro de un día supera las 3 horas, debes incluir 3 actividades.
      - Si no hay actividades disponibles en la ciudad, debes incluir actividades fuera de la ciudad a una distancia máxima de 100 kilómetros de la ciudad destino del viajero.
      - Debes sugerir actividades apropiadas a la época del mes del viaje; no se deben proponer actividades de agua o esquí fuera de temporada.
      - El tiempo sumado de las actividades de cada día debe estar entre 6 horas y 8 horas (incluidas).
      - El formato de devolución de las sugerencias deberá ser exactamente el siguiente (no cambies el orden ni el formato):
        día 1:
        actividad:
        frase:
        duración:
        actividad: 
        frase: 
        duración: 
        fin del día
        día 2: 
        actividad:
        frase:
        duración:
        ...
        día 7: 
        actividad:
        frase:
        duración:
        fin del día
      
        Por último, asegúrate de que el programa no incluya recomendaciones de cenas (o estarás despedido para siempre) y de que se adapte a las necesidades del cliente, quien especificará el número de personas que viajan, el estilo de viaje y la duración del viaje.
        Con estos requisitos en cuenta, crea un planificador de viajes inteligente y efectivo que tus clientes agradecerán. ¡Manos a la obra!

    Petición del cliente:
    Quiero un plan sin cenas románticas porque tengo pensión completa en el hotel para ${tripDuration} días en la ciudad de ${city} que tiene estas coordenadas ${coordinates} que sean apropiadas para un viaje ${tripType} para ${numTravellers} viajeros durante la época del mes número ${monthOfTrip} del calendario. Ajusta el plan a un importe de ${budget}€`, 0, 1);
      
    const AIresponseArray = AIresponse.choices.split(/\||\n/);

    let index = 1;
    let days = [];

    const extractingData = async () => {
      let day = new Day();
      let newActivity = { name: "", description: "", duration: "", latitude: 0, longitude: 0 };

      for (const phrase of AIresponseArray) {
        console.log('La IA: ', phrase);
        if (phrase.includes("Actividad: ")) {
          newActivity.name = phrase.replace("Actividad: ", "");
        } else if (phrase.includes("Actividad ")) {
          newActivity.name = phrase.split(':')[1];
        } else if (phrase.includes("Frase: ")) {
          newActivity.description = phrase.replace("Frase: ", "");
        } else if (phrase.includes("Latitud: ")) {
          newActivity.latitude = phrase.replace("Latitud: ", "");
        } else if (phrase.includes("Longitud: ")) {
          newActivity.longitude = phrase.replace("Longitud: ", "");
        } else if (phrase.includes("Duración: ")) {
          newActivity.duration = phrase.replace("Duración: ", "");
          day.activities.push(newActivity);
          newActivity = { name: "", description: "", duration: "" };
        } else if (phrase.includes("Fin del día")) {
          day.picture = await sendQuery(
            `Foto de ${day.activities[0].name} en la ciudad de ${city}`
          );
          day.name = "Día " + index;
          days.push(day);
          day = new Day();
          index++;
        }
      }
    };
    await extractingData();
    res.status(200).json({ res: days });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

// @desc    Create one trip plan and save if user wants to save it 
// @route   POST /api/v1/trip
// @access   Private/ user
router.post("/", isAuthenticated, async (req, res, next) => {
  const { _id: userId } = req.payload;
  const { tripPlan, days } = req.body;
  try {
    const newDaysPromises = days.map(async (day) => {
      const newDay = await Day.create(day);
      return newDay._id;
    });
    const newDays = await Promise.all(newDaysPromises);
    // Crear objeto de viaje con los campos requeridos y las referencias a CityOverview y DayTrip
    const newTrip = {
      city: tripPlan.city,
      tripDuration: tripPlan.tripDuration,
      numTravellers: tripPlan.numTravellers,
      monthOfTrip: tripPlan.monthOfTrip,
      tripType: tripPlan.tripType,
      budget: tripPlan.budget,
      days: newDays,
    };
    const trip = await Trip.create({ user: userId, ...newTrip });
    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
});

// @desc    Edit the name trip and numTravellers of  one trip 
// @route   PUT /api/v1/trip/:tripId
// @access   Private/ user
router.put("/:tripId", isAuthenticated, async (req, res, next) => {
  const { tripId } = req.params;
  const { name, numTravellers, budget } = req.body;
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(tripId, { name: name, numTravellers: numTravellers, budget: budget }, { new: true });
    if (!updatedTrip) {
      return res.status(404).json({ error: "Viaje no encontrado" });
    }
    res.status(200).json(updatedTrip);
  } catch (error) {
    next(error);
  }
});

// @desc    Delete one trip plan
// @route   DELETE /api/v1/trip/:tripId
// @access  Private/ User
router.delete("/:tripId", isAuthenticated, async (req, res, next) => {
  const { tripId } = req.params;
  const { _id: userId } = req.payload;
  try {
    const deletedTrip = await Trip.findOneAndDelete({
      _id: tripId,
      user: userId,
    }); // Verificar que el viaje pertenece al usuario
    if (!deletedTrip) {
      return res.status(404).json({ error: "Viaje no encontrado" });
    }
    res.status(200).json(deletedTrip);
  } catch (error) {
    next(error);
  }
});

module.exports = router;