require("dotenv").config();
const mongoose = require("mongoose");
const Trip = require("../models/Trip");
const CityOverview = require("../models/CityOverview");
const Restaurant = require("../models/Restaurant");
const DayTrip = require("../models/DayTrip");

const cityOverview = [
  {
    itineraryPic: "https://example.com/madrid1.jpg",
    cityName: "Madrid",
    description: "Discover the vibrant capital of Spain",
    currency: "EUR",
    numSearches: 12345,
    location: "40.4168° N, 3.7038° W",
    destinationPics: [
      "https://example.com/madrid1.jpg",
      "https://example.com/madrid2.jpg",
      "https://example.com/madrid3.jpg",
    ],
  },
  {
    itineraryPic: "https://example.com/paris1.jpg",
    cityName: "Paris",
    description: "Experience the romantic city of lights",
    currency: "EUR",
    numSearches: 98765,
    location: "48.8566° N, 2.3522° E",
    destinationPics: [
      "https://example.com/paris1.jpg",
      "https://example.com/paris2.jpg",
      "https://example.com/paris3.jpg",
    ],
  },
  {
    itineraryPic: "https://example.com/newyork1.jpg",
    cityName: "New York",
    description: "Explore the Big Apple",
    currency: "USD",
    numSearches: 54321,
    location: "40.7128° N, 74.0060° W",
    destinationPics: [
      "https://example.com/newyork1.jpg",
      "https://example.com/newyork2.jpg",
      "https://example.com/newyork3.jpg",
    ],
  },
  {
    itineraryPic: "https://example.com/tokyo1.jpg",
    cityName: "Tokyo",
    description: "Experience the culture of Japan",
    currency: "JPY",
    numSearches: 24680,
    location: "35.6762° N, 139.6503° E",
    destinationPics: [
      "https://example.com/tokyo1.jpg",
      "https://example.com/tokyo2.jpg",
      "https://example.com/tokyo3.jpg",
    ],
  },
];

const restaurants = [
  { name: "El Botín", foodType: "Spanish cuisine", city: "Madrid" },
  { name: "Le Jules Verne", foodType: "French cuisine", city: "Paris" },
  { name: "La Pergola", foodType: "Italian cuisine", city: "Rome" },
  { name: "Narisawa", foodType: "Japanese cuisine", city: "Tokyo" },
];
const restaurantsMap = new Map();
restaurants.forEach((restaurant) => {
  restaurantsMap.set(restaurant.name, restaurant._id);
});

const dayTrip = [
  {
    activity1: "Visit the Prado Museum",
    activity2: "Walk around Retiro Park",
    activity3: "Explore the Royal Palace of Madrid",
    restaurants: [restaurantsMap.get("El Botín"), restaurantsMap.get("Le Jules Verne")],
  },
  {
    activity1: "Visit the Eiffel Tower",
    activity2: "Walk around the Champs-Élysées",
    activity3: "Explore the Louvre Museum",
    restaurants: [restaurantsMap.get("Le Jules Verne"), restaurantsMap.get("La Pergola")],
  },
  {
    activity1: "Visit the Colosseum",
    activity2: "Walk around the Roman Forum",
    activity3: "Explore the Vatican Museums",
    restaurants: [restaurantsMap.get("La Pergola")],
  },
];

const trip = [
  {
    city: "Madrid",
    itineraryPic: "https://example.com/madrid1.jpg",
    tripDuration: 5,
    numTravellers: 2,
    monthOfTrip: "July",
    startDate: "2023-07-10",
    endDate: "2023-07-15",
    budget: 1500,
    weather: "Sunny",
    dayTrip: dayTrip.map((dt) => {
      return {
        activity1: dt.activity1,
        activity2: dt.activity2,
        activity3: dt.activity3,
        restaurants: dt.restaurants.map((r) => dt.restaurants.map((r) => restaurantsMap.get(r))),
      };
    }),
  }, 
];

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");

    return Promise.all([
      CityOverview.create(cityOverview),
      Restaurant.create(restaurants),
      DayTrip.create(dayTrip),
    ]);
  })
  .then(([cityOverviewDocs, restaurantDocs, dayTripDocs]) => {
    console.log("Seed data created");

    // Mapear los _id de los restaurantes en el campo restaurants de dayTrip
    const dayTripMapped = dayTrip.map((dt) => {
      return {
        activity1: dt.activity1,
        activity2: dt.activity2,
        activity3: dt.activity3,
        restaurants: dt.restaurants.map((r) => restaurantsMap.get(r)),
      };
    });

    const tripMapped = trip.map((t) => {
      return {
        city: t.city,
        itineraryPic: t.itineraryPic,
        tripDuration: t.tripDuration,
        numTravellers: t.numTravellers,
        monthOfTrip: t.monthOfTrip,
        startDate: t.startDate,
        endDate: t.endDate,
        budget: t.budget,
        weather: t.weather,
        dayTrip: dayTripMapped.map((dt) => {
          return {
            activity1: dt.activity1,
            activity2: dt.activity2,
            activity3: dt.activity3,
            restaurants: dt.restaurants.map((restaurantId) => restaurantsMap.get(restaurantId)),
          };
        }),
        cityOverview: cityOverviewDocs.find((c) => c.cityName === t.city)._id,
      };
    });

    return Trip.create(tripMapped);
  })
  .then(() => {
    console.log("Trip seed data created");
  })
  .catch((error) => {
    console.log(`Error seeding data: ${error}`);
  })
  .finally(() => {
    console.log("Closing MongoDB connection");
    mongoose.connection.close();
  });