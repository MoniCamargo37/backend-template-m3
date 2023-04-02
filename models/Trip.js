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
    required: true,
    validate: {
      validator: function(value) {
        return value >= 200 && value <= 10000;
      },
      message: 'El presupuesto debe estar entre 200 y 10000 euros.'
    }
  },
  days: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Day'
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

