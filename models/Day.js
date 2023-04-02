const mongoose = require('mongoose');
const Activity = require('./Activity');
const { Schema, model } = mongoose;

const daySchema = new Schema([
  {
    name: {
      type: String
    },
    activities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
        required: true
    }],
  },
]);

module.exports = model("Day", daySchema);
