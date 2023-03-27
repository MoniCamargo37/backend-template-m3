require("dotenv").config();
const mongoose = require("mongoose");
const Trip = require("../models/Trip");
const CityOverview = require("../models/CityOverview");
const RestaurantModel = require("../models/Restaurant");
const DayTripModel = require("../models/DayTrip");
const Favorite = require("../models/Favorite");

const cityOverview = [
  {
    name: "Madrid",
    country: "Spain",
    image: "https://example.com/madrid.jpg",
    description: "Discover the vibrant capital of Spain",
  },
  {
    name: "Paris",
    country: "France",
    image: "https://example.com/paris.jpg",
    description: "Experience the romantic city of lights",
  },
];

const restaurants = [
  { name: "El Botín", foodType: "Spanish cuisine", city: "Madrid" },
  { name: "Le Jules Verne", foodType: "French cuisine", city: "Paris" },
  { name: "La Pergola", foodType: "Italian cuisine", city: "Rome" },
  { name: "Narisawa", foodType: "Japanese cuisine", city: "Tokyo" },
];

const dayTrip = [
  {
    activity1: "Visit the Prado Museum",
    activity2: "Walk around Retiro Park",
    activity3: "Explore the Royal Palace of Madrid",
    restaurants: [],
  },
  {
    activity1: "Visit the Eiffel Tower",
    activity2: "Walk around the Champs-Élysées",
    activity3: "Explore the Louvre Museum",
    restaurants: [],
  },
];

const trip = [
  {
    city: "Madrid",
    tripDuration: 5,
    numTravellers: 2,
    monthOfTrip: "July",
    startDate: "2023-07-10",
    endDate: "2023-07-15",
    budget: 1500,
    weather: "Sunny",
    dayTrip: [dayTrip[0], dayTrip[1]],
  },
  {
    city: "Paris",
    tripDuration: 7,
    numTravellers: 4,
    monthOfTrip: "September",
    startDate: "2024-09-05",
    endDate: "2024-09-12",
    budget: 3000,
    weather: "Sunny",
    dayTrip: [dayTrip[2], dayTrip[3]],
  },
  // Add a new trip object
  {
    city: "Rome",
    tripDuration: 3,
    numTravellers: 1,
    monthOfTrip: "November",
    startDate: "2025-11-08",
    endDate: "2025-11-11",
    budget: 1000,
    weather: "Sunny",
    dayTrip: [dayTrip[2]],
  },
];
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    return Promise.all([
      CityOverview.create(cityOverview),
      RestaurantModel.create(restaurants),
      DayTripModel.create(dayTrip),
    ]);
  })
  .then(([cityOverview, createdRestaurants, dayTrip]) => {
    restaurants = createdRestaurants; // Assign it to local variable to make sure the object exists before accessed
    trip[0].cityOverview = [cityOverview[0]];
    trip[0].dayTrip[0].restaurants.push(restaurants[0]._id); // Push the ObjectId instead of the whole object
    trip[0].dayTrip[1].restaurants.push(restaurants[1]._id); // Push the ObjectId instead of the whole object
    trip[1].cityOverview = [cityOverview[1]];
    trip[1].dayTrip[0].restaurants.push(restaurants[0]._id); // Push the ObjectId instead of the whole object
    trip[1].dayTrip[1].restaurants.push(restaurants[1]._id); // Push the ObjectId instead of the whole object

    return Trip.create(trip);
  })
  .then((trip) => {
    console.log("Trip seed done 🌱");
  })
  .catch((e) => console.log(e))
  .finally(() => {
    console.log("Closing connection");
    mongoose.connection.close();
  });
