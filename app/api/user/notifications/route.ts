import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  getUserNotifications,
  markNotificationAsRead,
  deleteUserNotification,
} from "@/sanity/queries/userQueries";

interface UserNotification {
  id: string;
  title?: string;
  message?: string;
  type?: string;
  read: boolean;
  priority?: string;
  sentAt: string;
  readAt?: string;
  sentBy?: string;
  actionUrl?: string;
}

export async function GET(_request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const notificationsData = await getUserNotifications(user.id);

    // Safely type the notifications array
    const notifications: UserNotification[] = Array.isArray(
      notificationsData
    )
      ? (notificationsData as UserNotification[])
      : [];

    // Sort newest notifications first without mutating the original array
    const sortedNotifications = [...notifications].sort(
      (a, b) =>
        new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );

    return NextResponse.json({
      success: true,
      notifications: sortedNotifications,
      unreadCount: notifications.filter(
        (notification) => !notification.read
      ).length,
    });
  } catch (error) {
    console.error("Error fetching user notifications:", error);

    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as {
      notificationId?: string;
    };

    const notificationId = body.notificationId;

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    const result = await markNotificationAsRead(
      user.id,
      notificationId
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);

    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get("id");

    if (!notificationId) {
      return NextResponse.json(
        { error: "Notification ID is required" },
        { status: 400 }
      );
    }

    const result = await deleteUserNotification(
      user.id,
      notificationId
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification:", error);

    return NextResponse.json(
      { error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}