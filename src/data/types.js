/**
 * Shared JSDoc typedefs for the JSON data shapes under src/data/.
 * These give editor autocomplete + type-checking (via `// @ts-check` or
 * `checkJs` in jsconfig.json) without requiring a full TypeScript migration.
 */

/**
 * @typedef {Object} ProjectMetric
 * @property {string} label
 * @property {string} value
 */

/**
 * @typedef {Object} ProjectSection
 * @property {string} h - Section heading
 * @property {string} p - Section paragraph
 * @property {string[]} bullets
 */

/**
 * @typedef {Object} Project
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} image - Path under /uploads, relative to the site root
 * @property {string} imageBg - Backing colour so transparent/low-res logos stay legible
 * @property {number} imageWidth - Intrinsic width, used to prevent layout shift
 * @property {number} imageHeight - Intrinsic height, used to prevent layout shift
 * @property {string} description
 * @property {string} role
 * @property {string[]} highlights
 * @property {string[]} tech
 * @property {ProjectMetric[]} metrics
 * @property {string|null} caseStudyUrl - External case study URL, or null when not published
 * @property {ProjectSection[]} sections
 */

/**
 * @typedef {Object} ExperienceEntry
 * @property {string} company
 * @property {string} title
 * @property {string} meta
 * @property {string[]} points
 * @property {string[]} projects
 */

/**
 * @typedef {Object} ImpactStat
 * @property {string} project
 * @property {string} value
 * @property {string} label
 * @property {string} note
 */

/**
 * @typedef {Object} SkillItem
 * @property {string} name
 * @property {string} icon
 */

/**
 * @typedef {Object} SkillGroup
 * @property {string} id
 * @property {string} name
 * @property {string} icon
 * @property {SkillItem[]} items
 */

export {};
