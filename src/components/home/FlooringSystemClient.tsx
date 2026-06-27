"use client";

import dynamic from "next/dynamic";
import {
  DEFAULT_FLOORING_SYSTEM_ID,
  getFlooringSystem,
  type FlooringSystemId,
} from "./FlooringSystem/flooring-systems";

const FlooringSystemSection = dynamic(
  () => import("./FlooringSystem").then((m) => m.FlooringSystemSection),
  {
    ssr: false,
    loading: () => <div className="h-screen bg-neutral-950" aria-hidden="true" />,
  }
);

export type FlooringSystemClientProps = {
  systemId?: FlooringSystemId;
  sectionId?: string;
};

export function FlooringSystemClient({
  systemId = DEFAULT_FLOORING_SYSTEM_ID,
  sectionId,
}: FlooringSystemClientProps) {
  const system = getFlooringSystem(systemId);
  return <FlooringSystemSection system={system} sectionId={sectionId} />;
}
