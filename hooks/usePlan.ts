"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/client";
import {
  PLAN_FREE,
  PLAN_PRO,
  PLAN_BUSINESS,
  PLAN_LIMITS,
  PLAN_LABELS,
  type PlanLimits,
  type PlanType,
  resolvePlan,
  getPlanLimits,
} from "@/lib/constants/plans";
import { getSubscriptionStatus } from "@/lib/actions/subscription";
import { getUserUsage, type PlanUsage } from "@/lib/actions/usage";

export type UsePlanResult = {
  loading: boolean;
  plan: PlanType;
  limits: PlanLimits;
  usage: PlanUsage | null;
  isPro: boolean;
  isBusiness: boolean;
  isFreePlan: boolean;
  label: string;
};

const initialState: UsePlanResult = {
  loading: true,
  plan: PLAN_FREE,
  limits: PLAN_LIMITS[PLAN_FREE],
  usage: null,
  isPro: false,
  isBusiness: false,
  isFreePlan: true,
  label: PLAN_LABELS[PLAN_FREE],
};

export function usePlan(): UsePlanResult {
  const [state, setState] = useState<UsePlanResult>(initialState);

  useEffect(() => {
    let isMounted = true;

    const loadPlan = async () => {
      try {
        const { data: session } = await authClient.getSession();

        if (!session?.user?.id) {
          if (!isMounted) return;
          setState((prev) => ({ ...prev, loading: false }));
          return;
        }

        const [subData, usage] = await Promise.all([
          getSubscriptionStatus(session.user.id),
          getUserUsage(),
        ]);

        const resolvedPlan = resolvePlan(subData?.plan, subData?.status);
        const limits = getPlanLimits(resolvedPlan);

        if (!isMounted) return;

        setState({
          loading: false,
          plan: resolvedPlan,
          limits,
          usage,
          isPro: resolvedPlan === PLAN_PRO,
          isBusiness: resolvedPlan === PLAN_BUSINESS,
          isFreePlan: resolvedPlan === PLAN_FREE,
          label: PLAN_LABELS[resolvedPlan],
        });
      } catch (error) {
        console.error("Failed to load plan information:", error);
        if (!isMounted) return;
        setState((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    };

    loadPlan();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}

