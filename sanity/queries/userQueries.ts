import { sanityFetch } from "../lib/live";

// User Queries
export const USER_BY_CLERK_ID_QUERY = `
  *[_type == "user" && clerkUserId == $clerkUserId][0] {
    _id,
    _type,
    clerkUserId,
    email,
    firstName,
    lastName,
    phone,
    dateOfBirth,
    profileImage {
      asset -> {
        _id,
        url
      }
    },
    addresses[] -> {
      _id,
      name,
      address,
      city,
      state,
      zip,
      default,
      createdAt
    },
    preferences,
    wishlist[] -> {
      _id,
      name,
      slug,
      image {
        asset -> {
          _id,
          url
        }
      },
      price,
      currency
    },
    cart[] {
      product -> {
        _id,
        name,
        slug,
        image {
          asset -> {
            _id,
            url
          }
        },
        price,
        currency,
        inStock,
        stockQuantity
      },
      quantity,
      size,
      color,
      addedAt
    },
    orders[] -> {
      _id,
      orderNumber,
      totalPrice,
      currency,
      status,
      orderDate
    },
    loyaltyPoints,
    rewardPoints,
    totalSpent,
    lastLogin,
    isActive,
    createdAt,
    updatedAt
  }
`;

export const USER_ADDRESSES_QUERY = `
  *[_type == "address" && user._ref == $userId] | order(default desc, createdAt desc) {
    _id,
    name,
    address,
    city,
    state,
    zip,
    default,
    createdAt
  }
`;

export const USER_CART_QUERY = `
  *[_type == "user" && clerkUserId == $clerkUserId][0] {
    cart[] {
      product -> {
        _id,
        name,
        slug,
        image {
          asset -> {
            _id,
            url
          }
        },
        price,
        currency,
        inStock,
        stockQuantity,
        categories[] -> {
          name
        }
      },
      quantity,
      size,
      color,
      addedAt
    }
  }
`;

export const USER_WISHLIST_QUERY = `
  *[_type == "user" && clerkUserId == $clerkUserId][0] {
    wishlist[] -> {
      _id,
      name,
      slug,
      image {
        asset -> {
          _id,
          url
        }
      },
      price,
      currency,
      inStock,
      categories[] -> {
        name
      }
    }
  }
`;

export const USER_ORDERS_QUERY = `
  *[_type == "order" && clerkUserId == $clerkUserId] | order(orderDate desc) {
    _id,
    orderNumber,
    products[] {
      product -> {
        _id,
        name,
        slug,
        image {
          asset -> {
            _id,
            url
          }
        },
        price,
        currency
      },
      quantity
    },
    totalPrice,
    currency,
    amountDiscount,
    address,
    status,
    orderDate,
    invoice
  }
`;

export const ORDER_BY_ID_QUERY = `
  *[_type == "order" && _id == $orderId][0] {
    _id,
    orderNumber,
    clerkUserId,
    customerName,
    email,
    products[] {
      product -> {
        _id,
        name,
        slug,
        "images": select(defined(image) => [image], []),
        image {
          asset -> {
            _id,
            url
          }
        },
        price,
        currency,
        categories[] -> {
          title
        }
      },
      quantity
    },
    subtotal,
    tax,
    shipping,
    totalPrice,
    currency,
    amountDiscount,
    address,
    status,
    paymentStatus,
    paymentMethod,
    orderDate,
    invoice,
    stripeCheckoutSessionId,
    stripePaymentIntentId,
    paymentCompletedAt,
    addressConfirmedBy,
    addressConfirmedAt,
    orderConfirmedBy,
    orderConfirmedAt,
    packedBy,
    packedAt,
    assignedDeliverymanName,
    dispatchedAt,
    cashCollectedAt,
    paymentReceivedAt,
    deliveredBy,
    deliveredAt
  }
`;

// User Functions
export const getUserByClerkId = async (clerkUserId: string) => {
  try {
    const { data } = await sanityFetch({
      query: USER_BY_CLERK_ID_QUERY,
      params: { clerkUserId },
    });

    return data;
  } catch (error) {
    console.error("Error fetching user by Clerk ID:", error);
    return null;
  }
};

export const getUserAddresses = async (userId: string) => {
  try {
    const { data } = await sanityFetch({
      query: USER_ADDRESSES_QUERY,
      params: { userId },
    });

    return data ?? [];
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    return [];
  }
};

export const getUserCart = async (clerkUserId: string) => {
  try {
    const { data } = await sanityFetch({
      query: USER_CART_QUERY,
      params: { clerkUserId },
    });

    const result = data as { cart?: unknown[] } | null;
    return result?.cart ?? [];
  } catch (error) {
    console.error("Error fetching user cart:", error);
    return [];
  }
};

export const getUserWishlist = async (clerkUserId: string) => {
  try {
    const { data } = await sanityFetch({
      query: USER_WISHLIST_QUERY,
      params: { clerkUserId },
    });

    const result = data as { wishlist?: unknown[] } | null;
    return result?.wishlist ?? [];
  } catch (error) {
    console.error("Error fetching user wishlist:", error);
    return [];
  }
};

export const getUserOrders = async (clerkUserId: string) => {
  try {
    const { data } = await sanityFetch({
      query: USER_ORDERS_QUERY,
      params: { clerkUserId },
    });

    return data ?? [];
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return [];
  }
};

// Order result type
type OrderByIdResult = {
  _id: string;
  orderNumber: string;
  clerkUserId: string;
  customerName: string;
  email: string;
  products: Array<{
    product: {
      _id: string;
      name: string;
      slug?: {
        current: string;
      };
      images?: Array<{
        asset?: {
          _id?: string;
          url?: string;
        };
      }>;
      image?: {
        asset: {
          _id?: string;
          url: string;
        };
      };
      price: number;
      currency: string;
      categories?: Array<{
        title: string;
      }>;
    };
    quantity: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  totalPrice: number;
  currency: string;
  amountDiscount: number;
  address: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  orderDate: string;
  [key: string]: unknown;
};

export const getOrderById = async (
  orderId: string
): Promise<OrderByIdResult | null> => {
  try {
    const { data } = await sanityFetch({
      query: ORDER_BY_ID_QUERY,
      params: { orderId },
    });

    return (data as OrderByIdResult | null) ?? null;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return null;
  }
};

// User Notifications Queries
export const USER_NOTIFICATIONS_QUERY = `
  *[_type == "user" && clerkUserId == $clerkUserId][0] {
    notifications[] {
      id,
      title,
      message,
      type,
      read,
      priority,
      sentAt,
      readAt,
      sentBy,
      actionUrl
    }
  }
`;

export const getUserNotifications = async (clerkUserId: string) => {
  try {
    const { data } = await sanityFetch({
      query: USER_NOTIFICATIONS_QUERY,
      params: { clerkUserId },
    });

    const result = data as {
      notifications?: unknown[];
    } | null;

    return result?.notifications ?? [];
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    return [];
  }
};

export const MARK_NOTIFICATION_READ_QUERY = `
  *[_type == "user" && clerkUserId == $clerkUserId][0] {
    _id,
    notifications
  }
`;

type UserNotification = {
  id: string;
  title?: string;
  message?: string;
  type?: string;
  read?: boolean;
  priority?: string;
  sentAt?: string;
  readAt?: string;
  sentBy?: string;
  actionUrl?: string;
};

type UserNotificationDocument = {
  _id: string;
  notifications?: UserNotification[];
};

export const markNotificationAsRead = async (
  clerkUserId: string,
  notificationId: string
) => {
  try {
    const { data } = await sanityFetch({
      query: MARK_NOTIFICATION_READ_QUERY,
      params: { clerkUserId },
    });

    const user = data as UserNotificationDocument | null;

    if (!user?._id) {
      throw new Error("User not found");
    }

    const updatedNotifications = (user.notifications ?? []).map(
      (notification) => {
        if (notification.id === notificationId) {
          return {
            ...notification,
            read: true,
            readAt: new Date().toISOString(),
          };
        }

        return notification;
      }
    );

    const { writeClient } = await import("../lib/client");

    await writeClient
      .patch(user._id)
      .set({ notifications: updatedNotifications })
      .commit();

    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);

    return {
      success: false,
      error: "Failed to mark notification as read",
    };
  }
};

export const deleteUserNotification = async (
  clerkUserId: string,
  notificationId: string
) => {
  try {
    const { data } = await sanityFetch({
      query: MARK_NOTIFICATION_READ_QUERY,
      params: { clerkUserId },
    });

    const user = data as UserNotificationDocument | null;

    if (!user?._id) {
      throw new Error("User not found");
    }

    const updatedNotifications = (user.notifications ?? []).filter(
      (notification) => notification.id !== notificationId
    );

    const { writeClient } = await import("../lib/client");

    await writeClient
      .patch(user._id)
      .set({ notifications: updatedNotifications })
      .commit();

    return { success: true };
  } catch (error) {
    console.error("Error deleting notification:", error);

    return {
      success: false,
      error: "Failed to delete notification",
    };
  }
};
