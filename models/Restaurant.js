const mongoose = require('mongoose');
const { Schema, model } = mongoose;
//BACLOG
const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  foodType: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  }

},
{
  timestamps: true
  
});

module.exports = model('Restaurant', restaurantSchema);
