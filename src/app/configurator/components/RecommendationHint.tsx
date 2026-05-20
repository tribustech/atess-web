"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, X } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { getRuleById } from "../rules";
import { useRecommendation } from "../recommendation-context";

export function RecommendationHint() {
  const ctx = useRecommendation();
  const pendingRuleId = ctx?.pendingRuleId;
  const dispatch = ctx?.dispatch;
  const rule = pendingRuleId ? getRuleById(pendingRuleId) : null;
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (!pendingRuleId) setDetailOpen(false);
  }, [pendingRuleId]);

  useEffect(() => {
    if (!detailOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetailOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detailOpen]);

  const visible = Boolean(rule && pendingRuleId && dispatch);

  return (
    <>
      <AnimatePresence>
        {visible && rule && pendingRuleId && dispatch && (
          <motion.div
            key={pendingRuleId}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-x-0 z-30 flex justify-center px-4 sm:px-6"
            style={{
              bottom: "calc(5rem + env(safe-area-inset-bottom))",
            }}
          >
            <div className="pointer-events-auto relative w-full max-w-2xl overflow-hidden rounded-lg border border-accent-primary/60 bg-bg-base/95 p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)] backdrop-blur sm:p-5">
              <button
                type="button"
                onClick={() =>
                  dispatch({ type: "decline-rule", ruleId: pendingRuleId })
                }
                aria-label="Închide recomandarea"
                className="absolute right-2 top-2 rounded p-1 text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-start gap-3 pr-6">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-primary/20 text-accent-primary">
                  <Lightbulb className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-primary">
                    Recomandare
                  </p>
                  {rule.then.title && (
                    <p className="mt-0.5 text-sm font-medium text-text-primary">
                      {rule.then.title}
                    </p>
                  )}
                  <p className="mt-1 text-sm text-text-secondary">
                    {rule.then.message}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {rule.then.rewriteAnswers && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() =>
                          dispatch({
                            type: "accept-rule",
                            ruleId: pendingRuleId,
                            rewrite: rule.then.rewriteAnswers,
                          })
                        }
                      >
                        Aplică recomandarea
                      </Button>
                    )}
                    {rule.then.detail && (
                      <button
                        type="button"
                        onClick={() => setDetailOpen(true)}
                        className="text-xs font-medium uppercase tracking-[0.12em] text-accent-primary underline-offset-4 transition hover:underline"
                      >
                        Citește mai mult
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: "decline-rule",
                          ruleId: pendingRuleId,
                        })
                      }
                      className="text-xs font-medium uppercase tracking-[0.12em] text-text-muted transition hover:text-text-primary"
                    >
                      {rule.then.rewriteAnswers
                        ? "Continuă cu alegerea inițială"
                        : "Am înțeles"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {detailOpen && rule && pendingRuleId && dispatch && (
          <motion.div
            key="recommendation-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={() => setDetailOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="recommendation-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 32, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-2xl overflow-hidden rounded-t-2xl border border-border bg-bg-base shadow-2xl sm:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4 border-b border-border p-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-primary/20 text-accent-primary">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-primary">
                    Recomandare
                  </p>
                  <h2
                    id="recommendation-modal-title"
                    className="mt-1 text-xl font-medium text-text-primary"
                  >
                    {rule.then.title ?? "De ce sugerăm asta"}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailOpen(false)}
                  aria-label="Închide"
                  className="rounded p-1 text-text-secondary transition hover:bg-bg-elevated hover:text-text-primary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
                <p className="text-sm text-text-secondary">
                  {rule.then.message}
                </p>
                {rule.then.detail && (
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-text-primary">
                    {rule.then.detail}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 border-t border-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:flex-row sm:justify-end sm:pb-4">
                <Button
                  variant={rule.then.rewriteAnswers ? "ghost" : "primary"}
                  size="md"
                  onClick={() => {
                    setDetailOpen(false);
                    dispatch({
                      type: "decline-rule",
                      ruleId: pendingRuleId,
                    });
                  }}
                >
                  {rule.then.rewriteAnswers
                    ? "Continuă cu alegerea inițială"
                    : "Am înțeles"}
                </Button>
                {rule.then.rewriteAnswers && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      setDetailOpen(false);
                      dispatch({
                        type: "accept-rule",
                        ruleId: pendingRuleId,
                        rewrite: rule.then.rewriteAnswers,
                      });
                    }}
                  >
                    Aplică recomandarea
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
