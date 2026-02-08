"use client";

import RouteGuard from "@/components/guards/RouteGuard";

interface ToolsGuardWrapperProps {
    children: React.ReactNode;
}

export default function ToolsGuardWrapper({ children }: ToolsGuardWrapperProps) {
    return <RouteGuard route="/tools">{children}</RouteGuard>;
}
