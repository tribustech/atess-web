export type ProjectType =
  | "pista-atletism"
  | "multisport"
  | "teren-individual"
  | "loc-joaca"
  | "spatii-publice"
  | "interior"
  | "constructii-cheie";

export type Sport = "basket" | "tenis" | "fotbal" | "volei" | "multi" | "altele";

export type UseCase = "spital" | "birou" | "comercial" | "educational" | "locuinta";

export type Users = "copii-mici" | "copii-mari" | "adolescenti" | "adulti" | "mixt";

export type Context = "privat-supervizat" | "public-supervizat" | "public-nesupervizat";

export type BaseLayer = "beton" | "asfalt" | "pamant" | "niciuna" | "nu-stiu";

export type Timeline = "sub-3-luni" | "3-12-luni" | "peste-1-an" | "nu-stiu";

export type Answers = {
  projectType?: ProjectType;
  sport?: Sport;
  useCase?: UseCase;
  users?: Users;
  context?: Context;
  length?: number;
  width?: number;
  totalM2?: number;
  baseLayer?: BaseLayer;
  timeline?: Timeline;
  turnkeyBrief?: string;
};

export type ContactFields = {
  name: string;
  phone: string;
  email: string;
  judet: string;
  deadline: Timeline;
  company?: string;
  note?: string;
};

export type StepId =
  | "project-type"
  | "sport"
  | "dimensions"
  | "users"
  | "context"
  | "interior-env"
  | "turnkey-brief"
  | "base-layer"
  | "timeline"
  | "contact"
  | "thanks";

export type State = {
  answers: Answers;
  history: StepId[];
  current: StepId;
  firedRules: string[];
  pendingRuleId?: string;
  acceptedRule?: string;
  originalAnswers?: Answers;
  contact?: ContactFields;
  files?: File[];
};

export type Action =
  | { type: "set"; key: keyof Answers; value: Answers[keyof Answers] }
  | { type: "next" }
  | { type: "back" }
  | { type: "goto"; step: StepId }
  | { type: "rule-fired"; ruleId: string }
  | { type: "accept-rule"; ruleId: string; rewrite?: Partial<Answers> }
  | { type: "decline-rule"; ruleId: string }
  | { type: "revert-rule" }
  | { type: "set-contact"; contact: ContactFields }
  | { type: "set-files"; files: File[] }
  | { type: "reset" };
