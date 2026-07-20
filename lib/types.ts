export type ActionResult = {
  ok: boolean;
  error?: string;
  message?: string;
  /** Field-level errors keyed by field name (for inline form display). */
  fieldErrors?: Record<string, string>;
};
