const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const cityOverviewSchema = new Schema({
  itineraryPic: {
    type: String,
  
  },
  cityName: {
    type: String,
   
  },
  country: {
    type: String,

  },
  description: {
    type: String,

  },
  numSearches: {
    type: Number,

  },
  destinationPics: {
    type: [String],

  },
  coordinates: {
    type: String,
  }
  
},
{
  timestamps: true
  
});

module.exports = model('CityOverview', cityOverviewSchema);
