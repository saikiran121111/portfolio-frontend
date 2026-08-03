import RootLayout, { metadata } from "@/app/layout";

jest.mock("next/font/google", () => ({
  Manrope: () => ({ variable: "font-body" }),
  Space_Grotesk: () => ({ variable: "font-display" }),
}));

describe("RootLayout", () => {
  it("creates the semantic document shell", () => {
    const tree = RootLayout({ children: <main>Portfolio content</main> });
    expect(tree.type).toBe("html");
    expect(tree.props.lang).toBe("en");
    expect(tree.props["data-theme"]).toBe("dark");
    expect(tree.props.children.type).toBe("body");
  });

  it("exports portfolio metadata", () => {
    expect(metadata).toHaveProperty("title");
    expect(metadata).toHaveProperty("description");
  });
});
