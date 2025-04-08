// backend/services/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendAssignmentEmail = async (userEmail, complaintId) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'New Complaint Assignment',
    html: `<p>You've been assigned to complaint #${complaintId}. Please resolve it before the deadline.</p>`
  };

  await transporter.sendMail(mailOptions);
};

const sendEscalationEmail = async (adminEmail, complaintId) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: 'Complaint Escalation',
    html: `<p>Complaint #${complaintId} has been escalated to you. Immediate action required.</p>`
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendAssignmentEmail, sendEscalationEmail };