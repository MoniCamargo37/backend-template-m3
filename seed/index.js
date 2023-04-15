// require("dotenv").config();
// const mongoose = require("mongoose");
// const Trip = require("../models/Trip");
// const CityOverview = require("../models/CityOverview");
// const Restaurant = require("../models/Restaurant");
// const DayTrip = require("../models/DayTrip");

// const cityOverviews = [
//   {
//     itineraryPic: "roma.jpg",
//     cityName: "Roma",
//     description:
//       "La ciudad eterna con una impresionante arquitectura y gastronomía",
//     currency: "Euro",
//     numSearches: 1500,
//     location: "Italia",
//     destinationPics: ["roma1.jpg", "roma2.jpg"],
//   },
//   {
//     itineraryPic: "paris.jpg",
//     cityName: "París",
//     description:
//       "La ciudad del amor y la luz, con una rica cultura y belleza arquitectónica",
//     currency: "Euro",
//     numSearches: 1800,
//     location: "Francia",
//     destinationPics: ["paris1.jpg", "paris2.jpg"],
//   },
//   {
//     itineraryPic: "tokyo.jpg",
//     cityName: "Tokio",
//     description:
//       "La ciudad más grande del mundo, con una rica cultura y tecnología avanzada",
//     currency: "Yen",
//     numSearches: 1200,
//     location: "Japón",
//     destinationPics: ["tokyo1.jpg", "tokyo2.jpg"],
//   },
//   {
//     itineraryPic: "santiago.jpg",
//     cityName: "Santiago",
//     description:
//       "La capital chilena, con una vibrante escena cultural y una ubicación impresionante en los Andes",
//     currency: "Peso chileno",
//     numSearches: 800,
//     location: "Chile",
//     destinationPics: ["santiago1.jpg", "santiago2.jpg"],
//   },
//   {
//     itineraryPic: "sydney.jpg",
//     cityName: "Sídney",
//     description:
//       "La ciudad más grande y cosmopolita de Australia, con una impresionante mezcla de playas y vida urbana",
//     currency: "Dólar australiano",
//     numSearches: 1000,
//     location: "Australia",
//     destinationPics: ["sydney1.jpg", "sydney2.jpg"],
//   },
//   {
//     itineraryPic: "singapore.jpg",
//     cityName: "Singapur",
//     description:
//       "La ciudad-estado más pequeña del mundo, con una rica cultura y una economía avanzada",
//     currency: "Dólar de Singapur",
//     numSearches: 900,
//     location: "Singapur",
//     destinationPics: ["singapore1.jpg", "singapore2.jpg"],
//   },
//   {
//     itineraryPic: "berlin.jpg",
//     cityName: "Berlín",
//     description:
//       "La capital de Alemania, con una vibrante escena cultural y una rica historia",
//     currency: "Euro",
//     numSearches: 1200,
//     location: "Alemania",
//     destinationPics: ["berlin1.jpg", "berlin2.jpg"],
//   },
//   {
//     itineraryPic: "amsterdam.jpg",
//     cityName: "Ámsterdam",
//     description:
//       "La ciudad de los canales, con una rica cultura y arquitectura distintiva",
//     currency: "Euro",
//     numSearches: 1000,
//     location: "Países Bajos",
//     destinationPics: ["amsterdam1.jpg", "amsterdam2.jpg"],
//   },
//   {
//     itineraryPic: "imagen4.jpg",
//     cityName: "Nueva York",
//     description: "La ciudad que nunca duerme",
//     currency: "Dólar estadounidense",
//     numSearches: 2000,
//     location: "Estados Unidos",
//     destinationPics: ["imagen5.jpg", "imagen6.jpg"],
//   },
// ];


// const dayTrips = [
//   {
//     activity1: 'Visita a un museo',
//     activity2: 'Caminata por el parque',
//     activity3: 'Cena en un restaurante de sushi',
//     restaurant1: 'Sushi House',
//     restaurant2: 'Tokyo Sushi'
//   },
//   {
//     activity1: 'Excursión en bote',
//     activity2: 'Visita a un faro',
//     activity3: 'Cena en un restaurante de mariscos',
//     restaurant1: 'The Lobster House',
//     restaurant2: 'The Crab Shack'
//   },
//   {
//     activity1: 'Recorrido por la ciudad',
//     activity2: 'Visita a una galería de arte',
//     activity3: 'Cena en un restaurante de comida mexicana',
//     restaurant1: 'Taco Time',
//     restaurant2: 'El Ranchito'
//   },
//   {
//     activity1: 'Paseo en bicicleta',
//     activity2: 'Visita a un parque de atracciones',
//     activity3: 'Cena en un restaurante de comida italiana',
//     restaurant1: 'Pizza Time',
//     restaurant2: 'La Piazza'
//   },
//   {
//     activity1: 'Visita a una bodega',
//     activity2: 'Degustación de vinos',
//     activity3: 'Cena en un restaurante de comida francesa',
//     restaurant1: 'Le Bistro',
//     restaurant2: 'Le Croissant'
//   },
//   {
//     activity1: 'Visita a un jardín botánico',
//     activity2: 'Caminata por el bosque',
//     activity3: 'Cena en un restaurante de comida asiática',
//     restaurant1: 'Wok N Roll',
//     restaurant2: 'The Noodle House'
//   },
//   {
//     activity1: 'Visita a un monumento histórico',
//     activity2: 'Recorrido por la ciudad en bus',
//     activity3: 'Cena en un restaurante de comida española',
//     restaurant1: 'La Taberna',
//     restaurant2: 'El Cid'
//   },
//   {
//     activity1: 'Visita a un acuario',
//     activity2: 'Paseo en barco',
//     activity3: 'Cena en un restaurante de comida griega',
//     restaurant1: 'The Greek Place',
//     restaurant2: 'Opa!'
//   },
//   {
//     activity1: 'Recorrido por la playa',
//     activity2: 'Paseo en bote',
//     activity3: 'Cena en un restaurante de mariscos',
//     restaurant1: 'The Shrimp House',
//     restaurant2: 'The Oyster Bar'
//   },
//   {
//     activity1: 'Visita a un mercado local',
//     activity2: 'Recorrido por la ciudad en bicicleta',
//     activity3: 'Cena en un restaurante de comida vegetariana',
//     restaurant1: 'The Veggie Spot',
//     restaurant2: 'Green Cuisine'
//   }
// ];


// const trips = [
//   {
//     city: 'Barcelona',
//     tripDuration: 5,
//     numTravellers: 2,
//     monthOfTrip: 'Julio',
//     startDate: '2023-07-10',
//     endDate: '2023-07-14',
//     tripType: 'en pareja',
//     budget: 2000,
//     dayTrip: ['61f1e0d8c7984a152b0ef73f', '61f1e0d8c7984a152b0ef740'],
//     cityOverview: '61f1e0d8c7984a152b0ef741',
//     weather: 'soleado'
//   },
//   {
//     city: 'Tokio',
//     tripDuration: 7,
//     numTravellers: 4,
//     monthOfTrip: 'Agosto',
//     startDate: '2023-08-01',
//     endDate: '2023-08-07',
//     tripType: 'con amigos',
//     budget: 5000,
//     dayTrip: ['61f1e0d8c7984a152b0ef742', '61f1e0d8c7984a152b0ef743'],
//     cityOverview: '61f1e0d8c7984a152b0ef744',
//     weather: 'lluvioso'
//   },
//   {
//     city: 'Nueva York',
//     tripDuration: 3,
//     numTravellers: 3,
//     monthOfTrip: 'Noviembre',
//     startDate: '2023-11-15',
//     endDate: '2023-11-17',
//     tripType: 'para mayores',
//     budget: 1500,
//     dayTrip: ['61f1e0d8c7984a152b0ef745', '61f1e0d8c7984a152b0ef746'],
//     cityOverview: '61f1e0d8c7984a152b0ef747',
//     weather: 'frio'
//   },
//   {
//     city: 'París',
//     tripDuration: 4,
//     numTravellers: 2,
//     monthOfTrip: 'Abril',
//     startDate: '2023-04-20',
//     endDate: '2023-04-23',
//     tripType: 'en pareja',
//     budget: 3000,
//     dayTrip: ['61f1e0d8c7984a152b0ef748', '61f1e0d8c7984a152b0ef749'],
//     cityOverview: '61f1e0d8c7984a152b0ef74a',
//     weather: 'lluvioso'
//   }
// ];
// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log(`Connected to database`))
//   .then(() => {
//     // Crear los objetos CityOverview
//     return CityOverview.create(cityOverviews);
//   })
//   .then((createdCityOverviews) => {
//     console.log(`Created ${createdCityOverviews.length} CityOverviews`);
//     // Crear los objetos DayTrip
//     return DayTrip.create(dayTrips);
//   })
//   .then((createdDayTrips) => {
//     console.log(`Created ${createdDayTrips.length} DayTrips`);
//     // Crear los objetos Trip
//     return Trip.create(trips);
//   })
//   .then((createdTrips) => {
//     console.log(`Created ${createdTrips.length} Trips`);
//   })
//   .catch((error) => {
//     console.log(`An error occurred: ${error}`);
//   })
//   .finally(() => {
//     mongoose.disconnect();
//     console.log(`Disconnected from database`);
//   });
