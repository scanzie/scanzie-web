// Urls
export const PAYMENT_SUCCESSFUL_CALLBACK_URL =
  "/dashboard?successfully-subscribed=true";
export const PAYSTACK_VERIFY_TRANSACTION_URL =
  "https://api.paystack.co/transaction/verify";
export const PAYSTACK_INITIALIZE_TRANSACTION_URL =
  "https://api.paystack.co/transaction/initialize";

// Keywords
export const CREATE_SUBSCRIPTION = "subscription.create";
export const PAYMENT_FAILED = "invoice.payment_failed";
export const PAYMENT_CALLBACK_MAX_POLLS = 12;

// Plan Prices
export const SCANZIE_PRO_MONTHLY = 16500 * 100; // $12.00
export const SCANZIE_PRO_YEARLY = 149760 * 100; // $115.20
export const SCANZIE_BUSINESS_MONTHLY = 97500 * 100; // $75.00
export const SCANZIE_BUSINESS_YEARLY = 936000 * 100; // $720.00
