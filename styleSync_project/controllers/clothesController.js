const Clothes = require('../models/clothesModel');
const cloudinary = require('../config/cloudinary');

exports.addClothes = async (req, res) => {
  try {
    const { name, category, color, season, occasion, wearCount, lastWorn, status } = req.body;

    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'stylesync/clothes', resource_type: 'image' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        images.push({ url: result.secure_url, public_id: result.public_id });
      }
    }

    const clothes = new Clothes({
      name,
      category,
      color,
      season: Array.isArray(season) ? season : season ? [season] : [],
      occasion: Array.isArray(occasion) ? occasion : occasion ? [occasion] : [],
      images,
      wearCount: wearCount || 0,
      lastWorn,
      status: status || 'active',
    });

    await clothes.save();
    res.status(201).json(clothes);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
