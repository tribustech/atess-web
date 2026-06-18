import { describe, it, expect } from "vitest";
import { buildConfiguratorEmail } from "../configurator-lead";

const baseAnswers = {
  projectType: "multisport" as const,
  length: 44,
  width: 22,
  totalM2: 968,
  baseLayer: "beton" as const,
  timeline: "3-12-luni" as const,
};

const contact = {
  name: "Ion Popescu",
  phone: "+40712345678",
  email: "ion@example.com",
  judet: "Cluj",
  deadline: "3-12-luni" as const,
  company: "Primăria X",
  note: "Avem teren existent",
};

describe("buildConfiguratorEmail", () => {
  it("subject contains projectType, judet and name", () => {
    const email = buildConfiguratorEmail({ answers: baseAnswers, contact });
    expect(email.subject).toContain("multisport");
    expect(email.subject).toContain("Ion Popescu");
    expect(email.subject).toContain("Cluj");
  });

  it("text body contains all answer fields and contact fields", () => {
    const email = buildConfiguratorEmail({ answers: baseAnswers, contact });
    expect(email.text).toContain("968");
    expect(email.text).toContain("Ion Popescu");
    expect(email.text).toContain("+40712345678");
    expect(email.text).toContain("ion@example.com");
    expect(email.text).toContain("Cluj");
  });

  it("html body contains a diff block when acceptedRule is set", () => {
    const email = buildConfiguratorEmail({
      answers: { ...baseAnswers, projectType: "loc-joaca" },
      originalAnswers: { ...baseAnswers, projectType: "teren-individual" },
      acceptedRule: "basket-kids-to-playground",
      contact,
    });
    expect(email.html).toContain("Recomandare aplicată");
    expect(email.html).toContain("basket-kids-to-playground");
    expect(email.html).toContain("teren-individual");
    expect(email.html).toContain("loc-joaca");
  });

  it("lists read recommendations with resolved titles in html and text", () => {
    const email = buildConfiguratorEmail({
      answers: { projectType: "interior", useCase: "spital" },
      readRules: ["interior-spital"],
      contact,
    });
    // Section heading present in both outputs
    expect(email.html).toContain("Recomandări citite de client");
    expect(email.text).toContain("Recomandări citite de client");
    // Human-readable title from configurator-rules.json is resolved
    expect(email.html).toContain("PVC medical pentru unități spitalicești");
    expect(email.text).toContain("PVC medical pentru unități spitalicești");
    // Rule id also present (as supplementary reference)
    expect(email.html).toContain("interior-spital");
  });

  it("does not duplicate the applied rule in the read section", () => {
    // readRules contains only the acceptedRule — after filtering, engaged is empty
    const email = buildConfiguratorEmail({
      answers: { ...baseAnswers, projectType: "loc-joaca" },
      originalAnswers: { ...baseAnswers, projectType: "teren-individual" },
      acceptedRule: "basket-kids-to-playground",
      readRules: ["basket-kids-to-playground"],
      contact,
    });
    // The accepted rule appears in the diff section
    expect(email.html).toContain("Recomandare aplicată");
    // But the read-section heading must NOT appear (no additional rules to list)
    expect(email.html).not.toContain("Recomandări citite de client");
    expect(email.text).not.toContain("Recomandări citite de client");
  });

  it("omits the read section when no rules were read", () => {
    const email = buildConfiguratorEmail({ answers: baseAnswers, contact });
    expect(email.html).not.toContain("Recomandări citite de client");
    expect(email.text).not.toContain("Recomandări citite de client");
  });

  it("falls back to the rule id for unknown rule ids without throwing", () => {
    // An id not present in configurator-rules.json should render the id itself
    const unknownId = "unknown-rule-xyz-9999";
    const email = buildConfiguratorEmail({
      answers: baseAnswers,
      readRules: [unknownId],
      contact,
    });
    expect(email.html).toContain("Recomandări citite de client");
    expect(email.html).toContain(unknownId);
    expect(email.text).toContain(unknownId);
  });
});
