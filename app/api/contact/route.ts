import { NextRequest, NextResponse } from "next/server";
import { saveContactMessage } from "@/sanity/helpers";
import { sendContactEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // ========================
    // VALIDATION
    // ========================
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // ========================
    // CLIENT INFO
    // ========================
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const userAgent = request.headers.get("user-agent") || "unknown";

    // ========================
    // 1. SAVE TO SANITY
    // ========================
    const result = await saveContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      ipAddress,
      userAgent,
    });

    if (!result.success) {
      console.error("Sanity save failed:", result.error);

      return NextResponse.json(
        { error: "Failed to save contact message" },
        { status: 500 }
      );
    }

    // ========================
    // 2. SEND EMAIL (NEW ADD)
    // ========================
    const emailResult = await sendContactEmail({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    if (!emailResult.success) {
      console.error("Email send failed:", emailResult.error);
      // email fail হলেও user কে success দেখাবো (optional)
    }

    // ========================
    // SUCCESS RESPONSE
    // ========================
    return NextResponse.json(
      {
        message:
          "Message sent successfully! We'll get back to you soon.",
        id: result.data?._id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API Error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}