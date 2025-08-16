"use client";

import dynamic from "next/dynamic";
import type { IscanReports } from "@/interfaces/user.interface";

const SecurityScansView = dynamic(() => import("./SecurityScansView"), { ssr: false });

export default function SecurityScansViewClient({ initialReports }: { initialReports?: IscanReports[] }) {
  return <SecurityScansView initialReports={initialReports} />;
}
