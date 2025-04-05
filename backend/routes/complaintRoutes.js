const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Complaint = require('../models/Complaint');
const upload = require('../middleware/upload');

// Create Complaint (with file upload)
router.post('/', auth, upload.array('attachments', 5), async (req, res) => {
  try {
    const { category, description, priority } = req.body;
    
    const newComplaint = new Complaint({
      customerId: req.user.id,
      category,
      description,
      priority,
      attachments: req.files?.map(file => file.path) || []
    });

    await newComplaint.save();
    res.status(201).json(newComplaint);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Complaints (for admin)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const complaints = await Complaint.find()
      .populate('customerId', 'name email')
      .populate('assignedTo', 'name email');

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;