import type { Metadata } from "next";
import UpdateProfileClient from "@/components/admin/UpdateProfileClient";

export const metadata: Metadata = {
  title: "Admin Resume",
  description: "Secure admin editor for updating portfolio resume data",
};

export default function AdminResumePage() {
  return (
    <main id="main-content" className="admin-shell" tabIndex={-1}>
      <div className="admin-content-shell py-12 sm:py-16">
        <UpdateProfileClient />
      </div>
    </main>
  );
}
