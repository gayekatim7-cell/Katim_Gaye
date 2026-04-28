const Laundry = require('../models/laundryModel');

exports.addLaundry = async (req, res) => {
  try {
    const { items, status, scheduledDate } = req.body;

    const laundry = new Laundry({
      items: Array.isArray(items) ? items : items ? [items] : [],
      status: status || 'pending',
      scheduledDate,
    });

    await laundry.save();
    res.status(201).json(laundry);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.updateLaundry = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, scheduledDate, items } = req.body;

    const laundry = await Laundry.findById(id);
    if (!laundry) return res.status(404).json({ message: 'Laundry record not found' });

    if (status) laundry.status = status;
    if (scheduledDate) laundry.scheduledDate = scheduledDate;
    if (items) laundry.items = Array.isArray(items) ? items : [items];

    await laundry.save();
    res.status(200).json(laundry);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.getAllLaundry = async (req, res) => {
  try {
    const laundry = await Laundry.find().populate('items').sort({ createdAt: -1 });
    res.status(200).json(laundry);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};
