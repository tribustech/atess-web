import { describe, it, expect, vi, beforeEach } from "vitest";

const sendEmail = vi.fn();

vi.mock("@/lib/postmark", () => ({
  getPostmark: () => ({ sendEmail }),
  __resetPostmarkClientForTests: vi.fn(),
}));

import { POST } from "../route";
import { __resetRateLimitForTests } from "../rate-limit";

const validContact = {
  name: "Ion Popescu",
  phone: "+40712345678",
  email: "ion@example.com",
  judet: "Cluj",
  deadline: "3-12-luni",
};

function makeReq(payload: unknown, files: File[] = [], headers: Record<string, string> = {}) {
  const fd = new FormData();
  fd.append("payload", JSON.stringify(payload));
  for (const f of files) fd.append("files", f, f.name);
  return new Request("http://localhost/api/configurator/submit", {
    method: "POST",
    body: fd,
    headers: { "x-forwarded-for": "1.2.3.4", ...headers },
  });
}

beforeEach(() => {
  sendEmail.mockReset();
  sendEmail.mockResolvedValue({ MessageID: "test" });
  __resetRateLimitForTests();
  process.env.POSTMARK_API_KEY = "test";
  process.env.POSTMARK_FROM = "from@example.com";
  process.env.TEAM_EMAIL = "team@example.com";
});

describe("POST /api/configurator/submit", () => {
  it("happy path: returns 200 and sends email", async () => {
    const res = await POST(
      makeReq({
        answers: { projectType: "multisport", length: 44, width: 22, totalM2: 968 },
        contact: validContact,
      }),
    );
    expect(res.status).toBe(200);
    expect(sendEmail).toHaveBeenCalledOnce();
    const arg = sendEmail.mock.calls[0][0];
    expect(arg.Subject).toContain("multisport");
    expect(arg.Subject).toContain("Cluj");
    expect(arg.ReplyTo).toBe("ion@example.com");
  });

  it("validation failure returns 400", async () => {
    const res = await POST(
      makeReq({
        answers: {},
        contact: { ...validContact, email: "not-an-email" },
      }),
    );
    expect(res.status).toBe(400);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("honeypot tripped returns 200 but skips Postmark", async () => {
    const res = await POST(
      makeReq({
        answers: { projectType: "multisport" },
        contact: validContact,
        website: "spam",
      }),
    );
    expect(res.status).toBe(200);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("6th submission from same IP returns 429", async () => {
    const payload = {
      answers: { projectType: "multisport" },
      contact: validContact,
    };
    for (let i = 0; i < 5; i++) {
      const res = await POST(makeReq(payload));
      expect(res.status).toBe(200);
    }
    const sixth = await POST(makeReq(payload));
    expect(sixth.status).toBe(429);
  });

  it("Postmark failure returns 502", async () => {
    sendEmail.mockRejectedValueOnce(new Error("boom"));
    const res = await POST(
      makeReq({
        answers: { projectType: "multisport" },
        contact: validContact,
      }),
    );
    expect(res.status).toBe(502);
  });
});
