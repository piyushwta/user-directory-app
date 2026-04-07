import { Eye } from "lucide-react";
import clsx from "clsx";
import type { User } from "../../../types/user.types";

interface Props {
  user: User;
  onSelect: (user: User) => void;
}

export const UserCard = ({ user, onSelect }: Props) => {
  return (
    <div
      onClick={() => onSelect(user)}
      className="group cursor-pointer rounded-2xl border bg-white p-4 shadow-sm transition-all hover:shadow-md hover:border-gray-300"
    >
      {/* Top Section */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            {user.name}
          </h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        {/* Action Icon */}
        <div className="opacity-0 group-hover:opacity-100 transition">
          <Eye className="h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Meta Info */}
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        {/* Role Badge */}
        <span
          className={clsx(
            "px-2 py-1 text-xs font-medium rounded-full",
            {
              "bg-blue-100 text-blue-700": user.role === "Admin",
              "bg-purple-100 text-purple-700": user.role === "Editor",
              "bg-gray-100 text-gray-700": user.role === "Viewer",
            }
          )}
        >
          {user.role}
        </span>

        {/* Status Badge */}
        <span
          className={clsx(
            "px-2 py-1 text-xs font-medium rounded-full",
            {
              "bg-green-100 text-green-700": user.status === "Active",
              "bg-red-100 text-red-700": user.status === "Inactive",
            }
          )}
        >
          {user.status}
        </span>

        {/* Language */}
        <span className="text-xs text-gray-500">
          {user.language}
        </span>
      </div>

      {/* Bottom CTA */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation(); // prevent parent click
            onSelect(user);
          }}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View Details →
        </button>
      </div>
    </div>
  );
};