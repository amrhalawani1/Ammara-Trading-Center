import type { ListNameError } from "@/lib/shortlists";

/**
 * Validation messages shared by the account, shortlist and enquiry forms, so the same mistake
 * reads the same everywhere.
 */
export const FORM_MESSAGES = {
  passwordLength: "Use at least 8 characters.",
  passwordMismatch: "Passwords do not match.",
  name: "Enter your name.",
  email: "Enter an email address, like name@studio.jo.",
  phone: "Enter a phone number so a consultant can call you.",
} as const;

export const LIST_NAME_ERRORS: Record<ListNameError, string> = {
  blank: "Give the shortlist a name.",
  duplicate: "A shortlist with that name already exists.",
};
