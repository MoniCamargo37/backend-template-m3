const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { isLoggedIn } = require('../middlewares/jwt');

// @desc    is responsible for displaying the user's profile page.
// @route   GET /profile
// @access  Private
router.get("/profile", isLoggedIn, async function (req, res, next) {
  try {
    const user = await User.findById(req.payload.userId);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
});

// @desc    is responsible for displaying the user's profile editing page.
// @route   GET /profile/edit
// @access  Private
router.get("/profile/edit",isLoggedIn, (req, res, next) => {
  const user = req.payload;
  res.status(200).json({ user });
});

// @desc    This route allows a user to change their password.
// @route   PUT /profile/edit
// @access  Private
router.put("/profile/edit", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.userId);
    const { currentPassword, newPassword } = req.body;
    const passwordMatch = await user.comparePassword(currentPassword);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    user.password = newPassword;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});

// @desc    is responsible for displaying the user's profile editing page.
// @route   GET /profile/editPhoto
// @access  Private
router.get("/profile/editPhoto", isLoggedIn, function (req, res, next) {
  const user = req.payload;
  res.status(200).json({ user });
});

// @desc    This route allows the user to edit their profile picture.
// @route   PUT /profile/editPhoto
// @access  Private
router.put(
  "/profile/editPhoto",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.payload.userId);

      if (!req.file) {
        return res.status(400).json({ message: "Please upload a file" });
      }

      user.avatar = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
      await user.save();

      res.status(200).json({ message: "Avatar updated" });
    } catch (error) {
      next(error);
    }
  }
);

// @desc    This route allows the user to delete their profile picture.
// @route   DELETE /user/profile/deletePhoto
// @access  Private
router.delete(
  "/profile/deletePhoto",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.payload.userId);
      user.avatar = undefined;
      await user.save();
      res.status(200).json({ message: "Avatar deleted" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;