const mongoose = require('mongoose');
const { Schema, model } = mongoose;
//BACKLOG
const favoriteSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
 
  cityOverview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CityOverview',
  },
},
{
  timestamps: true
  
});

const Favorite = model('Favorite', favoriteSchema);

module.exports = Favorite;

