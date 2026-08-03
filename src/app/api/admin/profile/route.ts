import { NextRequest } from "next/server";
import { IAdminPortfolioApi } from "@/interfaces/admin.interface";
import { fetchBackendAdminProfile, updateBackendAdminProfile } from "@/lib/adminApi";
import {
  ADMIN_SESSION_COOKIE_NAME,
  verifyAdminSession,
} from "@/lib/adminSession";
import {
  mapAdminPortfolioToEditor,
  mapEditorPortfolioToApi,
} from "@/lib/adminProfileTransforms";
import { validateAdminProfileUpdate } from "@/lib/adminProfileValidation";
import {
  privateJson,
  readBoundedJson,
  requireSameOrigin,
} from "@/lib/adminRequestSecurity";

export const runtime = "nodejs";

const PROFILE_BODY_MAX_BYTES = 512 * 1024;

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
  return privateJson({ error: "Unauthorized" }, { status: 401 });
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
      return privateJson(
        { error: "Failed to load admin profile" },
        { status: backendResponse.status },
      );
    }

    if (!payload) {
      return privateJson(
        { error: "No admin profile data was returned by the backend" },
        { status: 404 },
      );
    }

    return privateJson(
      mapAdminPortfolioToEditor(payload as IAdminPortfolioApi),
    );
  } catch {
    console.error("[admin/profile] Profile load failed");
    return privateJson({ error: "Failed to load admin profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!verifyAdminSession(token)) {
    return unauthorizedResponse();
  }

  const originFailure = requireSameOrigin(request);
  if (originFailure) return originFailure;

  try {
    const parsedBody = await readBoundedJson(request, PROFILE_BODY_MAX_BYTES);
    if (!parsedBody.ok) return parsedBody.response;
    const submittedPayload = parsedBody.value;

    const currentResponse = await fetchBackendAdminProfile();
    const currentPayload =
      (await parseBackendJson<IAdminPortfolioApi | { error?: string }>(currentResponse)) ?? null;

    if (!currentResponse.ok || !currentPayload) {
      return privateJson(
        { error: "Failed to load current profile before saving" },
        { status: currentResponse.ok ? 502 : currentResponse.status },
      );
    }

    const currentEditor = mapAdminPortfolioToEditor(currentPayload as IAdminPortfolioApi);
    const validation = validateAdminProfileUpdate(submittedPayload, currentEditor);
    if (!validation.success || !validation.data) {
      return privateJson(
        { error: "Profile validation failed", fieldErrors: validation.fieldErrors },
        { status: 400 },
      );
    }

    const apiPayload = mapEditorPortfolioToApi(validation.data);
    const backendResponse = await updateBackendAdminProfile(
      JSON.stringify(apiPayload),
    );
    const payload =
      (await parseBackendJson<IAdminPortfolioApi | { error?: string }>(
        backendResponse,
      )) ?? null;

    if (!backendResponse.ok) {
      return privateJson(
        { error: "Failed to save admin profile" },
        { status: backendResponse.status },
      );
    }

    if (!payload) {
      return privateJson(
        { error: "No updated admin profile data was returned by the backend" },
        { status: 500 },
      );
    }

    return privateJson(
      mapAdminPortfolioToEditor(payload as IAdminPortfolioApi),
    );
  } catch {
    console.error("[admin/profile] Profile save failed");
    return privateJson({ error: "Failed to save admin profile" }, { status: 500 });
  }
}
