import nodemailer from "nodemailer";

// Transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Contact Email function
export const sendContactEmail = async ({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  try {
    const mailOptions = {
      from: `"ShakilShop Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // admin email
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b><br/>${message}</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error: any) {
    console.error("Email send error:", error);
    return {
      success: false,
      error: error.message || "Email sending failed",
    };
  }
};

// Generic mail function (newsletter etc.)
export const sendMail = async ({
  email,
  subject,
  text,
  html,
}: {
  email: string;
  subject: string;
  text: string;
  html?: string;
}) => {
  try {
    const result = await transporter.sendMail({
      from: `"ShakilShop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      text,
      html,
    });

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error: any) {
    console.error("Mail error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};