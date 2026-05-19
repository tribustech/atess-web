"use client";
import { useState, type Dispatch, type FormEvent } from "react";
import { z } from "zod";
import { StepShell } from "../components/StepShell";
import type { Action, ContactFields, State, Timeline } from "../types";

const JUDETE = [
  "Alba","Arad","Argeș","Bacău","Bihor","Bistrița-Năsăud","Botoșani","Brașov","Brăila",
  "București","Buzău","Caraș-Severin","Călărași","Cluj","Constanța","Covasna","Dâmbovița",
  "Dolj","Galați","Giurgiu","Gorj","Harghita","Hunedoara","Ialomița","Iași","Ilfov",
  "Maramureș","Mehedinți","Mureș","Neamț","Olt","Prahova","Satu Mare","Sălaj","Sibiu",
  "Suceava","Teleorman","Timiș","Tulcea","Vaslui","Vâlcea","Vrancea",
];

const DEADLINES: { value: Timeline; label: string }[] = [
  { value: "sub-3-luni", label: "Sub 3 luni" },
  { value: "3-12-luni", label: "3 - 12 luni" },
  { value: "peste-1-an", label: "Peste 1 an" },
  { value: "nu-stiu", label: "Nu știu" },
];

const ContactSchema = z.object({
  name: z.string().min(2, "Numele e prea scurt").max(80),
  phone: z
    .string()
    .regex(/^(\+4)?0[2-7][0-9]{8}$/, "Număr de telefon RO invalid"),
  email: z.string().email("Email invalid"),
  judet: z.string().min(2).max(40),
  deadline: z.enum(["sub-3-luni", "3-12-luni", "peste-1-an", "nu-stiu"]),
  company: z.string().max(80).optional(),
  note: z.string().max(1500).optional(),
});

const MAX_FILES = 3;
const MAX_FILE_BYTES = 10 * 1024 * 1024;
const MAX_TOTAL_BYTES = 9 * 1024 * 1024;
const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const inputCls =
  "mt-1 block w-full rounded border border-border bg-bg-elevated px-3 py-2 text-text-primary focus:border-accent-primary focus:outline-none";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm text-text-secondary">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-accent-deep">{error}</span>}
    </label>
  );
}

type Props = {
  state: State;
  dispatch: Dispatch<Action>;
  submitting: boolean;
  submitError?: string | null;
  onSubmit: (contact: ContactFields, files: File[], honeypot: string) => void;
};

export function StepContact({
  state,
  dispatch,
  submitting,
  submitError,
  onSubmit,
}: Props) {
  const initialDeadline: Timeline =
    state.answers.timeline ?? state.contact?.deadline ?? "3-12-luni";

  const [name, setName] = useState(state.contact?.name ?? "");
  const [phone, setPhone] = useState(state.contact?.phone ?? "");
  const [email, setEmail] = useState(state.contact?.email ?? "");
  const [judet, setJudet] = useState(state.contact?.judet ?? "");
  const [deadline, setDeadline] = useState<Timeline>(initialDeadline);
  const [company, setCompany] = useState(state.contact?.company ?? "");
  const [note, setNote] = useState(state.contact?.note ?? "");
  const [files, setFiles] = useState<File[]>(state.files ?? []);
  const [fileError, setFileError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const arr = Array.from(list).slice(0, MAX_FILES);
    let total = 0;
    for (const f of arr) {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        setFileError("Sunt permise doar PDF, JPG, PNG.");
        return;
      }
      if (f.size > MAX_FILE_BYTES) {
        setFileError("Un fișier depășește 10MB.");
        return;
      }
      total += f.size;
    }
    if (total > MAX_TOTAL_BYTES) {
      setFileError("Atașamentele depășesc în total 9MB.");
      return;
    }
    setFileError(null);
    setFiles(arr);
    dispatch({ type: "set-files", files: arr });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const candidate: ContactFields = {
      name,
      phone,
      email,
      judet,
      deadline,
      company: company || undefined,
      note: note || undefined,
    };
    const parsed = ContactSchema.safeParse(candidate);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".");
        if (!next[path]) next[path] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    dispatch({ type: "set-contact", contact: parsed.data });
    onSubmit(parsed.data, files, honeypot);
  };

  return (
    <StepShell
      title="Datele de contact"
      subtitle="Te sunăm în maximum 1 zi lucrătoare cu o ofertă inițială."
      onBack={() => dispatch({ type: "back" })}
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <Field label="Nume" error={errors.name}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
            autoComplete="name"
          />
        </Field>
        <Field label="Telefon" error={errors.phone}>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="07xxxxxxxx"
            className={inputCls}
            autoComplete="tel"
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputCls}
            autoComplete="email"
          />
        </Field>
        <Field label="Județ" error={errors.judet}>
          <input
            list="judete"
            value={judet}
            onChange={(e) => setJudet(e.target.value)}
            className={inputCls}
          />
          <datalist id="judete">
            {JUDETE.map((j) => (
              <option key={j} value={j} />
            ))}
          </datalist>
        </Field>
        <Field label="Termen de execuție" error={errors.deadline}>
          <select
            value={deadline}
            onChange={(e) => setDeadline(e.target.value as Timeline)}
            className={inputCls}
          >
            {DEADLINES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Companie / instituție (opțional)" error={errors.company}>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Note suplimentare (opțional)" error={errors.note}>
          <textarea
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={inputCls}
          />
        </Field>

        <div>
          <label className="block text-sm text-text-secondary">
            Atașamente (PDF / JPG / PNG, max 3 fișiere, total 9MB)
          </label>
          <input
            type="file"
            multiple
            accept={ACCEPTED_TYPES.join(",")}
            onChange={(e) => handleFiles(e.target.files)}
            className="mt-2 block w-full text-sm text-text-secondary"
          />
          {fileError && (
            <p className="mt-1 text-sm text-accent-deep">{fileError}</p>
          )}
          {files.length > 0 && (
            <ul className="mt-2 text-sm text-text-secondary">
              {files.map((f) => (
                <li key={f.name}>
                  {f.name} ({Math.round(f.size / 1024)} KB)
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Honeypot — hidden via inline styles, accessibility-safe */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: -9999,
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          <label>
            Website
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>
        </div>

        {submitError && (
          <p className="text-sm text-accent-deep">{submitError}</p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-11 items-center justify-center gap-2 bg-accent-primary px-6 text-text-primary transition-all hover:bg-accent-deep disabled:opacity-50"
          >
            {submitting ? "Se trimite..." : "Trimite cererea"}
          </button>
        </div>
      </form>
    </StepShell>
  );
}
