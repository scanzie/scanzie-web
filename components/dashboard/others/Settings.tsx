"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { SidebarTrigger } from "../../ui/sidebar";
import { User } from "better-auth";
import { authClient } from "@/lib/auth/client";
import { Input } from "../../ui/input";
import { BadgeCheck, Edit, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "../../ui/button";
import {
  deleteAccount,
  updateProfileName,
  getUserProvider,
} from "@/lib/actions/profile";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import { useRouter } from "next/navigation";
import { getInitials } from "@/utils/general";

// OAuth Provider Icons
const GitHubIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const Settings = () => {
  const [user, setUser] = useState<User>();
  const [userDateJoined, setUserDateJoined] = useState<string>("");
  const [authProvider, setAuthProvider] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string>("");
  const [providerLoading, setProviderLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: sessionData } = await authClient.getSession();
        setUser(sessionData?.user);
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
            })
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

  // Client-side validation for name field
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

  // Handle name input change with validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);

    const error = validateName(value);
    setNameError(error);
  };

  // Function to get provider icon
  const getProviderIcon = (provider: string) => {
    switch (provider?.toLowerCase()) {
      case "github":
        return <GitHubIcon />;
      case "google":
        return <GoogleIcon />;
      default:
        return <BadgeCheck className="w-4 h-4" />;
    }
  };

  // Function to get provider display name
  const getProviderName = (provider: string) => {
    switch (provider?.toLowerCase()) {
      case "github":
        return "GitHub";
      case "google":
        return "Google";
      default:
        return provider || "Unknown";
    }
  };

  const handleUpdate = async () => {
    // Validate before updating
    const error = validateName(name);
    if (error) {
      setNameError(error);
      return;
    }

    setLoading(true);
    try {
      await updateProfileName(user?.id as string, name.trim());
      // Clear any previous errors on successful update
      setNameError("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (
    e: React.MouseEvent<HTMLButtonElement>
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
          <header className="bg-white border-b border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600 mt-1">
                  Customize your account profile.
                </p>
              </div>
              <SidebarTrigger className="bg-blue-50 p-3 rounded-md md:hidden" />
            </div>
          </header>
        </main>
      </div>

      <main className="dashboard-container py-10">
        <div className="grid gap-6 p-6 md:w-sm">
          {/* Profile Image */}
          <Avatar className="w-48 h-48">
            <AvatarImage src={user?.image as string} />
            <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
          </Avatar>

          {/* Name info */}
          <div className="grid gap-2">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                className={`w-auto ${
                  nameError
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                placeholder="eg. Fisayo Obadina"
                value={name}
                onChange={handleNameChange}
                aria-invalid={!!nameError}
                aria-describedby={nameError ? "name-error" : undefined}
              />
              {nameError && (
                <p
                  id="name-error"
                  className="text-sm text-red-600 flex items-center gap-1"
                >
                  <AlertTriangle className="w-4 h-4" />
                  {nameError}
                </p>
              )}
            </div>

            <Button
              disabled={isUpdateDisabled}
              onClick={handleUpdate}
              className="ml-auto text-sm"
            >
              <Edit />
              <span>{loading ? "Updating..." : "Update"}</span>
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <span
                className={`border rounded-full px-3 py-1 ${
                  user?.emailVerified
                    ? "bg-blue-50 border-blue-100"
                    : "bg-red-50 border-red-100"
                } flex items-center gap-2 text-sm`}
              >
                <BadgeCheck
                  className={`h-4 w-4 ${
                    user?.emailVerified ? "text-blue-500" : "text-red-500"
                  }`}
                />
                <span>{user?.emailVerified ? "Verified" : "Not verified"}</span>
              </span>
            </div>
            <Input
              readOnly={true}
              className="w-auto"
              defaultValue={user?.email || ""}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Date Joined
            </label>
            <Input
              readOnly={true}
              type="text"
              className="w-auto"
              defaultValue={userDateJoined}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Sign-in Provider
            </label>
            <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-2xl bg-gray-50">
              <div className="flex items-center gap-2">
                {providerLoading ? (
                  <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse"></div>
                ) : (
                  getProviderIcon(authProvider)
                )}
                <span className="text-sm font-medium text-gray-700">
                  {providerLoading
                    ? "Loading..."
                    : getProviderName(authProvider)}
                </span>
              </div>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="border-t border-gray-200 pt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-800 mb-1">
                    Delete Account
                  </h3>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain. All your data will be permanently removed and
                    cannot be recovered.
                  </p>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="w-5 h-5" />
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600">
                          This action cannot be undone. This will permanently
                          delete your account and remove all your data from our
                          servers. Your profile, settings, and all associated
                          information will be lost forever.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          disabled={deleteLoading}
                          className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
                        >
                          {deleteLoading
                            ? "Deleting..."
                            : "Yes, delete my account"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
