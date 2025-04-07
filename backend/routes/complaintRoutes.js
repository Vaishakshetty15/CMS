const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Complaint = require('../models/Complaint');
const upload = require('../middleware/upload');

// 1. Create Complaint (with file upload)
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

// 2. Get All Complaints (admin only)
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

// 3. Assign Complaint to Admin
router.put('/:id/assign', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    if (!req.body.adminId || !req.body.hours) {
      return res.status(400).json({ error: 'adminId and hours are required' });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { 
        assignedTo: req.body.adminId,
        status: 'in-progress',
        deadline: new Date(Date.now() + req.body.hours * 60 * 60 * 1000)
      },
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Reopen Complaint
router.put('/:id/reopen', auth, async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      _id: req.params.id,
      customerId: req.user.id
    });

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    
    if (complaint.status === 'resolved') {
      complaint.status = 'reopened';
      complaint.deadline = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await complaint.save();
      return res.json(complaint);
    }

    res.status(400).json({ 
      error: 'Only resolved complaints can be reopened',
      currentStatus: complaint.status 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;