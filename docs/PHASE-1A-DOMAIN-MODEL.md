# Phase 1A — Target Domain Model

**Status:** additive schema only. Nothing destructive has run. Ready for review before Phase 1B.
**Schema:** `apps/api/prisma/schema.prisma`

---

## 1. Relationships

```
User ──< Project ──< Assessment ──< FindingOccurrence >── SecurityIssue
 │         │              │                                    │
 │         │              ├──< AssessmentSummary (1:1)          │
 │         │              ├──< AssessmentConfig  (1:1)          │
 │         │              ├──< AssessmentLog                    │
 │         │              ├──< Report                           │
 │         │              ├──< PluginExecution                  │
 │         │              └──< Finding  (legacy, removed in 1B) │
 │         │                                                    │
 │         └────────────────────< SecurityIssue ────────────────┘
 │                                     │
 ├── assignedIssues ──────────────────>│
 └── issueStatusChanges ──> IssueStatusChange >── SecurityIssue
                                  │
                                  └──? Assessment (SetNull)

Project ──< ApiSpec (1:1) ──< Endpoint ──? FindingOccurrence (SetNull)
                          └──< AuthConfig (1:1)
```

**The load-bearing decision: `SecurityIssue` hangs off `Project`, never off `Assessment`.**

In the current model `Finding.assessmentId` is `onDelete: Cascade`, so deleting a scan permanently destroys every finding it produced *and all triage work attached to them*. Anchoring the issue to the project makes that structurally impossible: a scan owns its detections, not the vulnerability.

Three lifetimes, previously collapsed into one row:

| Model | Lifetime | Mutable? |
|---|---|---|
| `SecurityIssue` | as long as the project exists | yes — triage, current severity/wording |
| `FindingOccurrence` | tied to one scan | no — immutable snapshot |
| `IssueStatusChange` | append-only | no |

---

## 2. Schema diff by model

### Added

**`SecurityIssue`** — persistent vulnerability identity + triage.
Identity: `fingerprint`, `fingerprintVersion`, `pluginId`, `ruleId`, `method`, `normalizedRoute`, `component`.
Presentation: `title`, `description`, `severity`, `owaspCategory`, `cweId`, `cvssScore`, `cvssVector`.
Triage: `status`, `notes`, `assigneeId`, `acceptedRiskUntil`.
Lifecycle: `firstSeenAt`, `lastSeenAt`, `resolvedAt`, `reopenedAt`, `reopenCount`, `occurrenceCount`, `createdAt`, `updatedAt`.

**`FindingOccurrence`** — one immutable detection.
Links: `issueId`, `assessmentId`, `endpointId?`.
Idempotency: `occurrenceKey`.
Snapshots: `methodSnapshot`, `pathSnapshot`, `operationIdSnapshot`, `pluginIdSnapshot`, `pluginVersionSnapshot`, `ruleIdSnapshot`, `severitySnapshot`, `cvssSnapshot`, `owaspSnapshot`, `cweSnapshot`, `titleSnapshot`, `descriptionSnapshot`, `impactSnapshot`, `remediationSnapshot`.
Evidence (redacted): `evidence`, `httpRequest`, `httpResponse`, `affectedUrl`, `location`.
State: `validation`. Provenance: `assessmentConfigHash`, `specVersionSnapshot`, `detectedAt`, `createdAt`.

**`IssueStatusChange`** — `issueId`, `fromStatus?`, `toStatus`, `actorId?`, `assessmentId?`, `reason?`, `automatic`, `acceptedRiskUntil?`, `createdAt`.

**Enums:** `IssueStatus`, `OccurrenceValidation`, `ScoreStatus`, `AssetCriticality`.

### Modified

| Model | Change | Why |
|---|---|---|
| `Project` | `+ assetCriticality` (`AssetCriticality`, default `MEDIUM`) | Business value, deliberately separate from `environment` |
| `Project` | `+ securityIssues` relation | Issues owned by project |
| `AssessmentSummary` | `securityScore: Float @default(100)` → **`Float?`** | Root cause of "failed scan scores 100" |
| `AssessmentSummary` | `+ scoreStatus`, `scoreVersion`, `scoreComputedAt`, `scoreExplanation` | Score validity is explicit and versioned |
| `AssessmentSummary` | `+ plannedChecks`, `successfulChecks`, `failedChecks`, `skippedChecks`, `executionErrors`, `coveragePercent` | Coverage separated from score |
| `Assessment` | `+ occurrences`, `+ issueStatusChanges` | New relations |
| `User` | `+ assignedIssues`, `+ issueStatusChanges` | Assignment and audit |
| `FindingStatus` | doc comment marking it legacy | Removed in 1B |

### Untouched

`Finding` keeps every field and its `Assessment` relation, so Phase 1A is purely additive and independently reviewable. Removal is Phase 1B.

---

## 3. Unique constraints

| Constraint | Purpose |
|---|---|
| `SecurityIssue @@unique([projectId, fingerprintVersion, fingerprint])` | **The deduplication guarantee.** A rescan resolves to the existing row instead of inserting a duplicate. Including `fingerprintVersion` means a future v2 formula cannot silently collide with v1 rows — both can coexist during a backfill. |
| `FindingOccurrence @@unique([assessmentId, occurrenceKey])` | **The idempotency guarantee** (§7). At most one detection of a given vulnerability per scan, enforced by the database. |

Pre-existing and unchanged: `ProjectSecret [projectId, key]`, `Endpoint [apiSpecId, path, method]`, `PluginUserConfig [pluginId, userId]`.

---

## 4. Indexes — 25 total, each tied to a query

The schema previously declared **zero** `@@index`. PostgreSQL does not auto-index foreign keys, so every join and filter below was a sequential scan.

### `SecurityIssue` (6)

| Index | Query |
|---|---|
| `[projectId, status]` | Issues list filtered by status; posture counts open/acknowledged issues |
| `[projectId, severity]` | Issues list filtered/sorted by severity; posture weights by severity |
| `[projectId, lastSeenAt]` | "Recently seen" ordering; staleness detection |
| `[assigneeId]` | "Issues assigned to me" |
| `[projectId, pluginId]` | Detection coverage and per-check reporting |
| `[status, acceptedRiskUntil]` | Sweep for lapsed risk acceptances that must return to `OPEN` |

### `FindingOccurrence` (3)

| Index | Query |
|---|---|
| `[issueId, detectedAt]` | Occurrence history on issue detail, newest first |
| `[assessmentId]` | "Findings from this scan" |
| `[endpointId]` | "Issues affecting this endpoint" |

### `IssueStatusChange` (2)

`[issueId, createdAt]` — activity timeline. `[actorId]` — "what did this user triage?".

### `Assessment` (3)

`[projectId, createdAt]` — project scan history. `[projectId, status]` — scans needing attention. `[status, createdAt]` — global scans list by status.

### `Project` (2)

`[userId, isActive]` — every project listing. `[userId, status]` — drafts vs ready split.

### Existing models (9)

| Model | Index | Query |
|---|---|---|
| `Finding` | `[assessmentId]` | Legacy reads while it coexists; dropped in 1B |
| `Report` | `[assessmentId]` | Reports of one scan |
| `AssessmentLog` | `[assessmentId, timestamp]` | Scan logs in order |
| `PluginExecution` | `[pluginId, startedAt]` | Check execution history |
| `PluginExecution` | `[assessmentId]` | Which checks ran — basis for scope-aware comparison |
| `AuditLog` | `[createdAt]` | Default paginated view |
| `AuditLog` | `[userId, createdAt]` | Filtered by user |
| `Session` | `[userId]` | Better Auth session resolution/revocation |
| `Account` | `[userId]` | Better Auth sign-in lookup |

**Deliberately not added:** `Endpoint[apiSpecId]` (already the prefix of `@@unique([apiSpecId, path, method])`), `SecurityIssue[fingerprint]` alone (no cross-project lookup is planned — comparison is per-project), `ApiKey[userId]` (no code reads it yet; Phase 7 adds it with its own migration).

---

## 5. `onDelete` / `onUpdate`

All `onUpdate` left at Prisma's default (`Cascade`) — primary keys are immutable `cuid()`s, so it never fires.

| Relation | Rule | Reasoning |
|---|---|---|
| `SecurityIssue → Project` | **Cascade** | Deleting a project deletes its vulnerabilities. Correct: the asset is gone. |
| `SecurityIssue → User` (assignee) | **SetNull** | Deleting a user must not delete issues; assignment simply clears. |
| `FindingOccurrence → SecurityIssue` | **Cascade** | An occurrence has no meaning without its issue. |
| `FindingOccurrence → Assessment` | **Cascade** | Detections belong to their scan. Safe *because* the issue lives on the project — deleting a scan removes its detections but not the vulnerability or its triage. |
| `FindingOccurrence → Endpoint` | **SetNull** | Re-importing a spec deletes and recreates every endpoint row; the snapshots are the durable record. |
| `IssueStatusChange → SecurityIssue` | **Cascade** | History dies with the issue it describes. |
| `IssueStatusChange → User` | **SetNull** | Audit history survives user deletion; actor becomes unknown. |
| `IssueStatusChange → Assessment` | **SetNull** | **Critical.** Deleting a scan must never destroy triage history. This is the exact cascade that made the old model lose triage work. |

---

## 6. Fingerprint contract

### Canonical string

```
v1|<projectId>|<pluginId>|<ruleId>|<METHOD>|<normalizedRoute>|<component>
```

### Final value

```
fingerprint = SHA-256(canonicalString)   // lowercase hex
fingerprintVersion = "v1"
```

### Normalisation rules

| Field | Rule |
|---|---|
| `METHOD` | Always uppercase. `GLOBAL` for project-wide issues. |
| `normalizedRoute` | Template path only. Strip scheme, host, port, query string, fragment. Collapse duplicate slashes. Strip trailing slash (except root `/`). Normalise `:id`, `{id}` and `<id>` to a single stable form `{id}`. Never derived from `endpointId`. |
| `component` | Stable identifier of the affected area: `endpoint`, `header:authorization`, `query:user_id`, `path:param`, `body:password`, `response:content-type`, `project`. Lowercased. |
| `ruleId` | Stable and namespaced per check: `cors.wildcard-origin`, `headers.missing-hsts`, `auth.missing-authentication`. |
| Global issues | Canonically `GLOBAL|/|project` for the method/route/component triple. |

### Excluded from the hash

Title, description, severity, CVSS, evidence, AI output, timestamps, occurrence or assessment ids, and any dynamic path value. **Rewording a check must not change issue identity.**

### Consequence for Phase 1C

The 10 built-in plugins currently emit **no `ruleId`**. Adding a stable, namespaced `ruleId` to each is a prerequisite of Phase 1C and is the reason `security-headers` (which emits ≥4 distinct rules per endpoint) would otherwise collide with itself under a `pluginId + method + path` scheme.

---

## 7. Idempotency strategy

### The risk

`BullModule` sets `attempts: 3` with exponential backoff (`app.module.ts`). A scan that fails midway is retried, re-running the whole processor — including persistence. Without a database-level guard, a retry duplicates every detection already written.

There is a second, pre-existing instance of this bug: the processor calls `assessmentSummary.create` unconditionally, and `assessmentId` is `@unique`, so **the retry currently dies on a unique-constraint violation instead of the original error**, masking the real failure. Recorded as confirmed technical debt, fixed in Phase 1C.

### The mechanism

```
occurrenceKey = SHA-256(`${fingerprintVersion}|${fingerprint}`)
@@unique([assessmentId, occurrenceKey])
```

`occurrenceKey` is a **pure function of issue identity**: no timestamps, no randomness, no row ids. Properties this buys:

1. **Deterministic across retries.** Attempt 3 computes exactly what attempt 1 computed.
2. **Computable before insertion.** It does not depend on `SecurityIssue.id` (a `cuid()` generated at insert time), so the worker can build the whole batch offline and persist with `createMany({ skipDuplicates: true })` in one round trip.
3. **Enforced by Postgres, not by memory.** Survives worker restarts, concurrent workers and partial transactions — the brief's explicit requirement.

### Phase 1C write path

```
for each detection:
  fingerprint  = sha256(canonical)
  issue        = upsert on (projectId, fingerprintVersion, fingerprint)   // idempotent
  occurrence   = createMany([...], skipDuplicates: true)                  // idempotent
  statusChange = written only on an actual transition                     // guarded by fromStatus != toStatus
```

All three inside one transaction per scan, so a retry converges to the same state rather than accumulating rows.

---

## 8. What Phase 1B will do destructively

Nothing below has run yet.

1. **Drop and recreate the development database.** There is no reproducible migration path today: no `CREATE TABLE` migration exists, `migration_lock.toml` is absent, and the only two migrations are an empty comment-only baseline plus one `ALTER TABLE`. `prisma migrate deploy` against an empty database currently fails.
2. **Delete the two stub migration folders** (`20260718120000_project_drafts`, `20260718190000_assessment_resolved_plugins`).
3. **Generate a real initial migration** containing the full `CREATE TABLE` set plus everything in this document, and add `migration_lock.toml`.
4. **Drop the `Finding` model and `FindingStatus` enum**, plus `Finding`'s relations on `Assessment` and `Endpoint` and its `[assessmentId]` index.
5. **Consider dropping `ProjectSecret`** — declared in the schema with zero code references anywhere.
6. **Extend the seed**: system scan profiles, a spec + auth config so the demo project is genuinely `READY` (today it is `READY` with no `ApiSpec`, an impossible state), optionally one completed scan.
7. **Remove the legacy AES-256-CBC decryption path** from `CryptoService` once the regenerated database provably contains no CBC ciphertext, leaving AES-256-GCM as the only supported format.

No backfill is required: the data is disposable by your decision, so this is establishing a baseline that never existed rather than migrating one.

---

## 9. Verification

| Check | Result |
|---|---|
| `prisma format` | Formatted |
| `prisma validate` | **Valid** |
| `prisma generate` | Client generated |
| API typecheck (`tsc --noEmit`) | **0 errors** |
| API build (`nest build`) | **Pass** |
| Web typecheck | **0 errors** |
| Tests (`bun test src`) | **100/100 pass** |

`securityScore` widening from `Float` to `Float?` was checked against all three existing readers — `assessments.service.ts` (`?? 100`), `reports.service.ts` (`|| 100`) and `scanner.processor.ts` (write) — and none break at the type level. Both faulty coalescing expressions are replaced in Phase 2.

---

## 10. Confirmed technical debt

Not blocking Phase 1A.

- No valid ESLint 9 flat config for the API — `bun run lint:api` cannot run.
- `test:e2e` points at `./test/jest-e2e.json`, which does not exist.
- BullMQ retry non-idempotency (§7) — fixed in Phase 1C.
