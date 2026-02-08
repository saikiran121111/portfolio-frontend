
import { GET } from "@/app/api/download-resume/route";
import { NextResponse } from "next/server";

// Mock fetch globally
global.fetch = jest.fn();

// Mock NextResponse
jest.mock("next/server", () => {
    return {
        NextResponse: class {
            constructor(body: any, init?: any) {
                this.body = body;
                this.init = init;
                this.headers = new Map(Object.entries(init?.headers || {}));
                this.status = init?.status || 200;
            }
            static json(body: any, init?: any) {
                return {
                    json: async () => body,
                    status: init?.status || 200,
                    headers: new Map(),
                };
            }
            json() {
                return Promise.resolve(JSON.parse(JSON.stringify(this.body)));
            }
        },
    };
});

describe("Download Resume API", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("returns PDF on success", async () => {
        const mockBuffer = new ArrayBuffer(10);
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            arrayBuffer: async () => mockBuffer,
        });

        const response = await GET();

        expect(response).toBeInstanceOf(NextResponse);
        expect(response.status).toBe(200);
        expect(response.headers.get("Content-Type")).toBe("application/pdf");
    });

    it("handles fetch failure", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
        });

        const response = await GET();

        expect(response.status).toBe(500);
        const data = await response.json();
        expect(data).toHaveProperty("error", "Failed to fetch resume");
    });

    it("handles exception", async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

        const response = await GET();

        expect(response.status).toBe(500);
        const data = await response.json();
        expect(data).toHaveProperty("error", "Download failed");
    });
});
