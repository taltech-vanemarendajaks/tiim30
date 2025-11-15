"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Store,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const dynamic = "force-dynamic";

interface CurrentUser {
  id: number | string;
  email: string;
  name?: string;
  organizationId?: number;
  needsOnboarding: boolean;
  role?: string;
}

interface BarStation {
  id: number;
  organizationId: number;
  name: string;
  description?: string;
  isActive: boolean;
  assignedUsers?: User[];
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export default function POSManagement() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [stations, setStations] = useState<BarStation[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userFetchError, setUserFetchError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<BarStation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formUserIds, setFormUserIds] = useState<string[]>([]);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch("/api/backend/account");
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
        return data;
      }
    } catch (err) {
      console.error("Error fetching current user:", err);
    }
    return null;
  };

  const fetchStations = useCallback(
    async (isAdmin: boolean) => {
      try {
        const url = isAdmin
          ? "/api/backend/bar-stations"
          : "/api/backend/bar-stations/user";

        const response = await fetch(url, { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Failed to fetch stations");
        }

        const data = await response.json();
        setStations(data);

        // If non-admin with single station, auto-redirect
        if (!isAdmin && data.length === 1) {
          router.push(`/pos/${data[0].id}`);
          return;
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/backend/users", { cache: "no-store" });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch users");
      }

      const data = await response.json();
      setAllUsers(data);
      setUserFetchError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch users";
      console.error("Error fetching users:", err);
      setAllUsers([]);
      setUserFetchError(message);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const user = await fetchCurrentUser();
      if (user) {
        const isAdmin = user.role === "ADMIN";
        await fetchStations(isAdmin);

        if (isAdmin) {
          await fetchAllUsers();
        }
      }
    };

    init();
  }, [fetchStations, fetchAllUsers]);

  const handleCreateStation = async () => {
    if (!formName.trim()) {
      alert("Station name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/backend/bar-stations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName,
          description: formDescription,
          isActive: true,
          userIds: formUserIds,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create station");
      }

      setIsCreateDialogOpen(false);
      setFormName("");
      setFormDescription("");
      setFormUserIds([]);

      // Refresh stations
      await fetchStations(true);
    } catch (err) {
      alert(
        `Error creating station: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStation = async () => {
    if (!editingStation || !formName.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/backend/bar-stations/${editingStation.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formName,
            description: formDescription,
            isActive: true,
            userIds: formUserIds,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update station");
      }

      setEditingStation(null);
      setFormName("");
      setFormDescription("");
      setFormUserIds([]);

      await fetchStations(true);
    } catch (err) {
      alert(
        `Error updating station: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStation = async (stationId: number) => {
    if (!confirm("Are you sure you want to delete this station?")) {
      return;
    }

    try {
      const response = await fetch(`/api/backend/bar-stations/${stationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete station");
      }

      await fetchStations(true);
    } catch (err) {
      alert(
        `Error deleting station: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const openEditDialog = (station: BarStation) => {
    setEditingStation(station);
    setFormName(station.name);
    setFormDescription(station.description || "");
    setFormUserIds(
      station.assignedUsers?.map((u: User) => u.id.toString()) || []
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-xl text-gray-100 mb-2">{error}</p>
        </div>
      </div>
    );
  }

  const isAdmin = currentUser?.role === "ADMIN";

  // Non-admin with no stations
  if (!isAdmin && stations.length === 0) {
    return (
      <div className="min-h-screen w-full bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-100 mb-2">
            You have not been assigned to any station
          </p>
          <p className="text-sm text-gray-400">
            Please contact your administrator to get access to a POS station.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="rounded-lg bg-card p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-100">
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
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Station
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Station</DialogTitle>
                    <DialogDescription>
                      Add a new POS station for your organization
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <Label htmlFor="name">Station Name *</Label>
                      <Input
                        id="name"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g., Main Bar"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={formDescription}
                        onChange={(e) => setFormDescription(e.target.value)}
                        placeholder="Optional description"
                      />
                    </div>
                    <div>
                      <Label>Assign Users</Label>
                      <div className="mt-2 max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
                        {userFetchError ? (
                          <p className="text-sm text-red-400">
                            {userFetchError}
                          </p>
                        ) : allUsers.length === 0 ? (
                          <p className="text-sm text-gray-400">
                            No users available
                          </p>
                        ) : (
                          allUsers.map((user) => {
                            const isChecked = formUserIds.includes(
                              user.id.toString()
                            );
                            return (
                              <div
                                key={user.id}
                                className="flex items-center gap-2 cursor-pointer hover:bg-gray-700/50 p-2 rounded"
                              >
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setFormUserIds([
                                        ...formUserIds,
                                        user.id.toString(),
                                      ]);
                                    } else {
                                      setFormUserIds(
                                        formUserIds.filter(
                                          (id) => id !== user.id.toString()
                                        )
                                      );
                                    }
                                  }}
                                />
                                <span className="text-sm text-gray-200">
                                  {user.name || user.email}
                                </span>
                                {user.role && (
                                  <span className="text-xs text-gray-400">
                                    ({user.role})
                                  </span>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCreateStation}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? "Creating..." : "Create"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsCreateDialogOpen(false);
                          setFormName("");
                          setFormDescription("");
                          setFormUserIds([]);
                        }}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stations.map((station) => (
            <div
              key={station.id}
              className="bg-card p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-100 mb-1">
                    {station.name}
                  </h3>
                  {station.description && (
                    <p className="text-sm text-gray-400">
                      {station.description}
                    </p>
                  )}
                </div>
                <Store className="w-5 h-5 text-blue-400 flex-shrink-0 ml-2" />
              </div>

              {station.assignedUsers && station.assignedUsers.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-1">Assigned Users:</p>
                  <div className="flex flex-wrap gap-1">
                    {station.assignedUsers.slice(0, 3).map((user: User) => (
                      <span
                        key={user.id}
                        className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded"
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

              <div className="flex gap-2">
                <Button
                  onClick={() => router.push(`/pos/${station.id}`)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Open Station
                </Button>

                {isAdmin && (
                  <>
                    <Dialog
                      open={editingStation?.id === station.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setEditingStation(null);
                          setFormName("");
                          setFormDescription("");
                          setFormUserIds([]);
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditDialog(station)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Station</DialogTitle>
                          <DialogDescription>
                            Update station details
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label htmlFor="edit-name">Station Name *</Label>
                            <Input
                              id="edit-name"
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="edit-description">
                              Description
                            </Label>
                            <Input
                              id="edit-description"
                              value={formDescription}
                              onChange={(e) =>
                                setFormDescription(e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <Label>Assign Users</Label>
                            <div className="mt-2 max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
                              {userFetchError ? (
                                <p className="text-sm text-red-400">
                                  {userFetchError}
                                </p>
                              ) : allUsers.length === 0 ? (
                                <p className="text-sm text-gray-400">
                                  No users available
                                </p>
                              ) : (
                                allUsers.map((user) => {
                                  const isChecked = formUserIds.includes(
                                    user.id.toString()
                                  );
                                  return (
                                    <div
                                      key={user.id}
                                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-700/50 p-2 rounded"
                                      onClick={() => {
                                        if (isChecked) {
                                          setFormUserIds(
                                            formUserIds.filter(
                                              (id) => id !== user.id.toString()
                                            )
                                          );
                                        } else {
                                          setFormUserIds([
                                            ...formUserIds,
                                            user.id.toString(),
                                          ]);
                                        }
                                      }}
                                    >
                                      <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={(checked) => {
                                          if (checked) {
                                            setFormUserIds([
                                              ...formUserIds,
                                              user.id.toString(),
                                            ]);
                                          } else {
                                            setFormUserIds(
                                              formUserIds.filter(
                                                (id) =>
                                                  id !== user.id.toString()
                                              )
                                            );
                                          }
                                        }}
                                      />
                                      <span className="text-sm text-gray-200">
                                        {user.name || user.email}
                                      </span>
                                      {user.role && (
                                        <span className="text-xs text-gray-400">
                                          ({user.role})
                                        </span>
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={handleUpdateStation}
                              disabled={isSubmitting}
                              className="flex-1"
                            >
                              {isSubmitting ? "Saving..." : "Save"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingStation(null);
                                setFormName("");
                                setFormDescription("");
                                setFormUserIds([]);
                              }}
                              disabled={isSubmitting}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteStation(station.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {stations.length === 0 && isAdmin && (
          <div className="text-center py-12">
            <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-100 mb-2">No stations yet</p>
            <p className="text-sm text-gray-400 mb-4">
              Create your first POS station to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
