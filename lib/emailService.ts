import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

// ========================
// TRANSPORTER CONFIG
// ========================
const transporter: Transporter<SMTPTransport.SentMessageInfo> =
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SENDER_EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD, // Gmail App Password
    },
  });

// ========================
// TYPES
// ========================
interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderConfirmationData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  orderDate: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  estimatedDelivery?: string;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ========================
// GENERATE HTML (ORDER EMAIL)
// ========================
const generateOrderHTML = (data: OrderConfirmationData) => {
  return `
  <div style="font-family: Arial; padding:20px;">
    <h2>Order Confirmed - ${data.orderId}</h2>
    <p>Hello ${data.customerName},</p>

    <p>Thank you for your order!</p>

    <h3>Order Summary</h3>
    <ul>
      ${data.items
        .map(
          (item) =>
            `<li>${item.name} - ${item.quantity} x $${item.price}</li>`
        )
        .join("")}
    </ul>

    <p><b>Total:</b> $${data.total}</p>

    <h3>Shipping Address</h3>
    <p>
      ${data.shippingAddress.name}<br/>
      ${data.shippingAddress.street}<br/>
      ${data.shippingAddress.city}, ${data.shippingAddress.state}<br/>
      ${data.shippingAddress.country}
    </p>

    <p>We will update you once shipped.</p>
  </div>
  `;
};

// ========================
// SEND ORDER EMAIL
// ========================
export const sendOrderConfirmationEmail = async (
  data: OrderConfirmationData
): Promise<EmailResponse> => {
  try {
    const mail = await transporter.sendMail({
      from: `"ShakilShop" <${process.env.SENDER_EMAIL_ADDRESS}>`,
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.orderId}`,
      html: generateOrderHTML(data),
    });

    return {
      success: true,
      messageId: mail.messageId,
    };
  } catch (error) {
    console.error("Email Error:", error);
    return {
      success: false,
      error: "Failed to send email",
    };
  }
};

// ========================
// CONTACT FORM EMAIL
// ========================
export const sendContactEmail = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<EmailResponse> => {
  try {
    const mail = await transporter.sendMail({
      from: `"Contact Form" <${process.env.SENDER_EMAIL_ADDRESS}>`,
      to: process.env.SENDER_EMAIL_ADDRESS, // তোমার Gmail এ যাবে
      subject: `Contact: ${data.subject}`,
      html: `
        <h3>New Contact Message</h3>
        <p><b>Name:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Subject:</b> ${data.subject}</p>
        <p><b>Message:</b><br/>${data.message}</p>
      `,
    });

    return {
      success: true,
      messageId: mail.messageId,
    };
  } catch (error) {
    console.error("Contact Email Error:", error);
    return {
      success: false,
      error: "Failed to send message",
    };
  }
};