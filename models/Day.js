const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const daySchema = new Schema([
  {
    name: {
      type: String
    },
    activities: [{
      name: String,
      description: String,
      duration: String
    }]
  }
]);

module.exports = model("Day", daySchema);
