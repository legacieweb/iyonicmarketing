require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 📩 Handle Contact Form Submission
app.post("/send-email", async (req, res) => {
    const { name, email, phone, business, message } = req.body;

    // 📧 Email Transporter Setup
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // Your email
            pass: process.env.EMAIL_PASS, // App password (not your real password)
        },
    });

    // ✉️ Email to Admin
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL, // Admin email
        subject: "New Contact Form Submission 🚀",
        html: `
            <h2>New Contact Inquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Business:</strong> ${business}</p>
            <p><strong>Message:</strong> ${message}</p>
        `,
    };

    // ✉️ Confirmation Email to User
    const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Thank You for Contacting Iyonic Marketing!",
        html: `
            <h2>Hello ${name},</h2>
            <p>Thank you for reaching out to us at <strong>Iyonic Marketing</strong>! Our team will get back to you within 24 hours.</p>
            <h3>Your Submitted Details:</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Business:</strong> ${business}</p>
            <p><strong>Message:</strong> ${message}</p>
            <p>Looking forward to working with you!</p>
        `,
    };

    try {
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);
        res.status(200).json({ message: "Emails sent successfully!" });
    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ message: "Failed to send emails." });
    }
});

// 🌍 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
