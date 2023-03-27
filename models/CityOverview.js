const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const cityOverviewSchema = new Schema({
  itineraryPic: {
    type: String,
    // required: true
  },
  cityName: {
    type: String,
    // required: true
  },
  description: {
    type: String,
    // required: true
  },
  currency: {
    type: String,
    // required: true
  },
  numSearches: {
    type: Number,
    // required: true
  },
  location: {
    type: String,
    // required: true
  },
  destinationPics: {
    type: [String],
    // required: true
  }
});

module.exports = model('CityOverview', cityOverviewSchema);
