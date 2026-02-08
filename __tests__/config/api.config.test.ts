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

    it("uses default domain when env var is not set", () => {
        delete process.env.NEXT_PUBLIC_API_DOMAIN;
        // Re-require to pick up the env change
        const { apiUrl: reRequiredApiUrl } = require("@/config/api.config");
        expect(reRequiredApiUrl("/test")).toBe("https://portfolio-be-nes-js.onrender.com/test");
    });

    it("uses NEXT_PUBLIC_API_DOMAIN when set", () => {
        process.env.NEXT_PUBLIC_API_DOMAIN = "https://custom-domain.com";
        const { apiUrl: reRequiredApiUrl } = require("@/config/api.config");
        expect(reRequiredApiUrl("/test")).toBe("https://custom-domain.com/test");
    });

    it("export correct API_VERSION", () => {
        expect(API_VERSION).toBe(2);
    });

    it("paths.portfolio.user returns correct path", () => {
        expect(paths.portfolio.user()).toBe("/api/portfolio/user");
    });
});
