import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar"

// Protected layout wraps pages that require auth.
// Authentication and onboarding flow are handled by middleware.
export default function ProtectedLayout({
                                            children,
                                        }: {
    children: ReactNode;
}) {
    return (
        <SidebarProvider>
            <AppSidebar />
            {children}
        </SidebarProvider>
    )
}
