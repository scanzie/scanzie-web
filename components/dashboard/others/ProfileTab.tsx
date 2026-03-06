import { User } from "better-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Input } from "../../ui/input";
import { BadgeCheck, Edit, AlertTriangle } from "lucide-react";
import { Button } from "../../ui/button";
import { getInitials } from "@/utils/profile";

interface ProfileTabProps {
  user: User | undefined;
  userDateJoined: string;
  name: string;
  nameError: string;
  loading: boolean;
  isUpdateDisabled: boolean;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdate: () => void;
}

export function ProfileTab({
  user,
  userDateJoined,
  name,
  nameError,
  loading,
  isUpdateDisabled,
  handleNameChange,
  handleUpdate,
}: ProfileTabProps) {
  return (
    <div className="grid md:grid-cols-2 gap-2">
      <div className="grid gap-6 md:w-sm">
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
            <label className="text-sm font-medium text-gray-700">
              Email
            </label>
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
      </div>
    </div>
  );
}
