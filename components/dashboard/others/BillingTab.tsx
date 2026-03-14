"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlan } from "@/hooks/usePlan";
import { authClient } from "@/lib/auth/client";
import { getSubscriptionByUserId } from "@/lib/actions/subscription";

type PaystackAuthorization = {
  authorization_code?: string;
  last4?: string;
  exp_month?: string;
  exp_year?: string;
  channel?: string;
  card_type?: string;
  bank?: string;
  country_code?: string;
  brand?: string;
  reusable?: boolean;
};

type PaystackSubscription = {
  subscription_code?: string;
  status?: string;
  amount?: number;
  next_payment_date?: string;
  cron_expression?: string;
  plan?: { name?: string };
};

type PaystackCustomerResponse =
  | {
      status: true;
      message: string;
      data: {
        email?: string;
        customer_code?: string;
        authorizations?: PaystackAuthorization[];
        subscriptions?: PaystackSubscription[];
      };
    }
  | { status: false; message?: string };

export function BillingTab() {
  const { label: planLabel, loading: planLoading } = usePlan();
  const [email, setEmail] = useState<string>("");
  const [sessionLoading, setSessionLoading] = useState(true);
  const [customer, setCustomer] = useState<PaystackCustomerResponse | null>(null);
  const [customerLoading, setCustomerLoading] = useState(false);
  const [customerFetched, setCustomerFetched] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);

  const [subLoading, setSubLoading] = useState(false);
  const [subscriptionCode, setSubscriptionCode] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [nextPaymentDate, setNextPaymentDate] = useState<Date | null>(null);

  const [cancelLoading, setCancelLoading] = useState(false);

  const activePaystackSubscription = useMemo(() => {
    if (!customer || customer.status !== true) return null;
    const subs = customer.data.subscriptions ?? [];
    return subs.find((s) => (s.status ?? "").toLowerCase() === "active") ?? subs[0] ?? null;
  }, [customer]);

  const loadCustomer = async () => {
    setCustomerLoading(true);
    setCustomerFetched(false);
    setCustomerError(null);
    try {
      const res = await fetch("/api/paystack/customer", { cache: "no-store" });
      const data = (await res.json()) as PaystackCustomerResponse;
      setCustomer(data);

      if (!res.ok || data.status !== true) {
        setCustomerError(data.status === false ? data.message ?? "Customer not retrieved" : "Customer not retrieved");
      }
    } catch (err) {
      console.error(err);
      setCustomer(null);
      setCustomerError("Customer not retrieved");
    } finally {
      setCustomerLoading(false);
      setCustomerFetched(true);
    }
  };

  useEffect(() => {
    const init = async () => {
      setSessionLoading(true);
      try {
        const { data: session } = await authClient.getSession();
        setEmail(session?.user?.email ?? "");

        if (session?.user?.id) {
          setSubLoading(true);
          try {
            const sub = await getSubscriptionByUserId(session.user.id);
            const row = sub?.[0] ?? null;
            setSubscriptionCode(row?.subscriptionCode ?? null);
            setSubscriptionStatus(row?.status ?? null);
            setNextPaymentDate(row?.nextPaymentDate ?? null);
          } finally {
            setSubLoading(false);
          }
        }

        await loadCustomer();
      } finally {
        setSessionLoading(false);
      }
    };

    void init();
  }, []);

  const handleCancelSubscription = async () => {
    if (!subscriptionCode) return;
    setCancelLoading(true);
    try {
      const res = await fetch(
        `/api/paystack/subscription/manage-link?code=${encodeURIComponent(subscriptionCode)}`,
        { cache: "no-store" },
      );
      const data = (await res.json()) as { status?: boolean; data?: { link?: string } };
      const link = data?.data?.link;
      if (res.ok && link) {
        window.location.href = link;
        return;
      }
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (value: Date | string | null | undefined) => {
    if (!value) return "—";
    const date = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  const formatAmount = (amountKobo: number | null | undefined) => {
    if (typeof amountKobo !== "number") return "—";
    return `₦${(amountKobo / 100).toLocaleString()}`;
  };

  const hasCustomer = customer?.status === true;

  return (
    <div className="grid gap-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Billing & Payment</h2>
            <p className="text-sm text-gray-500 mt-1">
              View your current plan, payment methods, and subscription status.
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-2xl"
            onClick={loadCustomer}
            disabled={customerLoading}
          >
            {customerLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Refresh</span>
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Email</p>
            <div className="mt-1">
              {sessionLoading ? (
                <Skeleton className="h-4 w-56 max-w-full" />
              ) : (
                <p className="text-sm font-semibold text-gray-900 break-all">
                  {email || "—"}
                </p>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Current plan</p>
            <div className="mt-1">
              {planLoading ? (
                <Skeleton className="h-4 w-28" />
              ) : (
                <p className="text-sm font-semibold text-gray-900">{planLabel}</p>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-xs text-gray-500">Next billing date</p>
            <div className="mt-1">
              {subLoading ? (
                <Skeleton className="h-4 w-40" />
              ) : (
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(nextPaymentDate ?? activePaystackSubscription?.next_payment_date)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-900">Subscription</h3>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-100 p-4">
            <p className="text-xs text-gray-500">Status</p>
            <div className="mt-1">
              {subLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <p className="text-sm font-semibold text-gray-900">
                  {subscriptionStatus ?? activePaystackSubscription?.status ?? "—"}
                </p>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 p-4">
            <p className="text-xs text-gray-500">Amount</p>
            <div className="mt-1">
              {!customerFetched || customerLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <p className="text-sm font-semibold text-gray-900">
                  {formatAmount(activePaystackSubscription?.amount)}
                </p>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-gray-100 p-4">
            <p className="text-xs text-gray-500">Plan (Paystack)</p>
            <div className="mt-1">
              {!customerFetched || customerLoading ? (
                <Skeleton className="h-4 w-44 max-w-full" />
              ) : (
                <p className="text-sm font-semibold text-gray-900">
                  {activePaystackSubscription?.plan?.name ?? "—"}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-xs text-gray-500">
            {subLoading ? (
              <Skeleton className="h-3 w-64 max-w-full" />
            ) : subscriptionCode ? (
              <span>
                Subscription code: <span className="font-mono">{subscriptionCode}</span>
              </span>
            ) : (
              <span>No active subscription found.</span>
            )}
          </div>

          {subLoading ? (
            <Skeleton className="h-10 w-48 rounded-2xl" />
          ) : (
            <Button
              className="rounded-2xl bg-red-500 hover:bg-red-400"
              disabled={!subscriptionCode || cancelLoading}
              onClick={handleCancelSubscription}
            >
              {cancelLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4" />
              )}
              <span className="ml-2">Cancel subscription</span>
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-900">Payment methods</h3>

        {!customerFetched || customerLoading ? (
          <div className="mt-4 grid gap-3">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 p-4"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-44" />
                    <Skeleton className="h-3 w-56 max-w-full" />
                  </div>
                </div>
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        ) : !hasCustomer ? (
          <div className="mt-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6">
            <p className="text-sm font-semibold text-gray-900">
              You haven&apos;t been a customer at all.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Upgrade to a paid plan to see your billing and payment details here.
            </p>
            {customerError && (
              <p className="text-xs text-gray-400 mt-2">Paystack: {customerError}</p>
            )}
          </div>
        ) : (
          <div className="mt-4 grid gap-3">
            {(customer.data.authorizations ?? []).length === 0 ? (
              <p className="text-sm text-gray-500">No saved payment method found.</p>
            ) : (
              (customer.data.authorizations ?? []).slice(0, 3).map((a) => (
                <div
                  key={a.authorization_code ?? `${a.last4}-${a.exp_month}-${a.exp_year}`}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {a.brand ?? a.card_type ?? "Card"} •••• {a.last4 ?? "—"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Expires {a.exp_month ?? "—"}/{a.exp_year ?? "—"} • {a.bank ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {a.reusable ? "Reusable" : "Single-use"}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
