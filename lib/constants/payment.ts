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
export const PAYMENT_SUCCESS = "invoice.payment_success";
export const PAYMENT_CALLBACK_MAX_POLLS = 12;
export const PAYMENT_CHANNELS = [
  "card",
  "bank",
  "apple_pay",
  "ussd",
  "qr",
  "mobile_money",
  "bank_transfer",
  "eft",
  "capitec_pay",
  "payattitude",
];

// Plan Prices in KOBO
export const SCANZIE_PRO_MONTHLY = 5 * 100; // $5.00
export const SCANZIE_PRO_YEARLY = 48 * 100; // $48.00 (20% off annual)
export const SCANZIE_BUSINESS_MONTHLY = 15 * 100; // $15.00
export const SCANZIE_BUSINESS_YEARLY = 144 * 100; // $144.00 (20% off annual)
