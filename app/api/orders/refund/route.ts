
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { writeClient, client } from "@/sanity/lib/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-05-27.dahlia",
});

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const orderId = body?.orderId;

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { error: "Valid order ID is required" },
        { status: 400 }
      );
    }

    // Fetch the order
    const order = await client.fetch(
      `*[_type == "order" && _id == $orderId][0]{
        _id,
        orderNumber,
        totalPrice,
        paymentMethod,
        paymentStatus,
        status,
        stripePaymentIntentId,
        clerkUserId,
        customerName,
        email
      }`,
      { orderId }
    );

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Verify order ownership
    if (order.clerkUserId !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Prevent duplicate cancellation
    if (order.status === "cancelled") {
      return NextResponse.json(
        { error: "Order is already cancelled" },
        { status: 400 }
      );
    }

    // Delivered orders cannot be cancelled
    if (["delivered", "completed"].includes(order.status)) {
      return NextResponse.json(
        {
          error: "Cannot cancel delivered or completed orders",
        },
        { status: 400 }
      );
    }

    let refundAmount = 0;
    let stripeRefundId: string | undefined;

    // Process refund for paid Stripe orders
    if (
      order.paymentMethod === "stripe" &&
      order.paymentStatus === "paid"
    ) {
      if (!order.stripePaymentIntentId) {
        return NextResponse.json(
          {
            error:
              "Stripe payment reference is missing. Please contact support.",
          },
          { status: 400 }
        );
      }

      try {
        const refund = await stripe.refunds.create({
          payment_intent: order.stripePaymentIntentId,
          reason: "requested_by_customer",
        });

        stripeRefundId = refund.id;
        refundAmount = refund.amount / 100;
      } catch (stripeError) {
        console.error("Stripe refund error:", stripeError);

        // Do not cancel the order if the refund fails
        return NextResponse.json(
          {
            error:
              "Stripe refund failed. The order has not been cancelled. Please contact support.",
          },
          { status: 502 }
        );
      }
    }

    // Cancel the order
    await writeClient
      .patch(orderId)
      .set({
        status: "cancelled",
        cancelledAt: new Date().toISOString(),
        cancelledBy: userId,
        ...(stripeRefundId ? { stripeRefundId } : {}),
      })
      .commit();

    // Do not credit the wallet for Stripe refunds.
    // Stripe handles the refund to the original payment method.

    return NextResponse.json(
      {
        success: true,
        message: "Order cancelled successfully",
        refundAmount,
        stripeRefundId: stripeRefundId ?? null,
        refundedToWallet: false,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error) {
    console.error("Error processing refund:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
