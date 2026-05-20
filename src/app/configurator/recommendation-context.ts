"use client";
import { createContext, useContext, type Dispatch } from "react";
import type { Action } from "./types";

export type RecommendationContextValue = {
  pendingRuleId?: string;
  dispatch: Dispatch<Action>;
};

export const RecommendationContext =
  createContext<RecommendationContextValue | null>(null);

export function useRecommendation(): RecommendationContextValue | null {
  return useContext(RecommendationContext);
}
