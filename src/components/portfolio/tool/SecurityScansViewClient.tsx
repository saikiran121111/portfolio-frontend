"use client";

import dynamic from "next/dynamic";

const SecurityScansView = dynamic(() => import("./SecurityScansView"), { ssr: false });

export default function SecurityScansViewClient() {
  return <SecurityScansView />;
}
