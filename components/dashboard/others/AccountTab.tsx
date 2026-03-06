import { BadgeCheck, Trash2, AlertTriangle, Monitor, Clock, CalendarDays } from "lucide-react";
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
import GitHubIcon from "@/components/icons/Github";
import GoogleIcon from "@/components/icons/Google";
import { getProviderName } from "@/utils/profile";
import { UAParser } from "ua-parser-js";

export interface SessionData {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date | string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface AccountTabProps {
  session: SessionData | undefined;
  authProvider: string;
  providerLoading: boolean;
  deleteLoading: boolean;
  handleDeleteAccount: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}

export function AccountTab({
  session,
  authProvider,
  providerLoading,
  deleteLoading,
  handleDeleteAccount,
}: AccountTabProps) {
  
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

  // Parse user agent
  const ua = session?.userAgent ? new UAParser(session.userAgent).getResult() : null;
  const browserName = ua?.browser?.name || "Unknown Browser";
  const osName = ua?.os?.name || "Unknown OS";

  // Format dates
  const formatDateTime = (dateStr: string | Date | undefined) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="grid gap-8 max-w-3xl">
      {/* Sign-in Provider */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Authentication Strategy</h3>
        <p className="text-sm text-gray-500 mb-2">The provider you used to log into this application.</p>
        <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-white w-full max-w-md">
          <div className="flex items-center gap-3">
            {providerLoading ? (
              <div className="w-6 h-6 rounded-full bg-gray-300 animate-pulse"></div>
            ) : (
              getProviderIcon(authProvider)
            )}
            <span className="text-sm font-medium text-gray-700">
              {providerLoading ? "Loading..." : getProviderName(authProvider)}
            </span>
          </div>
        </div>
      </div>

      {/* Active Session Info */}
      <div className="flex flex-col gap-2 border-t pt-8">
        <h3 className="text-lg font-semibold text-gray-900">Session Information</h3>
        <p className="text-sm text-gray-500 mb-2">Details about your current active session and device.</p>
        
        <div className="grid gap-4 md:grid-cols-2">
          {/* Device & Browser Info */}
          <div className="flex flex-col gap-1 p-4 border border-gray-200 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 mb-2 text-gray-700">
              <Monitor className="w-4 h-4" />
              <span className="text-sm font-medium">Device & Browser</span>
            </div>
            <div className="text-sm text-gray-600">
              {browserName} on {osName}
            </div>
            {session?.ipAddress && (
              <div className="text-xs text-gray-500 mt-1">
                IP: {session.ipAddress}
              </div>
            )}
          </div>

          {/* Last Signed In */}
          <div className="flex flex-col gap-1 p-4 border border-gray-200 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 mb-2 text-gray-700">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Last Signed In</span>
            </div>
            <div className="text-sm text-gray-600">
              {formatDateTime(session?.createdAt)}
            </div>
          </div>

          {/* Session Expires */}
          <div className="flex flex-col gap-1 p-4 border border-gray-200 rounded-xl bg-gray-50">
            <div className="flex items-center gap-2 mb-2 text-gray-700">
              <CalendarDays className="w-4 h-4" />
              <span className="text-sm font-medium">Session Expires</span>
            </div>
            <div className="text-sm text-gray-600">
              {formatDateTime(session?.expiresAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mt-4">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <h3 className="text-base font-semibold text-red-800 mb-1">
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
                  className="bg-red-600 hover:bg-red-700 font-medium"
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
                    {deleteLoading ? "Deleting..." : "Yes, delete my account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
