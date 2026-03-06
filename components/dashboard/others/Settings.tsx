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
import GitHubIcon from "@/components/icons/Github";
import GoogleIcon from "@/components/icons/Google";
import {
  deleteAccount,
  updateProfileName,
  getUserProvider,
} from "@/lib/actions/profile";
import { getProviderName, getInitials } from "@/utils/profile";

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
        <div className="grid gap-6 p-6 ">
          <div className="grid md:grid-cols-2 gap-2">
            {/* Profile Info section */}
            <div className="grid gap-6 md:w-sm">
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
                      nameError ?
                        "border-red-500 focus:border-red-500 focus:ring-red-500"
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
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <span
                    className={`border rounded-full px-3 py-1 ${
                      user?.emailVerified ?
                        "bg-blue-50 border-blue-100"
                      : "bg-red-50 border-red-100"
                    } flex items-center gap-2 text-sm`}
                  >
                    <BadgeCheck
                      className={`h-4 w-4 ${
                        user?.emailVerified ? "text-blue-500" : "text-red-500"
                      }`}
                    />
                    <span>
                      {user?.emailVerified ? "Verified" : "Not verified"}
                    </span>
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
                    {providerLoading ?
                      <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse"></div>
                    : getProviderIcon(authProvider)}
                    <span className="text-sm font-medium text-gray-700">
                      {providerLoading ?
                        "Loading..."
                      : getProviderName(authProvider)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
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
                          {deleteLoading ?
                            "Deleting..."
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
