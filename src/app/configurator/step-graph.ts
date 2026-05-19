import type { Answers, ProjectType, StepId } from "./types";

const BRANCH_NEXT: Record<ProjectType, StepId> = {
  "pista-atletism": "dimensions",
  multisport: "dimensions",
  "teren-individual": "sport",
  "loc-joaca": "users",
  "spatii-publice": "dimensions",
  interior: "interior-env",
  "constructii-cheie": "turnkey-brief",
};

export function deriveNextStep(current: StepId, answers: Answers): StepId | null {
  const pt = answers.projectType;

  switch (current) {
    case "project-type":
      return pt ? BRANCH_NEXT[pt] : null;

    case "sport":
      return "dimensions";

    case "dimensions":
      if (pt === "teren-individual") return "users";
      if (pt === "multisport") return "context";
      return "base-layer";

    case "users":
      return "context";

    case "context":
      return "base-layer";

    case "interior-env":
      return "base-layer";

    case "turnkey-brief":
      return "contact";

    case "suggestion":
      return "base-layer";

    case "base-layer":
      return "timeline";

    case "timeline":
      return "contact";

    case "contact":
      return "thanks";

    case "thanks":
      return null;
  }
}
