const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const { isAuthenticated,
  isAdmin } = require("../middlewares/jwt");

// @desc    is responsible for getting the user's profile page.
// @route   GET /profile
// @access  Private
router.get("/", isAuthenticated, async (req, res, next)=> {
  const { _id } = req.payload;
  try {
    const user = await User.findById(_id);
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
});


// @desc    This route allows a user to change their password.
// @route   PUT /profile/edit
// @access  Private

router.put("/cambiar-contraseña", isAuthenticated, async (req, res, next) => {
  const { _id: userId } = req.payload;
  const { currentPassword, newPassword, newPasswordConfirmation } = req.body;
  if (!currentPassword || !newPassword || !newPasswordConfirmation) {
    res.status(400).json({
      message: "Por favor, escriba su nueva contraseña.",
    });
    return;
  }
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({
      message: "No se ha encontrado al usuario.",
    });
  }
  const match = await bcrypt.compare(currentPassword, user.hashedPassword);
  if (!match) {
    res.status(400).json({message: "Tu antigua contraseña no coincide."});
  }
  if (newPassword !== newPasswordConfirmation) {
    res.status(400).json({
      message:
        "La contraseña de confirmación no coincide con la nueva introducida..",
    });
    return;
  }
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res
      .status(400)
      .json({
        message:
        "La contraseña debe tener al menos 6 caracteres y contener como mínimo un número, una minúscula y una mayúscula.",
      });
    return;
  }
  try {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedNewPassword = bcrypt.hashSync(newPassword, salt);
    await User.findByIdAndUpdate(
      userId,
      { hashedPassword: hashedNewPassword },
      {
        new: true,
      }
    );
    res.status(204).json({ message: "La contraseña se ha actualizado correctamente." });
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
  }
});

// @desc    This route allows the user to edit their profile picture.
// @route   PUT /profile/editPhoto
// @access  Private
router.put(
  "/editPhoto",
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
  "/deletePhoto",
  isAuthenticated,
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