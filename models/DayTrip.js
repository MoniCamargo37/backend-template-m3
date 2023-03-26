const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const dayTripSchema = new Schema({
  activity1: {
    type: String,
    required: true
  },
  activity2: {
    type: String,
    required: true
  },
  activity3: {
    type: String,
    required: true
  },
  restaurants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant'
    }
  ]
});

module.exports = model('DayTrip', dayTripSchema);
