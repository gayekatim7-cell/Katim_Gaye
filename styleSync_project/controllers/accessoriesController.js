const Accessories = require('../models/accessoriesModel');
const cloudinary = require('../config/cloudinary');

exports.addAccessory = async (req, res) => {
  try {
    const { name, type, color, compatibleWith, wearCount, lastWorn, status } = req.body;

    let image = {};
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'stylesync/accessories', resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      image = { url: result.secure_url, public_id: result.public_id };
    }

    const accessory = new Accessories({
      name,
      type,
      color,
      compatibleWith: Array.isArray(compatibleWith)
        ? compatibleWith
        : compatibleWith ? [compatibleWith] : [],
      image,
      wearCount: wearCount || 0,
      lastWorn,
      status: status || 'active',
    });

    await accessory.save();
    res.status(201).json(accessory);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
