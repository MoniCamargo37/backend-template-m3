const mongoose = require('mongoose');
const { Schema } = mongoose;

const tripSchema = new Schema({
  name: {
    type: String,
  },
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
    required: true,
    min: 1,
  },
  monthOfTrip: {
    type: String,
    required: true
  },

  tripType: {
    type: String,
    enum: ['aventurero', 'relajado', 'romantico', 'familiar']
  },
  budget: {
    type: Number,
    required: true,
    validate: {
      validator: function(value) {
        return value >= 100 && value <= 10000;
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
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
},
{
  timestamps: true
  
});

module.exports = mongoose.model('Trip', tripSchema);

