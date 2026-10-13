import { analytics } from "@/lib/firebase";
import { logEvent, type Analytics } from "firebase/analytics";

type AddToCartParams = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  userId?: string;
};

type RemoveFromCartParams = AddToCartParams;

type OrderPlacedParams = {
  orderId: string;
  amount: number;
  status: string;
  userId?: string;
};

type OrderStatusUpdateParams = {
  orderId: string;
  status: string;
  userId?: string;
};

type UserRegistrationParams = {
  userId: string;
  email: string;
};

type UserLoginParams = UserRegistrationParams;

type ProductViewParams = {
  productId: string;
  name: string;
  userId?: string;
};

type AnalyticsParams = Record<string, unknown>;

export function trackEvent(
  eventName: string,
  eventParams: AnalyticsParams = {}
): void {
  if (typeof window === "undefined" || !analytics) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[Analytics] ${eventName}`, eventParams);
    }
    return;
  }

  logEvent(
    analytics as Analytics,
    eventName,
    eventParams as Record<string, string>
  );
}

export function trackAddToCart(params: AddToCartParams): void {
  trackEvent("add_to_cart", params);
}

export function trackRemoveFromCart(params: RemoveFromCartParams): void {
  trackEvent("remove_from_cart", params);
}

export function trackOrderPlaced(params: OrderPlacedParams): void {
  trackEvent("order_placed", params);
}

export function trackOrderStatusUpdate(
  params: OrderStatusUpdateParams
): void {
  trackEvent("order_status_update", params);
}

export function trackUserRegistration(
  params: UserRegistrationParams
): void {
  trackEvent("user_registration", params);
}

export function trackUserLogin(params: UserLoginParams): void {
  trackEvent("user_login", params);
}

export function trackProductView(params: ProductViewParams): void {
  trackEvent("view_product", params);
}

export function trackCartView(userId?: string): void {
  trackEvent("view_cart", { userId });
}

export function trackCheckoutStarted(params: {
  userId?: string;
  cartValue: number;
  itemCount: number;
}): void {
  trackEvent("begin_checkout", params);
}

export function trackSearchPerformed(params: {
  searchTerm: string;
  userId?: string;
  resultCount?: number;
}): void {
  trackEvent("search", params);
}

export function trackCategoryView(params: {
  categoryId: string;
  categoryName: string;
  userId?: string;
}): void {
  trackEvent("view_category", params);
}

export function trackWishlistAdd(params: {
  productId: string;
  name: string;
  userId?: string;
}): void {
  trackEvent("add_to_wishlist", params);
}

export function trackWishlistRemove(params: {
  productId: string;
  name: string;
  userId?: string;
}): void {
  trackEvent("remove_from_wishlist", params);
}

export function trackPageView(params: {
  pagePath: string;
  pageTitle?: string;
  userId?: string;
}): void {
  trackEvent("page_view", params);
}

export function trackPurchase(params: {
  orderId: string;
  value: number;
  currency?: string;
  items: Array<{
    productId: string;
    name: string;
    category?: string;
    quantity: number;
    price: number;
  }>;
  userId?: string;
}): void {
  trackEvent("purchase", params);
}

export function trackBestSellingProducts(params: {
  products: Array<{
    productId: string;
    name: string;
    category?: string;
    salesCount: number;
    revenue: number;
  }>;
  timeframe: string;
}): void {
  trackEvent("best_selling_products", params);
}

export function trackOrderDetails(params: {
  orderId: string;
  orderNumber: string;
  status: string;
  value: number;
  itemCount: number;
  paymentMethod: string;
  shippingMethod?: string;
  userId?: string;
  products: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}): void {
  trackEvent("order_details", params);
}

export function trackOrderFullfillment(params: {
  orderId: string;
  status: string;
  previousStatus: string;
  value: number;
  fulfillmentTime?: number;
  userId?: string;
}): void {
  trackEvent("order_fulfillment", params);
}

export function trackInventoryAction(params: {
  productId: string;
  name: string;
  action: "restock" | "low_stock" | "out_of_stock";
  currentStock: number;
  previousStock?: number;
}): void {
  trackEvent("inventory_action", params);
}

export function trackCustomerLifetime(
  userId: string,
  totalSpent: number,
  orderCount: number,
  avgOrderValue: number
): void {
  trackEvent("customer_lifetime_value", {
    user_id: userId,
    total_spent: totalSpent,
    order_count: orderCount,
    average_order_value: avgOrderValue,
    ltv_segment:
      totalSpent > 1000
        ? "high_value"
        : totalSpent > 500
          ? "medium_value"
          : "low_value",
    timestamp: new Date().toISOString(),
  });
}

export function trackProductSearch(
  searchTerm: string,
  resultsCount: number,
  category?: string,
  filters?: Record<string, string | number | boolean>
): void {
  trackEvent("search", {
    search_term: searchTerm,
    results_count: resultsCount,
    category: category || "all",
    filters: JSON.stringify(filters || {}),
    timestamp: new Date().toISOString(),
  });
}

export function trackCategoryViewEnhanced(
  categoryName: string,
  categoryId: string,
  productCount: number
): void {
  trackEvent("view_item_list", {
    item_list_id: categoryId,
    item_list_name: categoryName,
    items_count: productCount,
    list_type: "category",
    timestamp: new Date().toISOString(),
  });
}

export function trackUserRegistrationEnhanced(
  userId: string,
  registrationMethod: "email" | "google" | "facebook" | "other"
): void {
  trackEvent("sign_up", {
    method: registrationMethod,
    user_id: userId,
    timestamp: new Date().toISOString(),
  });
}

export function trackUserLoginEnhanced(
  userId: string,
  loginMethod: "email" | "google" | "facebook" | "other"
): void {
  trackEvent("login", {
    method: loginMethod,
    user_id: userId,
    timestamp: new Date().toISOString(),
  });
}
