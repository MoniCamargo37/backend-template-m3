require('dotenv').config();
const mongoose = require('mongoose');
const Trip = require('../models/Trip'); 

  const trips = [
    {
      "city": "Madrid",
      "tripDuration": 5,
      "numTravellers": 2,
      "monthOfTrip": "July",
      "startDate": "2023-07-10",
      "endDate": "2023-07-15",
      "budget": 1500,
      "weather": "Sunny",
    },
    {
      "city": "Paris",
      "tripDuration": 7,
      "numTravellers": 4,
      "monthOfTrip": "September",
      "startDate": "2024-09-05",
      "endDate": "2024-09-12",
      "budget": 3000,
      "weather": "Sunny",
    }];

    mongoose.connect(process.env.MONGO_URL)
    .then(x => console.log(`Connected to ${x.connection.name}`))
    .then(() => {
      return Trip.create(trips); // Crea los documentos de la semilla
    })
    .then(() => {
      console.log('Seed done 🌱');
    })
    .catch(e => console.log(e))
    .finally(() => {
      console.log('Closing connection');
      mongoose.connection.close();
    })
  
// Run npm run seed 