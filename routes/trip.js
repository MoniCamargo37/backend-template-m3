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
router.get('/', isAuthenticated, async (req, res, next) => {
  const { _id: userId } = req.payload;
  try {
    const trips = await Trip.find({ user: userId });
    res.status(200).json(trips);
  } catch (error) {
    next(error)
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
router.post('/actividades',  async (req, res) => {
  try {
    const { city, tripDuration, numTravellers, monthOfTrip, tripType, budget } = req.body;
    const AIresponse = await openAIConnection(`Eres un agente de viajes experto en el tema que recomiendas visitas a tus clientes. Para las recomendaciones sigues las siguientes reglas:
    - Haces un plan para cada uno de los días que te piden.
    - Tienes en cuenta que una actividad de otra dentro del mismo día no estén a más de 10 kilómetros de distancia.
    - Para tener en cuenta las actividades recomendadas debes tener en cuenta también el tiempo de trayecto desde la ciudad de inicio (o la última actividad realizada).
    - No puedes ocupar más de 8 horas del día para hacer actividades.
    - Si hay actividades que son muy largas, solamente recomiendas una en el día, o dos... nunca superando dichas 8 horas.
    - No indiques las horas de las actividades, limítate a mostrar las actividades sin más y la duración de lo que se puede tardar en la actividad.
    - No indiques ningún tipo de comida en el itinerario a realizar.
    - El formato de devolución del plan debe ser exactamente: |día|actividad|duración|actividad|duración|
    
    Petición del cliente:
    Quiero un plan para ${tripDuration} días en la ciudad de ${city} que sean apropiadas para un viaje de estilo ${tripType} durante el mes número ${monthOfTrip} para ${numTravellers} viajeros.`,0,1);
    console.log("La respuesta de la máquina: ", AIresponse);
    const AIresponseArray = AIresponse.choices.replace(/\r?\n|\r/g, '').split('|');

    let index = 1;
    let name = '';
    let description = '';
    let duration = '';
    let newActivity = new Activity({
      name: '',
      description: '',
      duration: ''});
    let day = new Day({
      name: 'day ' + index,
      activities: []
    })

    let days = [];

    console.log(AIresponseArray);

    AIresponseArray.forEach(phrase => {
      console.log('-', phrase);
      if(phrase.includes('Día')){
        console.log('entra');
        if(day.activities.length > 0) {
          days.push(day);
          index++;
          day = new Day({name: 'day ' + index, activities: []});
        }
      } else if(phrase.includes('hora')) newActivity.duration = phrase;
        else if(phrase === '\n') {}
        else {
          if(newActivity.name !== '') { //Quiere decir que no es la primera vez
            day.activities.push(newActivity);
          }
          newActivity.name = phrase;
        }
    });
    days.push(day);

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
  try {
    const { _id: userId } = req.payload;

    const { city, tripDuration, numTravellers, monthOfTrip, tripType, budget, dayTrip, cityOverview, weather } = req.body;

    // Create Trip object with required fields and references to CityOverview and DayTrip
    const newTrip = await Trip.create({
      city,
      tripDuration,
      numTravellers,
      monthOfTrip,
      tripType,
      budget,
      dayTrip,
      cityOverview,
      user: userId,
      weather
    });

    res.status(201).json(newTrip);
  } catch (error) {
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
