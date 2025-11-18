"use client";

import { Plus } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StationDialog } from "./StationDialog";
import { User } from "./types";

interface StationManagementHeaderProps {
  isAdmin: boolean;
  isCreateDialogOpen: boolean;
  onCreateDialogOpenChange: (open: boolean) => void;
  allUsers: User[];
  userFetchError: string | null;
  onCreate: (data: {
    name: string;
    description: string;
    userIds: string[];
  }) => Promise<void>;
}

export function StationManagementHeader({
  isAdmin,
  isCreateDialogOpen,
  onCreateDialogOpenChange,
  allUsers,
  userFetchError,
  onCreate,
}: StationManagementHeaderProps) {
  return (
    <div className="rounded-lg bg-card p-4 sm:p-6 shadow-sm mb-4 sm:mb-6 border-1 border-[color-mix(in oklab, var(--ring) 50%, transparent)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 truncate">
              {isAdmin ? "POS Station Management" : "Select POS Station"}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {isAdmin
                ? "Manage your bar stations and assign users"
                : "Choose a station to start selling"}
            </p>
          </div>
        </div>

        {isAdmin && (
          <div className="w-full sm:w-auto flex-shrink-0">
            <StationDialog
              mode="create"
              users={allUsers}
              userFetchError={userFetchError}
              isOpen={isCreateDialogOpen}
              onOpenChange={onCreateDialogOpenChange}
              onSubmit={onCreate}
              trigger={
                <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-white">
                  <Plus className="w-4 h-4" />
                  Create Station
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}

