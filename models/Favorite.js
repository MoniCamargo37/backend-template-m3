const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const favoriteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CityOverview',
    required: true
  }
});

const Favorite = model('Favorite', favoriteSchema);

module.exports = Favorite;