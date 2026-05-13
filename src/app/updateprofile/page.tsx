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
      <div className="fixed inset-0 z-40 pointer-events-none">
        <Logo
          className="text-white hover:text-cyan-400"
          size={56}
          xsSize={44}
          tabletSize={52}
          desktopSize={56}
          xsOffsetX={-2}
          xsOffsetY={10}
          offsetX={-2}
          offsetY={16}
          tabletOffsetX={-4}
          tabletOffsetY={28}
          desktopOffsetX={-6}
          desktopOffsetY={42}
          xlOffsetY={42}
          v="top"
          h="left"
          minLeftPx={22}
          xlMinLeftPx={100}
          desktopMinLeftPx={100}
          tabletMinLeftPx={30}
          xsMinLeftPx={10}
          introGate={false}
          mobileShell={false}
        />
      </div>

      <div className="container mx-auto max-w-6xl px-4 pb-10 pt-[calc(var(--safe-top)+6rem)] sm:pb-10 sm:pt-[calc(var(--safe-top)+6.25rem)]">
        <UpdateProfileClient />
      </div>
    </div>
  );
}
