import { ServerClient } from "postmark";

let client: ServerClient | null = null;

export function getPostmark(): ServerClient {
  if (!process.env.POSTMARK_API_KEY) {
    throw new Error("POSTMARK_API_KEY not set");
  }
  client ??= new ServerClient(process.env.POSTMARK_API_KEY);
  return client;
}

// Exported for tests that need to clear the singleton.
export function __resetPostmarkClientForTests() {
  client = null;
}
