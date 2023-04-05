const router = require('express').Router();
const Trip = require('../models/Trip');
const CityOverview = require('../models/CityOverview');
const openAIConnection = require("../utils/openAIConnection");
const Activity = require('../models/Activity');
const Day = require('../models/Day');
const { isAuthenticated, isAdmin } = require('../middlewares/jwt');
const req = require('express/lib/request');

// @desc    Get all trip plan
// @route   GET /api/v1/trip plan
// @access  Private/ user 
// router.get('/', isAuthenticated, async (req, res, next) => {
//   const { _id: userId } = req.payload;
//   try {
//     const trips = await Trip.find({ user: userId });
//     res.status(200).json(trips);
//   } catch (error) {
//     next(error)
//   }
// });

router.get('/', isAuthenticated, async (req, res, next) => {
  console.log('Se recibió una solicitud GET');
  const { _id: userId } = req.payload;
  try {
    const trips = await Trip.find({ user: userId });
    res.status(200).json(trips);
  } catch (error) {
    console.log('Error al procesar la solicitud GET');
    next(error);
  }
});


  
// @desc    Get a specific trip plan
// @route   GET /api/v1/trip/:tripId
// @access  Private/ user 
router.get('/:tripId',isAuthenticated, async (req, res, next) => {
  const { tripId } = req.params;
  const { _id: userId } = req.payload;
  try {
    const trip = await Trip.findById({_id: tripId, user: userId});
    res.status(200).json(trip);
  } catch (error) {
    next(error)
  }
});

// @desc     create trip plan activities.
// @route   POST  /api/v1/trip/actividades 
// @access   Private/ user 
router.post('/actividades', async (req, res) => {
  
  try {
    // const { _id: userId } = req.payload;
    const { city, tripDuration, numTravellers, monthOfTrip, tripType,
budget } = req.body;
    const AIresponse = await openAIConnection(`Eres un agente de
viajes experto en el tema que recomiendas visitas a tus clientes. Para
las recomendaciones sigues las siguientes reglas:
    - Haces un plan para cada uno de los días que te piden indicando
la duración de cada actividad.
    - Las actividades del mismo día deben estar a menos de 10
kilómetros de distancia.
    - Si el viaje es de 3 días o más , mínimo 1 día debe ser fuera de
la ciudad. Si no hay actividades que hacer en la ciudad, propón todas
las actividades en la provincia.
    - Para las actividades ten en cuenta la época del año del viaje,
la temperatura... por ejemplo no propongas actividades de agua en
invierno.
    - La suma de todas las actividades propuestas de un día deben
estar MÍNIMO 7 horas y MÁXIMO 9 horas sumando desplazamientos de una
actividad a otra.
    - No indiques las horas de las actividades, limítate a mostrar las
actividades sin más, una frase emocionante sobre cada una y la
duración de lo que se puede tardar en la actividad.
    - No uses desayuno, comida, cena, tapas ni similares como actividad.
    - El formato de devolución del plan debe ser exactamente: día
1|actividad|frase|duración|actividad|frase|duración|día
2|actividad|frase|duración|... (no cambies el orden ni el formato)

    Petición del cliente:
    Quiero un plan para ${tripDuration} días en la ciudad de ${city}
que sean apropiadas para un viaje de estilo ${tripType} durante el mes
número ${monthOfTrip} para ${numTravellers} viajeros.`,0,1);
    const AIresponseArray = AIresponse.choices.split(/\||\n/);

    let index = 1;

    console.log(AIresponseArray);

    let indexPhrase = 0;
    let day = new Day;
    let newActivity = new Activity;
    let days = [];

    AIresponseArray.forEach(phrase => {
      if (phrase.includes('Día')) {
        indexPhrase = 0;
        if (day && day.activities.length > 0) {
          days.push(day);
          // day.save();
        }
        day = new Day({name: 'day ' + index, activities: []});
        index++;
      }

      switch(indexPhrase){
        case 0:
          indexPhrase = 1;
          break;
        case 1:
          newActivity = new Activity({ name: '', description: '',
duration: '' });
          newActivity.name = phrase;
          indexPhrase = 2;
          break;
        case 2:
          newActivity.description = phrase;
          indexPhrase = 3;
          break;
        case 3:
          newActivity.duration = phrase;
          day.activities.push(newActivity);
          // newActivity.save();
          newActivity = null;
          indexPhrase = 1;
          break;
        default:
          break;
      }
    });

    if (day && day.activities.length > 0) {
      days.push(day);
      // day.save();
    }

// return res.status(200).send(Day);

    res.status(200).json({res: days});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ha ocurrido un error' });
  }
});

// @desc    Create one trip plan
// @route   POST /api/v1/trip
// @access   Private/ user 
router.post('/', isAuthenticated, async (req, res, next) => {
  const { _id: userId } = req.payload;
  const { tripPlan, days } = req.body;
  console.log("Los days: ", days);
  try {
    // Crear objeto de viaje con los campos requeridos y las referencias a CityOverview y DayTrip
    const newTrip = {
      city: tripPlan.city,
      tripDuration: tripPlan.tripDuration,
      numTravellers: tripPlan.numTravellers,
      monthOfTrip: tripPlan.monthOfTrip,
      tripType: tripPlan.tripType,
      budget: tripPlan.budget,
      days: days,
    };
    const trip = await Trip.create({ user: userId, ...newTrip });
    res.status(201).json(trip);
  } catch (error) {
    console.log('Error');
    next(error);
  }
});




// @desc    Edit one trip
// @route   PUT /api/v1/trip/:tripId
// @access   Private/ user 
router.put('/:tripId',isAuthenticated, async (req, res, next) => {
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
// @route   DELETE /api/v1/trip/:tripId
// @access  Private/ User
router.delete('/:tripId', isAuthenticated, async (req, res, next) => {
  const { tripId } = req.params;
  const { _id: userId } = req.payload; 
  try {
    const deletedTrip = await Trip.findOneAndDelete({ _id: tripId, user: userId }); // Verificar que el viaje pertenece al usuario
    if (!deletedTrip) {
    
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }
    res.status(200).json(deletedTrip);
  } catch (error) {
    next(error);
  }
});


  
  module.exports = router;
