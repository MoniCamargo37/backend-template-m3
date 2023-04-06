const router = require('express').Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const multer = require("multer");
const { isAuthenticated, isAdmin } = require('../middlewares/jwt');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/profile');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  })
}).single('photo');


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
// @route   PUT /profile/cambiar-contrasena
// @access  Private

router.put("/cambiar-contrasena", isAuthenticated, async (req, res, next) => {
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
  if (!passwordRegex.test(newPassword)) {
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
router.put('/editar-foto', isAuthenticated, async (req, res, next) => {
  try {
    const { _id } = req.payload;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (req.file) {
        user.imageUrl = req.file.filename;
        const updatedUser = await user.save();
        return res.status(200).json({ message: 'Image updated', user: updatedUser });
      } else {
        return res.status(400).json({ message: 'No file was uploaded' });
      }
    });
  } catch (error) {
    next(error);
  }
});




// @desc    This route allows the user to delete their profile picture.
// @route   DELETE /profile/deletePhoto
// @access  Private
router.delete("/profile/borrar-foto", isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.userId);

    // Verificar si la imagen personalizada está presente
    if (user.imageUrl !== "https://media.vogue.mx/photos/62e19b3d4a4bcdd2c09a7c1b/2:3/w_1920,c_limit/GettyImages-1155131913-2.jpg") {
      // Si la imagen personalizada está presente, eliminarla
      user.imageUrl = undefined;
    } else {
      // Si la imagen personalizada no está presente, eliminar la imagen por defecto
      user.imageUrl = "https://media.vogue.mx/photos/62e19b3d4a4bcdd2c09a7c1b/2:3/w_1920,c_limit/GettyImages-1155131913-2.jpg";
    }

    await user.save();

    res.status(200).json({ message: "Image URL deleted" });
  } catch (error) {
    next(error);
  }
});


module.exports = router;