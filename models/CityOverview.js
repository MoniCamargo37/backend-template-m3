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
  country: {
    type: String,
    // required: true
  },
  description: {
    type: String,
    // required: true
  },
  numSearches: {
    type: Number,
    // required: true
  },
  destinationPics: {
    type: [String],
    // required: true
  }
},
{
  timestamps: true
  
});

module.exports = model('CityOverview', cityOverviewSchema);
