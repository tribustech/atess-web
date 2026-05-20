"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { z } from "zod";
import { cn } from "@/lib/utils/cn";

const SUBJECTS = [
  "Pistă atletism",
  "Teren multisport",
  "Pardoseală interior",
  "Loc de joacă",
  "Reabilitare existent",
  "Altceva",
] as const;

const Schema = z.object({
  name: z.string().min(2, "Spune-ne cum te cheamă"),
  email: z.string().email("Email invalid"),
  phone: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^(\+4)?0[2-7][0-9]{8}$/.test(v),
      "Număr de telefon românesc invalid",
    ),
  subject: z.string().optional(),
  message: z
    .string()
    .min(10, "Câteva detalii ne ajută să răspundem mai bine")
    .max(4000),
  website: z.string().optional(),
});

type FormValues = z.infer<typeof Schema>;
type Errors = Partial<Record<keyof FormValues, string>>;

const initial: FormValues = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  website: "",
};

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [values, setValues] = useState<FormValues>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Schema.safeParse(values);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormValues;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: parsed.data.name,
          email: parsed.data.email,
          phone: parsed.data.phone || undefined,
          subject: parsed.data.subject || undefined,
          message: parsed.data.message,
          source: "contact-page",
          website: parsed.data.website || "",
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
      };
      if (!res.ok || !json.ok) {
        const code = json.code ?? "unknown";
        const msg =
          code === "rate_limited"
            ? "Prea multe încercări. Reîncearcă peste o oră sau sună direct."
            : code === "validation_failed"
              ? "Verifică din nou câmpurile."
              : "Ceva n-a mers. Sună-ne direct sau reîncearcă în câteva minute.";
        setErrorMsg(msg);
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setErrorMsg("Conexiune întreruptă. Reîncearcă, te rog.");
      setStatus("error");
    }
  }

  return (
    <section id="formular" className="bg-bg-base">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          <aside className="md:sticky md:top-32 md:self-start">
            <div className="mb-3 flex items-center gap-3">
              <span className="h-px w-8 bg-accent-primary" />
              <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-accent-primary">
                Formular
              </p>
            </div>
            <h2 className="text-display-lg">
              Scrie-ne
              <br />
              <span className="font-serif italic text-text-muted">
                un rând.
              </span>
            </h2>
            <p className="mt-6 max-w-md text-text-muted">
              Cu cât descrii mai bine proiectul — locație, suprafață, ce
              folosești în prezent — cu atât revin mai precis cu o estimare.
            </p>

            <ul className="mt-10 space-y-4 border-t border-border pt-8 text-sm text-text-muted">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary" />
                Răspund personal, nu un call-center.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary" />
                Vizita pe șantier e gratuită în zona București-Ilfov.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-primary" />
                Nu vând sisteme pe care nu le-am turnat — îți spun deschis dacă
                proiectul tău cere altă companie.
              </li>
            </ul>
          </aside>

          <div className="relative">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="border border-border bg-bg-elevated p-10 md:p-14"
                >
                  <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full border border-accent-primary bg-accent-primary/10">
                    <Check className="h-7 w-7 text-accent-primary" strokeWidth={1.6} />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
                    Mesaj primit.
                  </h3>
                  <p className="mt-4 max-w-md text-text-muted">
                    Mulțumim, {values.name.split(" ")[0]}. Revenim pe email la{" "}
                    <span className="text-text-primary">{values.email}</span> în
                    cel mult 24 de ore lucrătoare. Dacă e urgent, sună-ne acum.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setValues(initial);
                      setErrors({});
                      setStatus("idle");
                    }}
                    className="mt-10 inline-flex items-center gap-2 border-b border-text-faint pb-1 font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted transition-colors hover:border-accent-primary hover:text-accent-primary"
                  >
                    Trimite alt mesaj
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                  noValidate
                >
                  <input
                    type="text"
                    name="website"
                    value={values.website}
                    onChange={(e) => set("website", e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    aria-hidden
                  />

                  <div className="grid gap-6 md:grid-cols-2">
                    <Field
                      id="name"
                      label="Nume"
                      value={values.name}
                      onChange={(v) => set("name", v)}
                      error={errors.name}
                      autoComplete="name"
                    />
                    <Field
                      id="email"
                      label="Email"
                      type="email"
                      value={values.email}
                      onChange={(v) => set("email", v)}
                      error={errors.email}
                      autoComplete="email"
                    />
                  </div>

                  <Field
                    id="phone"
                    label="Telefon (opțional)"
                    type="tel"
                    value={values.phone ?? ""}
                    onChange={(v) => set("phone", v)}
                    error={errors.phone}
                    autoComplete="tel"
                    placeholder="+40 ..."
                  />

                  <div>
                    <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-text-muted">
                      Subiect (opțional)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SUBJECTS.map((s) => {
                        const selected = values.subject === s;
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() =>
                              set("subject", selected ? "" : s)
                            }
                            className={cn(
                              "border px-4 py-2 text-sm transition-all duration-200",
                              selected
                                ? "border-accent-primary bg-accent-primary/10 text-accent-primary"
                                : "border-border bg-bg-elevated text-text-muted hover:border-text-faint hover:text-text-primary",
                            )}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <TextArea
                    id="message"
                    label="Mesaj"
                    value={values.message}
                    onChange={(v) => set("message", v)}
                    error={errors.message}
                    rows={6}
                  />

                  <div className="flex flex-col-reverse items-stretch gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-text-faint">
                      Datele tale nu pleacă mai departe.
                    </p>
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className={cn(
                        "group inline-flex h-12 w-full items-center justify-center gap-3 bg-accent-primary px-6 text-sm font-medium uppercase tracking-wide text-text-primary transition-all duration-200",
                        "sm:h-14 sm:w-auto sm:px-8 sm:text-base",
                        "hover:bg-accent-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base",
                        "disabled:opacity-60",
                      )}
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Se trimite
                        </>
                      ) : (
                        <>
                          Trimite mesaj
                          <ArrowRight
                            strokeWidth={1.6}
                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                          />
                        </>
                      )}
                    </button>
                  </div>

                  {status === "error" && errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border-l-2 border-accent-primary bg-bg-elevated p-4 text-sm text-text-primary"
                    >
                      {errorMsg}
                    </motion.div>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field(props: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  const {
    id,
    label,
    value,
    onChange,
    type = "text",
    error,
    autoComplete,
    placeholder,
  } = props;
  const filled = value.length > 0;
  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder ?? " "}
        className={cn(
          "peer block w-full border-b bg-transparent pb-2 pt-7 text-lg text-text-primary outline-none transition-colors duration-200",
          "placeholder:text-text-faint",
          error
            ? "border-accent-primary"
            : "border-border focus:border-text-primary",
        )}
      />
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-0 top-7 origin-left text-lg text-text-muted transition-all duration-200",
          "peer-focus:top-0 peer-focus:scale-75 peer-focus:text-text-muted",
          (filled || placeholder) && "top-0 scale-75",
        )}
      >
        {label}
      </label>
      {error && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-primary">
          {error}
        </p>
      )}
    </div>
  );
}

function TextArea(props: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  rows?: number;
}) {
  const { id, label, value, onChange, error, rows = 5 } = props;
  const filled = value.length > 0;
  return (
    <div className="relative">
      <textarea
        id={id}
        name={id}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className={cn(
          "peer block w-full resize-none border-b bg-transparent pb-2 pt-7 text-lg text-text-primary outline-none transition-colors duration-200",
          "placeholder:text-text-faint",
          error
            ? "border-accent-primary"
            : "border-border focus:border-text-primary",
        )}
      />
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-0 top-7 origin-left text-lg text-text-muted transition-all duration-200",
          "peer-focus:top-0 peer-focus:scale-75 peer-focus:text-text-muted",
          filled && "top-0 scale-75",
        )}
      >
        {label}
      </label>
      {error && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-primary">
          {error}
        </p>
      )}
    </div>
  );
}
