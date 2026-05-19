export type EnvStatus = { ok: boolean; missing: string[] };

const REQUIRED_KEYS = ["POSTMARK_API_KEY", "POSTMARK_FROM", "TEAM_EMAIL"] as const;

export function getConfiguratorEnvStatus(): EnvStatus {
  const missing = REQUIRED_KEYS.filter((k) => !process.env[k]);
  return { ok: missing.length === 0, missing: [...missing] };
}
