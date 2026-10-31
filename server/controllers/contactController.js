import mongoose from "mongoose";
import nodemailer from "nodemailer";
import Message from "../models/Message.js";
import Profile from "../models/Profile.js";

export const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        message: "Please fill in all required fields (name, email, message).",
      });
    }

    // Always store message in database
    const savedMessage = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: (subject || "Portfolio Contact Message").trim(),
      message: message.trim(),
    });

    // Determine target recipient
    const profile = await Profile.findOne();
    const recipientEmail =
      process.env.ADMIN_EMAIL ||
      profile?.email ||
      "amanchaurasiya7565@gmail.com";

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpUser = process.env.EMAIL_USER || process.env.SMTP_USER;
    const smtpPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
    const smtpPort = Number(process.env.SMTP_PORT) || 587;

    let emailSent = false;

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        await transporter.sendMail({
          from: `"${name}" <${smtpUser}>`,
          replyTo: email,
          to: recipientEmail,
          subject: subject ? `Portfolio Contact: ${subject}` : `New message from ${name}`,
          text: `New message received from your portfolio:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject || "N/A"}\n\nMessage:\n${message}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <div style="border-bottom: 2px solid #6366f1; padding-bottom: 12px; margin-bottom: 20px;">
                <h2 style="color: #0f172a; margin: 0; font-size: 20px;">New Portfolio Contact Message</h2>
              </div>
              <p style="margin: 8px 0; color: #334155;"><strong>From:</strong> ${name}</p>
              <p style="margin: 8px 0; color: #334155;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #6366f1;">${email}</a></p>
              <p style="margin: 8px 0; color: #334155;"><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
              <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #6366f1;">
                <p style="margin: 0; color: #1e293b; white-space: pre-wrap; font-size: 15px; line-height: 1.6;">${message}</p>
              </div>
              <p style="margin-top: 25px; font-size: 12px; color: #94a3b8; text-align: center;">Sent via your Portfolio Contact Form</p>
            </div>
          `,
        });
        emailSent = true;
      } catch (mailError) {
        console.error("Nodemailer failed to dispatch email:", mailError.message);
      }
    } else {
      console.log(`[Contact Form Received] From: ${name} (${email}) | Subject: ${subject}`);
    }

    return res.status(200).json({
      success: true,
      message: "Your message has been sent successfully! I will get back to you soon.",
      emailSent,
      data: savedMessage,
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return res.status(500).json({
      message: "An error occurred while submitting your message. Please try again.",
      error: error.message,
    });
  }
};

export const getContactMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages", error: error.message });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }
    const deleted = await Message.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Message not found or already deleted" });
    }
    return res.json({ success: true, message: "Message deleted successfully", id });
  } catch (error) {
    console.error("Failed to delete message:", error);
    return res.status(500).json({ message: "Failed to delete message", error: error.message });
  }
};

