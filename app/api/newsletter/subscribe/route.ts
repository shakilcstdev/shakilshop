
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/emailService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email =
      typeof body.email === "string"
        ? body.email.trim()
        : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const result = await sendMail({
      email,
      subject: "Welcome to ShakilShop Newsletter",
      text: "Thank you for subscribing to the ShakilShop newsletter!",
      html: `
        <h2>Welcome to ShakilShop!</h2>
        <p>Thank you for subscribing to our newsletter.</p>
      `,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Unable to send the email." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to the newsletter.",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
