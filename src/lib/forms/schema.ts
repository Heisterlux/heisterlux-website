/**
 * Form definitions and validation. Pure functions, no I/O — shared by the server handler,
 * the form components (limits, names) and the tests.
 */

export type FormId = 'early-access' | 'keep-informed' | 'contact';

export const FORM_IDS: readonly FormId[] = ['early-access', 'keep-informed', 'contact'];

export const HONEYPOT_FIELD = 'website';
export const MAX_BODY_BYTES = 8 * 1024;

export interface FieldDef {
  name: string;
  required: boolean;
  maxLength: number;
  minLength?: number;
  kind: 'email' | 'text' | 'multiline' | 'checkbox';
}

export const FORMS: Record<FormId, readonly FieldDef[]> = {
  'early-access': [
    { name: 'email', required: true, maxLength: 254, kind: 'email' },
    { name: 'organization', required: false, maxLength: 120, kind: 'text' },
    { name: 'role', required: false, maxLength: 120, kind: 'text' },
    { name: 'useCase', required: false, maxLength: 2000, kind: 'multiline' },
    { name: 'updatesConsent', required: false, maxLength: 3, kind: 'checkbox' },
  ],
  'keep-informed': [
    { name: 'email', required: true, maxLength: 254, kind: 'email' },
    { name: 'consent', required: true, maxLength: 3, kind: 'checkbox' },
  ],
  contact: [
    { name: 'email', required: true, maxLength: 254, kind: 'email' },
    { name: 'message', required: true, minLength: 10, maxLength: 5000, kind: 'multiline' },
  ],
};

export type FieldErrorCode = 'required' | 'too-long' | 'too-short' | 'invalid-email' | 'invalid-value';

export type ValidationResult =
  | { ok: true; values: Record<string, string>; honeypotTripped: boolean }
  | { ok: false; reason: 'malformed' | 'unexpected-fields' }
  | { ok: false; reason: 'fields'; errors: Record<string, FieldErrorCode>; values: Record<string, string> };

export function isFormId(value: string): value is FormId {
  return (FORM_IDS as readonly string[]).includes(value);
}

// Deliberately conservative: one @, no whitespace or control characters, a dotted domain.
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"\u0000-\u001f]{1,64}@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && EMAIL_RE.test(value);
}

// Control characters other than tab/newline are never legitimate in these fields.
const CONTROL_RE = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

/** Validates an urlencoded body against the allowlist for `formId`. */
export function validateBody(formId: FormId, body: string): ValidationResult {
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(body);
  } catch {
    return { ok: false, reason: 'malformed' };
  }

  const defs = FORMS[formId];
  const allowed = new Set([...defs.map((d) => d.name), HONEYPOT_FIELD]);
  const seen = new Set<string>();
  for (const key of params.keys()) {
    if (!allowed.has(key)) return { ok: false, reason: 'unexpected-fields' };
    if (seen.has(key)) return { ok: false, reason: 'malformed' };
    seen.add(key);
  }

  const honeypotTripped = (params.get(HONEYPOT_FIELD) ?? '') !== '';
  const values: Record<string, string> = {};
  const errors: Record<string, FieldErrorCode> = {};

  for (const def of defs) {
    const raw = params.get(def.name) ?? '';
    if (CONTROL_RE.test(raw)) return { ok: false, reason: 'malformed' };
    const value = def.kind === 'multiline' ? raw.replace(/\r\n/g, '\n').trim() : raw.trim();
    values[def.name] = value;

    if (value === '') {
      if (def.required) errors[def.name] = 'required';
      continue;
    }
    if (value.length > def.maxLength) errors[def.name] = 'too-long';
    else if (def.minLength !== undefined && value.length < def.minLength) errors[def.name] = 'too-short';
    else if (def.kind === 'email' && !isValidEmail(value)) errors[def.name] = 'invalid-email';
    else if (def.kind === 'checkbox' && value !== 'yes') errors[def.name] = 'invalid-value';
    else if (def.kind !== 'multiline' && /\n/.test(value)) errors[def.name] = 'invalid-value';
  }

  if (Object.keys(errors).length > 0) return { ok: false, reason: 'fields', errors, values };
  return { ok: true, values, honeypotTripped };
}
