"use client";

import dynamic from "next/dynamic";

const ProfileView = dynamic(() => import("./ProfileView"), { ssr: false });

export default function ProfileViewClient() {
  return <ProfileView />;
}
