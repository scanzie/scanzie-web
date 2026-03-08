"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pricing from "@/components/home/Pricing";
import { authClient } from "@/lib/auth/client";
import { User } from "better-auth";
import { getSubscriptionStatus } from "@/lib/actions/subscription";

export default function UpgradePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userPlan, setUserPlan] = useState<string>("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: sessionData } = await authClient.getSession();
        if (sessionData?.user) {
          setUser(sessionData.user);

          try {
            const subData = await getSubscriptionStatus(sessionData.user.id);
            if (subData?.status === "active" && subData?.plan) {
              setUserPlan(subData.plan.toLowerCase());
            } else {
              setUserPlan("free");
            }
          } catch (e) {
            console.error("Failed to fetch subscription:", e);
            setUserPlan("free");
          }
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("An error occurred", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button
          variant="ghost"
          className=""
          onClick={() => {
            if (window.history.length > 2) {
              router.back();
            } else {
              router.push("/dashboard");
            }
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>
      
   
      <Pricing isAuthenticated={!!user} userEmail={user?.email || ""} userPlan={userPlan} />
    </div>
  );
}
