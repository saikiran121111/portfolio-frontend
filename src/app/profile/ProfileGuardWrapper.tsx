"use client";

import RouteGuard from "@/components/guards/RouteGuard";

interface ProfileGuardWrapperProps {
    children: React.ReactNode;
}

export default function ProfileGuardWrapper({ children }: ProfileGuardWrapperProps) {
    return <RouteGuard route="/profile">{children}</RouteGuard>;
}
