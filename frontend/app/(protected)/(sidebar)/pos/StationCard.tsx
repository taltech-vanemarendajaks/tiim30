"use client";

import { useRouter } from "next/navigation";
import { Edit, Trash2, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StationDialog } from "./StationDialog";
import { BarStation, User } from "./types";

interface StationCardProps {
  station: BarStation;
  isAdmin: boolean;
  allUsers: User[];
  userFetchError: string | null;
  editingStationId: number | null;
  onEditClick: (station: BarStation) => void;
  onEditClose: () => void;
  onUpdate: (data: {
    name: string;
    description: string;
    userIds: string[];
  }) => Promise<void>;
  onDelete: (stationId: number) => void;
}

export function StationCard({
  station,
  isAdmin,
  allUsers,
  userFetchError,
  editingStationId,
  onEditClick,
  onEditClose,
  onUpdate,
  onDelete,
}: StationCardProps) {
  const router = useRouter();

  return (
    <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow w-full max-w-full overflow-hidden border-1 border-[color-mix(in oklab, var(--ring) 50%, transparent)]">
      <div className="flex items-start justify-between mb-3 gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-bold text-gray-100 mb-1 truncate">
            {station.name}
          </h3>
          {station.description && (
            <p className="text-sm text-gray-400 line-clamp-2 break-words">
              {station.description}
            </p>
          )}
        </div>
        <Store className="w-5 h-5 text-blue-400 flex-shrink-0" />
      </div>

      {station.assignedUsers && station.assignedUsers.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-1">Assigned Users:</p>
          <div className="flex flex-wrap gap-1">
            {station.assignedUsers.slice(0, 3).map((user: User) => (
              <span
                key={user.id}
                className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded truncate max-w-full"
              >
                {user.name || user.email}
              </span>
            ))}
            {station.assignedUsers.length > 3 && (
              <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                +{station.assignedUsers.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <Button
          onClick={() => router.push(`/pos/${station.id}`)}
          className="flex-1 w-full sm:w-auto bg-green-600 hover:bg-green-700 min-w-0"
        >
          <span className="truncate">Open Station</span>
        </Button>

        {isAdmin && (
          <div className="flex gap-2 flex-shrink-0">
            <StationDialog
              mode="edit"
              station={station}
              users={allUsers}
              userFetchError={userFetchError}
              isOpen={editingStationId === station.id}
              onOpenChange={(open) => {
                if (!open) {
                  onEditClose();
                } else {
                  onEditClick(station);
                }
              }}
              onSubmit={onUpdate}
              trigger={
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEditClick(station)}
                  className="flex-shrink-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              }
            />

            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(station.id)}
              className="flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
