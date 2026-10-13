import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  getUserOrders,
  getUserWishlist,
  getUserNotifications,
  getUserByClerkId,
} from "@/sanity/queries/userQueries";

interface Notification {
  read: boolean;
  id: string;
  title: string;
  message: string;
  sentAt: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  orderDate: string;
  status: string;
  totalPrice?: number;
}

interface WishlistItem {
  _id: string;
  addedAt?: string;
  name?: string;
  product?: {
    name: string;
  };
}

interface UserData {
  rewardPoints?: number | string | null;
  walletBalance?: number | string | null;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "order" | "wishlist" | "notification";
}

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch dashboard data from Sanity
    const [
      ordersData,
      wishlistData,
      notificationsData,
      userData,
    ] = await Promise.all([
      getUserOrders(user.id),
      getUserWishlist(user.id),
      getUserNotifications(user.id),
      getUserByClerkId(user.id),
    ]);

    // Ensure query results are arrays
    const userOrders: Order[] = Array.isArray(ordersData)
      ? (ordersData as Order[])
      : [];

    const userWishlist: WishlistItem[] = Array.isArray(wishlistData)
      ? (wishlistData as WishlistItem[])
      : [];

    const userNotifications: Notification[] = Array.isArray(
      notificationsData
    )
      ? (notificationsData as Notification[])
      : [];

    // Give userData an explicit type
    const typedUserData = userData as UserData | null;

    // Calculate dashboard statistics
    const stats = {
      ordersCount: userOrders.length,
      wishlistCount: userWishlist.length,
      notificationsCount: userNotifications.length,
      unreadNotifications: userNotifications.filter(
        (notification) => !notification.read
      ).length,
      rewardPoints: Number(typedUserData?.rewardPoints ?? 0),
      walletBalance: Number(typedUserData?.walletBalance ?? 0),
    };

    const recentActivity: Activity[] = [];

    // Recent orders
    const recentOrders = [...userOrders]
      .sort(
        (a, b) =>
          new Date(b.orderDate).getTime() -
          new Date(a.orderDate).getTime()
      )
      .slice(0, 2);

    recentOrders.forEach((order) => {
      const statusTitle =
        order.status === "delivered"
          ? "Delivered"
          : order.status === "shipped"
            ? "Shipped"
            : "Placed";

      const statusDescription =
        order.status === "delivered"
          ? "has been delivered"
          : order.status === "shipped"
            ? "has been shipped"
            : "has been placed successfully";

      recentActivity.push({
        id: `order-${order._id}`,
        title: `Order ${statusTitle}`,
        description: `Order #${order.orderNumber} ${statusDescription}`,
        timestamp: order.orderDate,
        type: "order",
      });
    });

    // Recent wishlist item
    const recentWishlistItem = userWishlist[0];

    if (recentWishlistItem) {
      const itemName =
        recentWishlistItem.name ??
        recentWishlistItem.product?.name ??
        "an item";

      recentActivity.push({
        id: `wishlist-${recentWishlistItem._id}`,
        title: "Item Added to Wishlist",
        description: `Added ${itemName} to your wishlist`,
        timestamp:
          recentWishlistItem.addedAt ??
          new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        type: "wishlist",
      });
    }

    // Most recent notification
    const recentNotifications = [...userNotifications]
      .sort(
        (a, b) =>
          new Date(b.sentAt).getTime() -
          new Date(a.sentAt).getTime()
      )
      .slice(0, 1);

    recentNotifications.forEach((notification) => {
      recentActivity.push({
        id: `notification-${notification.id}`,
        title: notification.title,
        description:
          notification.message.length > 80
            ? `${notification.message.substring(0, 80)}...`
            : notification.message,
        timestamp: notification.sentAt,
        type: "notification",
      });
    });

    // Sort newest activity first
    recentActivity.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    );

    return NextResponse.json({
      success: true,
      stats,
      recentActivity: recentActivity.slice(0, 4),
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);

    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}