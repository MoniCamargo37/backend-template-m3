const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: true
    },
    username: {
      type: String,
      trim: true,
      required: [true, "El nombre de usuario es obligatorio."],
      unique: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    imageUrl: {
      type: String,
      default:
        "https://media.vogue.mx/photos/62e19b3d4a4bcdd2c09a7c1b/2:3/w_1920,c_limit/GettyImages-1155131913-2.jpg",
    },
    password: {
      type: String,
    },
    trips: [{
      type: Schema.Types.ObjectId,
      ref: 'Trip',
    }],
    favorites: [{
      type: Schema.Types.ObjectId,
      ref: 'Favorite'
    }],
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;