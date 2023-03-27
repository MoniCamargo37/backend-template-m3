require("dotenv").config();
const mongoose = require("mongoose");
const Trip = require("../models/Trip");
const CityOverview = require("../models/CityOverview");
const Restaurant = require("../models/Restaurant");
const DayTrip = require("../models/DayTrip");
const Favorite = require("../models/Favorite");

const restaurants = [
  {
    name: "El Botín",
    foodType: "Spanish cuisine",
    city: "Madrid",
  },
  {
    name: "Le Jules Verne",
    foodType: "French cuisine",
    city: "Paris",
  },
];

const dayTrips = [
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


const trips = [
  {
    city: "Madrid",
    tripDuration: 5,
    numTravellers: 2,
    monthOfTrip: "July",
    startDate: "2023-07-10",
    endDate: "2023-07-15",
    budget: 1500,
    weather: "Sunny",
    dayTrip: [dayTrips[0], dayTrips[1]],
    cityOverview: [cityOverviews[0]],
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
    dayTrip: [dayTrips[2], dayTrips[3]],
    cityOverview: [cityOverviews[1]],
  },
];

const cityOverviews = [
  {
    itineraryPic: "https://example.com/itinerary1.jpg",
    cityName: "Madrid",
    description: "Discover the vibrant capital of Spain",
    currency: "EUR",
    numSearches: 1000,
    location: "40.416775,-3.703790",
    destinationPics: [
      "https://example.com/madrid1.jpg",
      "https://example.com/madrid2.jpg",
      "https://example.com/madrid3.jpg",
    ],
  },
  {
    itineraryPic: "https://example.com/itinerary2.jpg",
    cityName: "Paris",
    description: "Experience the romantic city of lights",
    currency: "EUR",
    numSearches: 2000,
    location: "48.856613,2.352222",
    destinationPics: [
      "https://example.com/paris1.jpg",
      "https://example.com/paris2.jpg",
      "https://example.com/paris3.jpg",
    ],
  },
];

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    return DayTrip.find().limit(2);
  })
  .then((dayTrips) => {
    trips[0].dayTrip = dayTrips.slice(0, 2);
    trips[1].dayTrip = dayTrips.slice(2, 4);

    return CityOverview.find().limit(2);
  })
  // .then((cityOverviews) => {
  //   trips[0].cityOverview = cityOverviews.slice(0, 1);
  //   trips[1].cityOverview = cityOverviews.slice(1, 2);

  //   return Trip.create(trips);
  // })

  .then((cityOverviews) => {
    trips[0].cityOverview = cityOverviews.slice(0, 1);
    trips[1].cityOverview = cityOverviews.slice(1, 2);
  
    return CityOverview.create(cityOverviews);
  })
  .then(() => {
    console.log("Trip seed done 🌱");
    return CityOverview.create(cityOverviews);
  })
  .then(() => {
    console.log("CityOverview seed done 🌱");
    return Restaurant.create(restaurants);
  })
  .then(() => {
    console.log("Restaurant seed done 🌱");
    return DayTrip.create(dayTrips);
  })
  .catch((e) => console.log(e))
  .finally(() => {
    console.log("Closing connection");
    mongoose.connection.close();
  });