import { describe, expect, it } from "vitest";
import { SITE_CONTACT, WA_DEFAULT_MESSAGE, waLink } from "./site-contact";

describe("waLink", () => {
  it("returns a wa.me URL for the configured number", () => {
    const url = waLink();
    expect(url.startsWith(`https://wa.me/${SITE_CONTACT.phone.waNumber}`)).toBe(true);
  });

  it("never routes to an internal page (Contact WhatsApp bug guard)", () => {
    const url = waLink();
    expect(url).not.toContain("/invata");
    expect(url.startsWith("https://wa.me/")).toBe(true);
  });

  it("encodes a custom message into the text query param", () => {
    const url = waLink("Salut, am o întrebare");
    expect(url).toContain(`?text=${encodeURIComponent("Salut, am o întrebare")}`);
  });

  it("uses the professional default message", () => {
    expect(WA_DEFAULT_MESSAGE).toContain("pardoseală profesională");
    expect(WA_DEFAULT_MESSAGE).not.toContain("sportivă");
  });
});
