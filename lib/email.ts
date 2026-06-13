import nodemailer from "nodemailer";

interface ContactEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendContactEmail = async (data: ContactEmailParams) => {
  try {
    const mailOptions = {
      from: `"ShakilShop Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: `📩 New Contact: ${data.subject}`,
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>New Contact Message</h2>

          <p><b>Name:</b> ${data.name}</p>
          <p><b>Email:</b> ${data.email}</p>
          <p><b>Subject:</b> ${data.subject}</p>

          <hr />

          <p><b>Message:</b></p>
          <p>${data.message}</p>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error("Email error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Email failed",
    };
  }
};