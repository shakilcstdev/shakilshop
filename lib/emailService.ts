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
      pass: process.env.EMAIL_PASSWORD,
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
// GENERATE ORDER EMAIL HTML
// ========================
const generateOrderHTML = (data: OrderConfirmationData): string => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
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

      <p><strong>Subtotal:</strong> $${data.subtotal}</p>
      <p><strong>Shipping:</strong> $${data.shipping}</p>
      <p><strong>Tax:</strong> $${data.tax}</p>
      <p><strong>Total:</strong> $${data.total}</p>

      <h3>Shipping Address</h3>
      <p>
        ${data.shippingAddress.name}<br/>
        ${data.shippingAddress.street}<br/>
        ${data.shippingAddress.city}, ${data.shippingAddress.state}
        ${data.shippingAddress.zipCode}<br/>
        ${data.shippingAddress.country}
      </p>

      ${
        data.estimatedDelivery
          ? `<p>Estimated delivery: ${data.estimatedDelivery}</p>`
          : ""
      }

      <p>We will update you once your order ships.</p>
    </div>
  `;
};

// ========================
// SEND ORDER CONFIRMATION EMAIL
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
    console.error("Order Email Error:", error);

    return {
      success: false,
      error: "Failed to send order confirmation email",
    };
  }
};

// ========================
// SEND CONTACT FORM EMAIL
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
      to: process.env.SENDER_EMAIL_ADDRESS,
      replyTo: data.email,
      subject: `Contact: ${data.subject}`,
      text: `Name: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\nMessage: ${data.message}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong><br/>${data.message}</p>
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
      error: "Failed to send contact message",
    };
  }
};

// ========================
// SEND NEWSLETTER EMAIL
// ========================
export const sendMail = async (data: {
  email: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<EmailResponse> => {
  try {
    const mail = await transporter.sendMail({
      from: `"ShakilShop" <${process.env.SENDER_EMAIL_ADDRESS}>`,
      to: data.email,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });

    return {
      success: true,
      messageId: mail.messageId,
    };
  } catch (error) {
    console.error("Newsletter Email Error:", error);

    return {
      success: false,
      error: "Failed to send newsletter email",
    };
  }
};