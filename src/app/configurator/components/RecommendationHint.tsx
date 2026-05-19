"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, X } from "lucide-react";
import { getRuleById } from "../rules";
import type { Action } from "../types";

type Props = {
  pendingRuleId?: string;
  dispatch: React.Dispatch<Action>;
};

export function RecommendationHint({ pendingRuleId, dispatch }: Props) {
  const rule = pendingRuleId ? getRuleById(pendingRuleId) : null;
  const visible = Boolean(rule && pendingRuleId);

  return (
    <AnimatePresence>
      {visible && rule && pendingRuleId && (
        <motion.div
          key={pendingRuleId}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed inset-x-0 top-3 z-30 mx-auto w-full max-w-2xl px-4"
        >
          <div className="flex items-start gap-3 rounded-lg border border-accent-primary/40 bg-bg-elevated/95 px-4 py-3 shadow-lg backdrop-blur">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent-primary" />
            <div className="flex-1 text-sm text-text-primary">
              <p className="leading-snug">{rule.then.message}</p>
              {rule.then.rewriteAnswers && (
                <button
                  type="button"
                  onClick={() =>
                    dispatch({
                      type: "accept-rule",
                      ruleId: pendingRuleId,
                      rewrite: rule.then.rewriteAnswers,
                    })
                  }
                  className="mt-2 text-xs font-medium uppercase tracking-wide text-accent-primary hover:text-accent-deep"
                >
                  Aplică recomandarea →
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => dispatch({ type: "decline-rule", ruleId: pendingRuleId })}
              aria-label="Închide recomandarea"
              className="-m-1 rounded p-1 text-text-secondary hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
