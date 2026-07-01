const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 📬 EMAIL CONFIGURATION (YOUR APPS POSTMAN)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Aapka Gmail ID
    pass: process.env.EMAIL_PASS  // Aapka Gmail App Password
  }
});

// 🚀 ENQUIRY MAIL ROUTE NODE
app.post('/api/enquiry', async (req, res) => {
  const { name, email, phone, message } = req.body;

  // 🏢 1. Email Layout Design for Admin (Aapko jo receive ho raha hai)
  const mailToAdmin = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Direct aapke paas lead jayegi
    subject: `🔥 New DanceMudra Enquiry from ${name}`,
    html: `
      <div style="background-color: #040810; padding: 20px; font-family: sans-serif; border-radius: 15px; color: #ffffff; max-width: 600px;">
        <h2 style="color: #c084fc;">NEW LEAD CAPTURED</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Message/Query:</b> ${message}</p>
      </div>
    `
  };

  // 👤 2. Email Layout Design for User (Jo form bharne wale ke paas jayega)
  const mailToUser = {
    from: process.env.EMAIL_USER,
    to: email, // Yeh user ka email id hai jo usne form mein bhara!
    subject: `🎉 We Received Your Query! - DanceMudra`,
    html: `
      <div style="background-color: #040810; padding: 30px; font-family: sans-serif; border-radius: 20px; color: #ffffff; max-width: 600px; text-align: center;">
        <h2 style="color: #c084fc; margin-bottom: 5px;">Hi ${name},</h2>
        <h3 style="color: #f472b6; font-weight: normal; margin-top: 0;">Welcome to the DanceMudra Ecosystem! 💃✨</h3>
        <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;" />
        <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; text-align: left;">
          We have successfully received your request for <b>"${message}"</b>. Our elite management team or the designated creator node is processing your timeline right now. 
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; text-align: left; margin-bottom: 25px;">
          We will get in touch with you shortly over your registered contact number <b>${phone}</b>. Get ready to step onto the practice floor!
        </p>
        <div style="background: rgba(192, 132, 252, 0.1); border: 1px solid rgba(192, 132, 252, 0.2); padding: 15px; border-radius: 12px; font-size: 12px; color: #a78bfa;">
          🤝 Parallel Cloud Synchronization Active.
        </div>
        <p style="font-size: 11px; color: #64748b; margin-top: 30px;">© 2026 DANCEMUDRA. All rights reserved.</p>
      </div>
    `
  };

  try {
    // 🔥 DONO MAILS KO PARALLEL FIRE KARO
    await transporter.sendMail(mailToAdmin);
    await transporter.sendMail(mailToUser);

    console.log("🚀 Dual Email System Dispatched (Admin + User Sync)!");
    res.status(200).json({ success: true, message: "Enquiry logged and dual mails fired!" });
  } catch (error) {
    console.error("❌ NodeMailer Mail Delivery Pipeline Crash:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Custom DanceMudra Server active on port ${PORT}`));