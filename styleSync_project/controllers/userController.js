const User = require('../models/userModel');
const cloudinary = require('../config/cloudinary');

exports.createUser = async (req, res) => {
  try {
    const { name, location, stylePreferences } = req.body;

    let profilePicture = {};
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'stylesync/users', resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      profilePicture = { url: result.secure_url, public_id: result.public_id };
    }

    const user = new User({
      name,
      location,
      stylePreferences: Array.isArray(stylePreferences)
        ? stylePreferences
        : stylePreferences ? [stylePreferences] : [],
      profilePicture,
    });

    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
