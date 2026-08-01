import type { Metadata } from "next";
import UpdateProfileClient from "@/components/admin/UpdateProfileClient";

export const metadata: Metadata = {
  title: "Update Profile",
  description: "Secure admin editor for updating portfolio profile data",
};

export default function UpdateProfilePage() {
  return (
    <main id="main-content" className="admin-shell" tabIndex={-1}>
      <div className="container mx-auto max-w-6xl px-4 py-12 sm:py-16">
        <UpdateProfileClient />
      </div>
    </main>
  );
}
