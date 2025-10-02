import { backendUrl } from "@/utils/constants";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const cookieHeader = (await headers()).get("cookie") ?? "";

  const res = await fetch(`${backendUrl}/api/account`, {
    headers: { cookie: cookieHeader },
    cache: "no-store",
  });

  if (res.status === 401) redirect("/login");

  if (!res.ok) {
    const body = await res.text();
    console.error(
      "Backend /api/account failed:",
      res.status,
      body.slice(0, 300)
    );
    redirect("/login");
  }

  const contentType = res.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    const body = await res.text();
    console.error(
      "Expected JSON from backend, got:",
      contentType,
      body.slice(0, 300)
    );
    redirect("/login");
  }

  const me = await res.json();
  if (me?.needsOnboarding) redirect("/onboarding");

  let orgName = "Unknown Organization";
  if (me.organizationId) {
    try {
      const orgRes = await fetch(
        `${backendUrl}/api/organizations/${me.organizationId}`,
        {
          headers: { cookie: cookieHeader },
          cache: "no-store",
        }
      );
      if (orgRes.ok) {
        const org = await orgRes.json();
        orgName = org.name;
      }
    } catch (error) {
      console.error("Failed to fetch organization:", error);
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-lg bg-card p-6 shadow">
          <h1 className="text-3xl font-bold text-card-foreground mb-4">
            Welcome, {me.name}!
          </h1>

          <div className="space-y-2 text-muted-foreground">
            <p>
              <span className="font-medium text-card-foreground">Email:</span>{" "}
              {me.email}
            </p>
            <p>
              <span className="font-medium text-card-foreground">
                Organization:
              </span>{" "}
              {orgName}
            </p>
            <p>
              <span className="font-medium text-card-foreground">Role:</span>{" "}
              {me.role || "No role assigned"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
