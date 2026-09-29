export type PasswordCheckId = "length" | "mixed" | "number" | "symbol";

export const PASSWORD_CHECKS: { id: PasswordCheckId; label: string; test: (value: string) => boolean }[] = [
  { id: "length", label: "Eight characters", test: (value) => value.length >= 8 },
  { id: "mixed", label: "Upper and lower case", test: (value) => /[a-z]/.test(value) && /[A-Z]/.test(value) },
  { id: "number", label: "A number", test: (value) => /\d/.test(value) },
  { id: "symbol", label: "A symbol", test: (value) => /[^A-Za-z0-9]/.test(value) },
];

export type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  tone: "idle" | "weak" | "fair" | "strong" | "specified";
  checks: { id: PasswordCheckId; label: string; ok: boolean }[];
};

const TONES: Record<PasswordStrength["score"], Pick<PasswordStrength, "label" | "tone">> = {
  0: { label: "Too short", tone: "idle" },
  1: { label: "Weak", tone: "weak" },
  2: { label: "Fair", tone: "fair" },
  3: { label: "Strong", tone: "strong" },
  4: { label: "Very strong", tone: "specified" },
};

/** Live score for new-password fields. Eight characters is the floor; the rest is guidance. */
export function scorePassword(value: string): PasswordStrength {
  const checks = PASSWORD_CHECKS.map((check) => ({ id: check.id, label: check.label, ok: check.test(value) }));
  if (!value) return { score: 0, label: "Enter a password", tone: "idle", checks };
  const passed = checks.filter((check) => check.ok).length;
  const long = value.length >= 12;
  const score = (passed === 4 && long ? 4 : passed) as PasswordStrength["score"];
  return { ...TONES[score], score, checks };
}
