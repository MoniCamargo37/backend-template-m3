const mongoose = require('mongoose');
const { Schema } = mongoose;

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

  tripType: {
    type: String,
    enum: ['con amigos', 'con niños', 'en pareja', 'para mayores']
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
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  weather: {
    type: String,
    // required: true
  }
});

module.exports = mongoose.model('Trip', tripSchema);

