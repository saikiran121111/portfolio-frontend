import { apiUrl, paths, API_VERSION } from "@/config/api.config";

describe("API Config", () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    it("fails closed when API_BASE_URL is not set", () => {
        delete process.env.API_BASE_URL;
        const { apiUrl: reRequiredApiUrl } = require("@/config/api.config");
        expect(() => reRequiredApiUrl("/test")).toThrow("Backend API is not configured");
    });

    it("uses private API_BASE_URL when set", () => {
        process.env.API_BASE_URL = "https://custom-domain.com";
        const { apiUrl: reRequiredApiUrl } = require("@/config/api.config");
        expect(reRequiredApiUrl("/test")).toBe("https://custom-domain.com/test");
    });

    it("rejects credentials embedded in the backend URL", () => {
        process.env.API_BASE_URL = "https://user:password@custom-domain.com";
        const { apiUrl: reRequiredApiUrl } = require("@/config/api.config");
        expect(() => reRequiredApiUrl("/test")).toThrow("configuration is invalid");
    });

    it("export correct API_VERSION", () => {
        expect(API_VERSION).toBe(2);
    });

    it("paths.portfolio.user returns correct path", () => {
        expect(paths.portfolio.user()).toBe("/api/portfolio/user");
    });

    it("paths.portfolio.adminProfile returns correct path", () => {
        expect(paths.portfolio.adminProfile()).toBe("/api/portfolio/admin/profile");
    });
});
