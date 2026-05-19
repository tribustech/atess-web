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
});
