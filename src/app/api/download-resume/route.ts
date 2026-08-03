import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getResumeSourceUrl } from "@/config/resource.config";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";

export const runtime = "nodejs";

const RESUME_TIMEOUT_MS = 15_000;
const RESUME_MAX_BYTES = 10 * 1024 * 1024;

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}

export async function GET(request: NextRequest) {
  try {
    const response = await fetchWithTimeout(getResumeSourceUrl(), {
      credentials: "omit",
      redirect: "follow",
      next: { revalidate: 3600 },
    }, RESUME_TIMEOUT_MS);

    if (!response.ok) {
      return errorResponse("Failed to fetch resume", 502);
    }

    const declaredLength = Number(response.headers.get("content-length") ?? 0);
    if (declaredLength > RESUME_MAX_BYTES) {
      return errorResponse("Resume file is too large", 502);
    }

    const pdfBuffer = await response.arrayBuffer();
    if (pdfBuffer.byteLength > RESUME_MAX_BYTES) {
      return errorResponse("Resume file is too large", 502);
    }

    const signature = Buffer.from(pdfBuffer.slice(0, 5)).toString("ascii");
    if (signature !== "%PDF-") {
      return errorResponse("Invalid resume file", 502);
    }

    const inline = request.nextUrl.searchParams.get("view") === "1";

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="SaiKiran_Resume.pdf"`,
        "Content-Length": pdfBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "Content-Security-Policy": "sandbox; frame-ancestors 'self'",
        "Cross-Origin-Resource-Policy": "same-origin",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
      },
    });
  } catch {
    console.error("[resume] Resume delivery failed");
    return errorResponse("Download failed", 502);
  }
}
