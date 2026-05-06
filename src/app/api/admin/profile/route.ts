import { NextRequest, NextResponse } from "next/server";
import {
  IAdminPortfolioApi,
  IAdminPortfolioEditor,
} from "@/interfaces/admin.interface";
import { fetchBackendAdminProfile, updateBackendAdminProfile } from "@/lib/adminApi";
import {
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSession,
} from "@/lib/adminSession";
import {
  mapAdminPortfolioToEditor,
  mapEditorPortfolioToApi,
} from "@/lib/adminProfileTransforms";

export const runtime = "nodejs";

async function parseBackendJson<T>(response: Response): Promise<T | null> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!verifyAdminSession(token)) {
    return unauthorizedResponse();
  }

  try {
    const backendResponse = await fetchBackendAdminProfile();
    const payload =
      (await parseBackendJson<IAdminPortfolioApi | { error?: string }>(
        backendResponse,
      )) ?? null;

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          error:
            (payload as { error?: string } | null)?.error ??
            "Failed to load admin profile",
        },
        { status: backendResponse.status },
      );
    }

    if (!payload) {
      return NextResponse.json(
        { error: "No admin profile data was returned by the backend" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      mapAdminPortfolioToEditor(payload as IAdminPortfolioApi),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load admin profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!verifyAdminSession(token)) {
    return unauthorizedResponse();
  }

  try {
    const editorPayload = (await request.json()) as IAdminPortfolioEditor;
    const apiPayload = mapEditorPortfolioToApi(editorPayload);
    const backendResponse = await updateBackendAdminProfile(
      JSON.stringify(apiPayload),
    );
    const payload =
      (await parseBackendJson<IAdminPortfolioApi | { error?: string }>(
        backendResponse,
      )) ?? null;

    if (!backendResponse.ok) {
      return NextResponse.json(
        {
          error:
            (payload as { error?: string } | null)?.error ??
            "Failed to save admin profile",
        },
        { status: backendResponse.status },
      );
    }

    if (!payload) {
      return NextResponse.json(
        { error: "No updated admin profile data was returned by the backend" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      mapAdminPortfolioToEditor(payload as IAdminPortfolioApi),
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save admin profile";
    const status =
      message.includes("invalid JSON") || message.includes("valid datetime")
        ? 400
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
