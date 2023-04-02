const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const activitySchema = new Schema([
  {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
        },
        duration: {
            type: String,
            required: true
        }
    },
]);

module.exports = model("Activity", activitySchema);
