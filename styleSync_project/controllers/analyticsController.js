const Clothes = require('../models/clothesModel');

exports.wardrobeAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    // Frequently worn items: wearCount >= 7
    const mostUsed = await Clothes.find({ wearCount: { $gte: 7 } });

    // Least used items: wearCount <= 2 OR lastWorn more than 1 year ago (or never worn)
    const leastUsed = await Clothes.find({
      $or: [
        { wearCount: { $lte: 2 } },
        { lastWorn: { $lte: oneYearAgo } },
        { lastWorn: { $exists: false } },
      ],
      status: 'active', // only suggest donation for active items
    });

    // Suggest donation: update status to 'donated' suggestion (we flag but don't delete)
    // Per spec: "suggests donation for underutilized items without deleting them"
    // We return them with a donationSuggested flag rather than modifying the DB
    const donationSuggestions = leastUsed.map(item => ({
      ...item.toObject(),
      donationSuggested: true,
      reason:
        item.wearCount <= 2
          ? `Low wear count (${item.wearCount} times)`
          : `Not worn since ${item.lastWorn ? item.lastWorn.toDateString() : 'never'}`,
    }));

    res.status(200).json({
      summary: {
        totalClothes: await Clothes.countDocuments(),
        mostUsedCount: mostUsed.length,
        leastUsedCount: leastUsed.length,
        donationSuggestionsCount: donationSuggestions.length,
      },
      mostUsed,
      leastUsed: donationSuggestions,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
