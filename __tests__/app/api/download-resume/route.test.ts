
import { GET } from "@/app/api/download-resume/route";
import { NextResponse } from "next/server";

// Mock fetch globally
global.fetch = jest.fn();

const resumeRequest = (query = "") => ({
    nextUrl: { searchParams: new URLSearchParams(query) },
}) as Parameters<typeof GET>[0];

// Mock NextResponse
jest.mock("next/server", () => {
    return {
        NextResponse: class {
            body: any;
            init?: any;
            headers: Map<string, unknown>;
            status: number;
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
    const originalResumeSource = process.env.RESUME_SOURCE_URL;

    beforeEach(() => {
        jest.clearAllMocks();
        process.env.RESUME_SOURCE_URL = "https://files.example/resume.pdf";
    });

    afterAll(() => {
        if (originalResumeSource === undefined) delete process.env.RESUME_SOURCE_URL;
        else process.env.RESUME_SOURCE_URL = originalResumeSource;
    });

    function validPdfBuffer() {
        return Uint8Array.from(Buffer.from("%PDF-test-file")).buffer;
    }

    it("returns PDF on success", async () => {
        const mockBuffer = validPdfBuffer();
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            headers: new Headers({ "content-length": String(mockBuffer.byteLength) }),
            arrayBuffer: async () => mockBuffer,
        });

        const response = await GET(resumeRequest());

        expect(response).toBeInstanceOf(NextResponse);
        expect(response.status).toBe(200);
        expect(response.headers.get("Content-Type")).toBe("application/pdf");
        expect(response.headers.get("Content-Disposition")).toContain("attachment");
        expect(response.headers.get("X-Frame-Options")).toBe("SAMEORIGIN");
    });

    it("serves the PDF inline for the resume viewer", async () => {
        const mockBuffer = validPdfBuffer();
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            headers: new Headers({ "content-length": String(mockBuffer.byteLength) }),
            arrayBuffer: async () => mockBuffer,
        });

        const response = await GET(resumeRequest("view=1"));

        expect(response.headers.get("Content-Disposition")).toContain("inline");
    });

    it("handles fetch failure", async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            headers: new Headers(),
        });

        const response = await GET(resumeRequest());

        expect(response.status).toBe(502);
        const data = await response.json();
        expect(data).toHaveProperty("error", "Failed to fetch resume");
    });

    it("handles exception", async () => {
        (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

        const response = await GET(resumeRequest());

        expect(response.status).toBe(502);
        const data = await response.json();
        expect(data).toHaveProperty("error", "Download failed");
    });

    it("rejects non-PDF upstream content", async () => {
        const mockBuffer = Uint8Array.from(Buffer.from("<html>bad</html>")).buffer;
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
            headers: new Headers(),
            arrayBuffer: async () => mockBuffer,
        });

        const response = await GET(resumeRequest());

        expect(response.status).toBe(502);
        expect(await response.json()).toHaveProperty("error", "Invalid resume file");
    });
});
