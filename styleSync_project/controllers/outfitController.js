const Outfit = require('../models/outfitModel');
const Clothes = require('../models/clothesModel');
const Accessories = require('../models/accessoriesModel');
const Laundry = require('../models/laundryModel');
const Weather = require('../models/weatherModel');
const cloudinary = require('../config/cloudinary');

// Helper: upload a single buffer to cloudinary
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// Weather to season mapping
const weatherSeasonMap = {
  sunny: ['spring', 'summer'],
  hot: ['summer'],
  cold: ['winter', 'fall', 'autumn'],
  rainy: ['spring', 'fall', 'autumn'],
  cloudy: ['spring', 'fall', 'autumn', 'winter'],
};

// POST /api/outfits - Manually add an outfit
exports.addOutfit = async (req, res) => {
  try {
    const { name, clothingItems, accessories, weatherCondition } = req.body;

    let outfitImages = {};
    if (req.files && req.files.length > 0) {
      const result = await uploadToCloudinary(req.files[0].buffer, 'stylesync/outfits');
      outfitImages = { url: result.secure_url, public_id: result.public_id };
    }

    const outfit = new Outfit({
      name,
      clothingItems: Array.isArray(clothingItems) ? clothingItems : clothingItems ? [clothingItems] : [],
      accessories: Array.isArray(accessories) ? accessories : accessories ? [accessories] : [],
      weatherCondition,
      outfitImages,
    });

    await outfit.save();
    res.status(201).json(outfit);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// POST /api/outfits/generate - Smart outfit generation
exports.generateOutfit = async (req, res) => {
  try {
    const { location, occasion, name } = req.body;

    // 1. Get latest weather for user's location
    const weather = await Weather.findOne({ location }).sort({ date: -1 });
    if (!weather) {
      return res.status(404).json({ message: `No weather data found for location: ${location}` });
    }

    const weatherCondition = weather.conditions;
    const relevantSeasons = weatherSeasonMap[weatherCondition] || [];

    // 2. Find clothes currently in laundry (not done)
    const laundryRecords = await Laundry.find({ status: { $ne: 'done' } });
    const inLaundryIds = laundryRecords.flatMap(l => l.items.map(id => id.toString()));

    // 3. Filter available clothes: active, not donated, not in laundry, matching season/occasion
    const clothesQuery = {
      status: 'active',
      _id: { $nin: inLaundryIds },
    };
    if (relevantSeasons.length > 0) {
      clothesQuery.season = { $in: relevantSeasons };
    }
    if (occasion) {
      clothesQuery.occasion = occasion;
    }

    const availableClothes = await Clothes.find(clothesQuery);

    if (availableClothes.length === 0) {
      return res.status(404).json({ message: 'No suitable clothing items found for current weather and occasion' });
    }

    // 4. Select one item per category (top, bottom, dress/suit)
    const selectedClothes = [];
    const usedCategories = new Set();
    for (const item of availableClothes) {
      if (!usedCategories.has(item.category)) {
        selectedClothes.push(item);
        usedCategories.add(item.category);
      }
    }

    // 5. Find compatible accessories
    const selectedCategories = selectedClothes.map(c => c.category);
    const availableAccessories = await Accessories.find({
      status: 'active',
      compatibleWith: { $in: selectedCategories },
    });

    // 6. Handle outfit image upload if provided
    let outfitImages = {};
    if (req.files && req.files.length > 0) {
      const result = await uploadToCloudinary(req.files[0].buffer, 'stylesync/outfits');
      outfitImages = { url: result.secure_url, public_id: result.public_id };
    }

    // 7. Create the outfit
    const outfit = new Outfit({
      name: name || `Auto-generated outfit for ${weatherCondition} weather`,
      clothingItems: selectedClothes.map(c => c._id),
      accessories: availableAccessories.map(a => a._id),
      weatherCondition,
      outfitImages,
      wearCount: 1,
    });

    await outfit.save();

    // 8. Update wear counts for selected clothes and accessories
    const now = new Date();
    await Clothes.updateMany(
      { _id: { $in: selectedClothes.map(c => c._id) } },
      { $inc: { wearCount: 1 }, $set: { lastWorn: now } }
    );
    await Accessories.updateMany(
      { _id: { $in: availableAccessories.map(a => a._id) } },
      { $inc: { wearCount: 1 }, $set: { lastWorn: now } }
    );

    // Return populated outfit
    const populatedOutfit = await Outfit.findById(outfit._id)
      .populate('clothingItems')
      .populate('accessories');

    res.status(201).json({
      message: 'Outfit generated successfully',
      weatherCondition,
      outfit: populatedOutfit,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// GET /api/outfits - Get all outfits
exports.getAllOutfits = async (req, res) => {
  try {
    const outfits = await Outfit.find().populate('clothingItems').populate('accessories');
    res.status(200).json(outfits);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// GET /api/outfits/:id - Get outfit by ID
exports.getOutfitById = async (req, res) => {
  try {
    const outfit = await Outfit.findById(req.params.id)
      .populate('clothingItems')
      .populate('accessories');
    if (!outfit) return res.status(404).json({ message: 'Outfit not found' });
    res.status(200).json(outfit);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// PATCH /api/outfits/:id - Modify outfit by ID
exports.modifyOutfitById = async (req, res) => {
  try {
    const { name, clothingItems, accessories, weatherCondition } = req.body;

    const outfit = await Outfit.findById(req.params.id);
    if (!outfit) return res.status(404).json({ message: 'Outfit not found' });

    if (name) outfit.name = name;
    if (weatherCondition) outfit.weatherCondition = weatherCondition;
    if (clothingItems)
      outfit.clothingItems = Array.isArray(clothingItems) ? clothingItems : [clothingItems];
    if (accessories)
      outfit.accessories = Array.isArray(accessories) ? accessories : [accessories];

    await outfit.save();
    res.status(200).json(outfit);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
