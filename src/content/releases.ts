/**
 * Release registry. Capabilities point here via `releaseRefs`.
 *
 * Only a `customer-release` can support an Available capability. Internal merges, migrations,
 * database objects, architecture decisions and DEV tests are not customer releases and are
 * never recorded as one.
 *
 * Empty today: no customer-facing Heisterlux release exists yet. The Changelog and Release
 * Notes routes stay invisible until one does.
 */

export interface ReleaseRecord {
  id: string;
  kind: 'customer-release';
  /** ISO date the release reached customers in production. */
  releasedOn: string;
  /** Link or reference to production evidence (deployment, release decision). */
  productionEvidence: string;
  /** Who approved publishing this release publicly. */
  publicationApprovedBy: string;
  summary: Partial<Record<'en' | 'nl' | 'de', string>>;
  notes?: Partial<Record<'en' | 'nl' | 'de', string>>;
  /** Releases are never deleted. A withdrawn release keeps its record. */
  withdrawn?: { on: string; reason: string };
}

export const RELEASES: readonly ReleaseRecord[] = [];
