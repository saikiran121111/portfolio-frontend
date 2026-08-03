import { GET } from "@/app/api/wake-up/route";
import { NextRequest } from "next/server";

global.fetch = jest.fn();

jest.mock("next/server", () => ({
    NextRequest: class {
        headers: Map<string, string>;
        constructor(_url: string, init?: { headers?: Record<string, string> }) {
            this.headers = new Map(Object.entries(init?.headers || {}));
        }
    },
    NextResponse: class {
        static json(body: unknown, init?: ResponseInit) {
            return {
                json: async () => body,
                status: init?.status || 200,
                headers: new Map(Object.entries(init?.headers || {})),
            };
        }
    },
}));

const CRON_SECRET = "cron-secret-long-enough";

function createRequest(secret = CRON_SECRET): NextRequest {
    return new NextRequest("http://localhost/api/wake-up", {
        headers: { authorization: `Bearer ${secret}` },
    });
}

describe("Wake-Up API", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ legacyFakeTimers: false });
        process.env = {
            ...originalEnv,
            API_BASE_URL: "https://test-backend.onrender.com",
            CRON_SECRET,
        };
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it("returns 200 on the first successful authenticated probe", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({ status: 200, ok: true });

        const response = await GET(createRequest());

        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(global.fetch).toHaveBeenCalledWith(
            "https://test-backend.onrender.com/health",
            expect.objectContaining({
                cache: "no-store",
                credentials: "omit",
                redirect: "error",
            }),
        );
        expect(response.status).toBe(200);
        const data = await response.json();
        expect(data.status).toBe("ok");
        expect(data.backendStatus).toBe(200);
        expect(data.attempts).toHaveLength(1);
    });

    it("retries twice before succeeding", async () => {
        (global.fetch as jest.Mock)
            .mockResolvedValueOnce({ status: 503, ok: false })
            .mockResolvedValueOnce({ status: 503, ok: false })
            .mockResolvedValueOnce({ status: 200, ok: true });

        const responsePromise = GET(createRequest());
        await jest.advanceTimersByTimeAsync(2_000);
        await jest.advanceTimersByTimeAsync(2_000);
        const response = await responsePromise;

        expect(global.fetch).toHaveBeenCalledTimes(3);
        expect(response.status).toBe(200);
        expect((await response.json()).attempts).toHaveLength(3);
    });

    it("returns 503 after three failed probes", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({ status: 503, ok: false });

        const responsePromise = GET(createRequest());
        await jest.advanceTimersByTimeAsync(2_000);
        await jest.advanceTimersByTimeAsync(2_000);
        const response = await responsePromise;

        expect(global.fetch).toHaveBeenCalledTimes(3);
        expect(response.status).toBe(503);
        expect((await response.json()).attempts).toHaveLength(3);
    });

    it("records network failures without exposing the backend URL", async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

        const responsePromise = GET(createRequest());
        await jest.advanceTimersByTimeAsync(2_000);
        await jest.advanceTimersByTimeAsync(2_000);
        const response = await responsePromise;
        const data = await response.json();

        expect(response.status).toBe(503);
        expect(data.attempts[0].status).toBe(0);
        expect(JSON.stringify(data)).not.toContain("test-backend.onrender.com");
    });

    it("fails closed when backend configuration is missing", async () => {
        delete process.env.API_BASE_URL;
        const response = await GET(createRequest());

        expect(response.status).toBe(503);
        expect(await response.json()).toEqual({ error: "Service unavailable" });
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it("fails closed when cron secret is missing", async () => {
        delete process.env.CRON_SECRET;
        const response = await GET(createRequest());

        expect(response.status).toBe(503);
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it("rejects missing or wrong credentials", async () => {
        const missing = new NextRequest("http://localhost/api/wake-up");
        const missingResponse = await GET(missing);
        const wrongResponse = await GET(createRequest("wrong-secret"));

        expect(missingResponse.status).toBe(401);
        expect(wrongResponse.status).toBe(401);
        expect(global.fetch).not.toHaveBeenCalled();
    });
});
