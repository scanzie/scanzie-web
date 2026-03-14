"use client";

import { useEffect, useState } from "react";
import { SidebarTrigger } from "../../ui/sidebar";
import { User } from "better-auth";
import { authClient } from "@/lib/auth/client";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditCard, Shield, User2 } from "lucide-react";
import {
  deleteAccount,
  updateProfileName,
  getUserProvider,
} from "@/lib/actions/profile";
import { ProfileTab } from "./ProfileTab";
import { AccountTab, SessionData } from "./AccountTab";
import { BillingTab } from "./BillingTab";

const Settings = () => {
  const [user, setUser] = useState<User>();
  const [session, setSession] = useState<SessionData>();
  const [userDateJoined, setUserDateJoined] = useState<string>("");
  const [authProvider, setAuthProvider] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string>("");
  const [providerLoading, setProviderLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"profile" | "account" | "billing">(
    "profile",
  );

  useEffect(() => {
    if (searchParams.has("profile")) {
      setActiveTab("profile");
    } else if (searchParams.has("account")) {
      setActiveTab("account");
    } else if (searchParams.has("billing")) {
      setActiveTab("billing");
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: sessionData } = await authClient.getSession();
        setUser(sessionData?.user);

        // Store the session data for the Account tab
        if (sessionData?.session) {
          setSession(sessionData.session as unknown as SessionData);
        }

        if (sessionData?.user) {
          setName(sessionData.user.name);
        }

        if (sessionData?.user?.createdAt) {
          const date = new Date(sessionData.user.createdAt);
          setUserDateJoined(
            date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          );
        }

        // Fetch provider from database using the new server action
        if (sessionData?.user?.id) {
          setProviderLoading(true);
          try {
            const provider = await getUserProvider(sessionData.user.id);
            setAuthProvider(provider || "");
          } catch (err) {
            console.error("Error fetching provider:", err);
            setAuthProvider("");
          } finally {
            setProviderLoading(false);
          }
        }
      } catch (err) {
        console.log("An error occurred", err);
        setProviderLoading(false);
      }
    };

    fetchSession();
  }, []);

  const validateName = (value: string): string => {
    if (!value.trim()) {
      return "Name cannot be empty";
    }
    if (value.trim().length < 2) {
      return "Name must be at least 2 characters long";
    }
    if (value.trim().length > 50) {
      return "Name must be less than 50 characters";
    }
    return "";
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    const error = validateName(value);
    setNameError(error);
  };

  const handleUpdate = async () => {
    const error = validateName(name);
    if (error) {
      setNameError(error);
      return;
    }

    setLoading(true);
    try {
      await updateProfileName(user?.id as string, name.trim());
      setNameError("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    setDeleteLoading(true);
    try {
      await deleteAccount(user?.id as string);
      router.push("/login");
    } catch (err) {
      console.error("Failed to delete account:", err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Check if update button should be disabled
  const isUpdateDisabled =
    loading || !!nameError || !name.trim() || name.trim() === user?.name;

  return (
    <div className="w-full mx-auto bg-gray-50">
      <div className="bg-white border-b">
        <main className="dashboard-container ">
          {/* Header */}
          <header className="bg-white pt-6 px-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">
                  Customize your account profile and preferences.
                </p>
              </div>
              <SidebarTrigger className="bg-blue-50 p-3 rounded-md md:hidden" />
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-100">
              {[
                { key: "profile" as const, icon: User2, label: "Profile" },
                { key: "account" as const, icon: Shield, label: "Account" },
                { key: "billing" as const, icon: CreditCard, label: "Billing & Payment" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    router.push(`/dashboard/settings?${tab.key}`);
                  }}
                  className={`cursor-pointer pb-4 text-sm font-medium border-b-2 transition-colors duration-200 flex items-center gap-2 ${
                    activeTab === tab.key
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </header>
        </main>
      </div>

      <main className="dashboard-container py-10">
        <div className="grid gap-6 p-6 ">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <ProfileTab
              user={user}
              userDateJoined={userDateJoined}
              name={name}
              nameError={nameError}
              loading={loading}
              isUpdateDisabled={isUpdateDisabled}
              handleNameChange={handleNameChange}
              handleUpdate={handleUpdate}
            />
          )}

          {/* Account Tab */}
          {activeTab === "account" && (
            <AccountTab
              session={session}
              authProvider={authProvider}
              providerLoading={providerLoading}
              deleteLoading={deleteLoading}
              handleDeleteAccount={handleDeleteAccount}
            />
          )}

          {activeTab === "billing" && <BillingTab />}
        </div>
      </main>
    </div>
  );
};

import { Suspense } from "react";
import { UserIcon, UserCircle, WalletCards, Icon } from "lucide-react";
export default function SettingsContainer() {
  return (
    <Suspense fallback={<div className="p-8">Loading settings...</div>}>
      <Settings />
    </Suspense>
  );
}
