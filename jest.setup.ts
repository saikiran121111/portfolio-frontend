import "@testing-library/jest-dom";

// Set React 19 act environment flag
// @ts-ignore - Runtime flag for React 19
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock Next.js router
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
    }),
    usePathname: () => "/",
    useSearchParams: () => new URLSearchParams(),
}));

// Mock matchMedia for cursor detection
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = jest.fn((cb: FrameRequestCallback) =>
    setTimeout(() => cb(Date.now()), 0) as unknown as number
);
global.cancelAnimationFrame = jest.fn((id: number) => clearTimeout(id));

// Mock window dimensions
Object.defineProperty(window, "innerWidth", { value: 1920, writable: true });
Object.defineProperty(window, "innerHeight", { value: 1080, writable: true });
