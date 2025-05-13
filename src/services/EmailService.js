// src/services/EmailService.js
import nodemailer from 'nodemailer';

export const sendEmail = async (recipientEmail, pdfFilePath) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service
    auth: {
      user: 'your-email@gmail.com', // Your email
      pass: 'your-email-password', // Your email password
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com',
    to: recipientEmail,
    subject: 'Your Assessment Report',
    text: 'Please find your assessment report attached.',
    attachments: [
      {
        path: pdfFilePath,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};