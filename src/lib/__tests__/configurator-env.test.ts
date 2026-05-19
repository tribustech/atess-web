import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { getConfiguratorEnvStatus } from "../configurator-env";

const KEYS = ["POSTMARK_API_KEY", "POSTMARK_FROM", "TEAM_EMAIL"];

describe("getConfiguratorEnvStatus", () => {
  let snapshot: Record<string, string | undefined>;

  beforeEach(() => {
    snapshot = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));
    for (const k of KEYS) delete process.env[k];
  });

  afterEach(() => {
    for (const k of KEYS) {
      if (snapshot[k] === undefined) delete process.env[k];
      else process.env[k] = snapshot[k];
    }
  });

  it("reports all keys missing when none are set", () => {
    expect(getConfiguratorEnvStatus()).toEqual({
      ok: false,
      missing: ["POSTMARK_API_KEY", "POSTMARK_FROM", "TEAM_EMAIL"],
    });
  });

  it("reports ok when all keys are set", () => {
    process.env.POSTMARK_API_KEY = "x";
    process.env.POSTMARK_FROM = "from@example.com";
    process.env.TEAM_EMAIL = "team@example.com";
    expect(getConfiguratorEnvStatus()).toEqual({ ok: true, missing: [] });
  });

  it("lists only missing keys", () => {
    process.env.POSTMARK_API_KEY = "x";
    expect(getConfiguratorEnvStatus()).toEqual({
      ok: false,
      missing: ["POSTMARK_FROM", "TEAM_EMAIL"],
    });
  });
});
