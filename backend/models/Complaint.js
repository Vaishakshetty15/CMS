const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  customerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  category: { 
    type: String, 
    enum: ['product', 'service', 'general'], 
    required: true 
  },
  description: { type: String, required: true },
  attachments: [{ type: String }],
  status: { 
    type: String, 
    enum: ['open', 'in-progress', 'resolved', 'reopened', 'escalated'], 
    default: 'open' 
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'low' 
  },
  resolutionNotes: String,
  // Escalation-related fields
  escalationLevel: { type: Number, default: 0 },
  deadline: { type: Date },
  escalationHistory: [{
    escalatedAt: { type: Date, default: Date.now },
    escalatedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    level: Number
  }],
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);