import type { Metadata } from "next";
import Logo from "@/components/portfolio/logo/Logo";
import UpdateProfileClient from "@/components/admin/UpdateProfileClient";

export const metadata: Metadata = {
  title: "Update Profile",
  description: "Secure admin editor for updating portfolio profile data",
};

export default function UpdateProfilePage() {
  return (
    <div className="relative min-h-dvh">
      <div className="fixed inset-0 pointer-events-none">
        <Logo
          className="text-white hover:text-cyan-400"
          size={45}
          xsOffsetX={-2}
          xsOffsetY={30}
          offsetX={-2}
          offsetY={75}
          tabletOffsetX={-4}
          tabletOffsetY={70}
          desktopOffsetX={-6}
          desktopOffsetY={75}
          xlOffsetY={75}
          v="top"
          h="left"
          minLeftPx={30}
          xlMinLeftPx={100}
          desktopMinLeftPx={100}
          tabletMinLeftPx={30}
          xsMinLeftPx={8}
          introGate={false}
        />
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-10">
        <UpdateProfileClient />
      </div>
    </div>
  );
}
