/**
 * Keystatic stores datetimes as UTC without a zone designator
 * (`2025-07-01T09:51`). Returns a full ISO 8601 string that `Date` parses
 * identically in every environment.
 */
export function toIsoDateTime(value: string): string {
	const hasZone = /(?:Z|[+-]\d{2}:?\d{2})$/.test(value);

	return new Date(hasZone ? value : `${value}Z`).toISOString();
}
