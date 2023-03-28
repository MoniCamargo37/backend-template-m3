const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const tripSchema = new Schema({
  city: {
    type: String,
    required: true
  },
  tripDuration: {
    type: Number,
    required: true,
    min: 1,
    max: 7
  },
  numTravellers: {
    type: Number,
    required: true
  },
  monthOfTrip: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    // required: true
  },
  endDate: {
    type: Date,
    // required: true
  },
  tripType: {
    type: String,
    enum: ['amigos', 'niños', 'pareja', 'mayores']
  },
  budget: {
    type: Number,
    required: true
  },
  dayTrip: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DayTrip'
    }
  ],
  cityOverview: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CityOverview'
    }
  ],
  weather: {
    type: String,
    // required: true
  }
});

module.exports = model('Trip', tripSchema);
