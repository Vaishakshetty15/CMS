const cron = require('node-cron');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { sendEscalationEmail } = require('../services/emailService'); // ✅ Import the function

// Run every minute to check deadlines
cron.schedule('* * * * *', async () => {
  try {
    const overdueComplaints = await Complaint.find({
      status: { $in: ['open', 'in-progress'] },
      deadline: { $lt: new Date() }
    }).populate('assignedTo');

    for (const complaint of overdueComplaints) {
      const admins = await User.find({ role: 'admin' });

      // Escalate to next available admin
      const nextAdmin = admins[complaint.escalationLevel % admins.length];

      complaint.escalationHistory.push({
        escalatedAt: new Date(),
        escalatedTo: nextAdmin._id,
        level: complaint.escalationLevel + 1
      });

      complaint.assignedTo = nextAdmin._id;
      complaint.escalationLevel += 1;
      complaint.deadline = new Date(Date.now() + 24 * 60 * 60 * 1000); // +24hrs
      await complaint.save();

      // ✅ Send escalation email
      const updatedAdmin = await User.findById(nextAdmin._id);
      await sendEscalationEmail(updatedAdmin.email, complaint._id);
    }
  } catch (err) {
    console.error('Escalation error:', err);
  }
});
