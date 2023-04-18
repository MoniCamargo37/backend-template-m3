// require("dotenv").config();
// const mongoose = require("mongoose");
// const CityOverview = require("../models/CityOverview");

// const cityOverview = [
//     {
//       itineraryPic: "https://example.com/itinerary1.jpg",
//       cityName: "Madrid",
//       description: "Discover the vibrant capital of Spain",
//       currency: "EUR",
//       numSearches: 1000,
//       location: "40.416775,-3.703790",
//       destinationPics: [
//         "https://example.com/madrid1.jpg",
//         "https://example.com/madrid2.jpg",
//         "https://example.com/madrid3.jpg",
//       ],
//     },
//     {
//       itineraryPic: "https://example.com/itinerary2.jpg",
//       cityName: "Paris",
//       description: "Experience the romantic city of lights",
//       currency: "EUR",
//       numSearches: 2000,
//       location: "48.856613,2.352222",
//       destinationPics: [
//         "https://example.com/paris1.jpg",
//         "https://example.com/paris2.jpg",
//         "https://example.com/paris3.jpg",
//       ],
//     },
//   ];

//   mongoose
//   .connect(process.env.MONGO_URL)
//   .then((x) => {
//     console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
//   })
//   .then(() => {
//     return CityOverview.deleteMany({});
//   })
//   .then(() => {
//     return CityOverview.create(cityOverview);
//   })
//   .then((created) => {
//     console.log(`Inserted ${created.length} CityOverview into the database`);
//   })
//   .catch((err) => {
//     console.error("Error connecting to mongo: ", err);
//   })
//   .finally(() => {
//     mongoose.connection.close();
//   });

//BACKLOG para restaurantes