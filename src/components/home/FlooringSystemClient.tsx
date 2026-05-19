"use client";

import dynamic from "next/dynamic";

const FlooringSystemSection = dynamic(
  () =>
    import("./FlooringSystem").then((m) => m.FlooringSystemSection),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen bg-neutral-950" aria-hidden="true" />
    ),
  }
);

export function FlooringSystemClient() {
  return <FlooringSystemSection />;
}
