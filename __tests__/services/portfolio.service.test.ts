import { fetchUserPortfolio } from "@/services/portfolio.service";
import * as config from "@/config/api.config";

// Mock fetch
global.fetch = jest.fn() as jest.Mock;

jest.mock("@/config/api.config", () => ({
    apiUrl: jest.fn((path) => `https://test.com${path}`),
    paths: {
        portfolio: {
            user: jest.fn(() => "/user"),
        },
    },
    API_VERSION: 1,
}));

describe("fetchUserPortfolio", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("fetches portfolio successfully", async () => {
        const mockData = { name: "Test User", experiences: [], education: [] };
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        await fetchUserPortfolio();

        expect(global.fetch).toHaveBeenCalledWith(
            "https://test.com/user",
            expect.objectContaining({
                headers: expect.objectContaining({
                    Version: "1",
                }),
            })
        );
    });

    it("throws error on non-ok response", async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        await expect(fetchUserPortfolio()).rejects.toThrow("Failed to fetch user portfolio: 500");
    });

    it("passes custom headers", async () => {
        const mockData = { name: "Test User", experiences: [], education: [] };
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        await fetchUserPortfolio({ headers: { "Authorization": "Bearer token" } });

        expect(global.fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: expect.objectContaining({
                    "Authorization": "Bearer token",
                }),
            })
        );
    });
});
