"use client";
import { useLayoutEffect, type Dispatch } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/shared/Button";
import { navStore } from "../nav-store";
import type { Action, State } from "../types";

export function StepThanks({
  state,
  dispatch,
}: {
  state: State;
  dispatch: Dispatch<Action>;
}) {
  useLayoutEffect(() => {
    navStore.clear();
  }, []);
  const c = state.contact;
  return (
    <div className="mx-auto w-full max-w-2xl px-6 pt-16 pb-32 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-primary/15 text-accent-primary">
        <Check className="h-7 w-7" />
      </div>
      <h1 className="mt-6 text-2xl font-medium text-text-primary sm:text-3xl">
        Mulțumim, {c?.name?.split(" ")[0] ?? ""}.
      </h1>
      <p className="mt-3 text-text-secondary">
        Te sunăm în maximum 1 zi lucrătoare la <span className="text-text-primary">{c?.phone}</span>{" "}
        cu o discuție de orientare și o estimare inițială.
      </p>
      <Button
        variant="ghost"
        size="md"
        className="mt-10"
        onClick={() => dispatch({ type: "reset" })}
      >
        Trimite altă cerere
      </Button>
    </div>
  );
}
