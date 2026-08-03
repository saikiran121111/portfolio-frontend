import type { Metadata } from "next";
import UpdateProfileClient from "@/components/admin/UpdateProfileClient";

export const metadata: Metadata = {
  title: "Update Profile",
  description: "Secure admin editor for updating portfolio profile data",
  robots: { index: false, follow: false, nocache: true },
};

export default function UpdateProfilePage() {
  return (
    <main id="main-content" className="admin-shell" tabIndex={-1}>
      <div className="admin-content-shell py-12 sm:py-16">
        <UpdateProfileClient />
      </div>
    </main>
  );
}
