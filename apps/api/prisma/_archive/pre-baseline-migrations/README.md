# Archived pre-baseline migrations — NOT EXECUTABLE

These two migrations were the entire migration history before Phase 1B. They are
kept for audit only. **Prisma does not read this directory**, and neither
migration can be applied to any database.

## Why they were not reproducible

```
20260718120000_project_drafts/migration.sql
    -- Baseline migration.
    -- Project draft columns were previously applied with `prisma db push`.
```

That file contains **only comments**. No table was ever created by a migration:
the entire schema existed solely because someone ran `prisma db push`.

```
20260718190000_assessment_resolved_plugins/migration.sql
    ALTER TABLE "assessment_configs" ADD COLUMN "resolvedPlugins" ...
```

This `ALTER TABLE` targets a table no migration ever created.

Consequences before Phase 1B:

- `prisma migrate deploy` against an empty database **failed** — it tried to
  alter a non-existent table.
- `prisma migrate reset` dropped everything and replayed two migrations, one of
  which is comments, leaving a broken/empty database.
- `migration_lock.toml` was absent.
- The only working provisioning path was `prisma db push`.

## What replaced them

A single `<timestamp>_baseline` migration in `prisma/migrations/`, generated with
`prisma migrate diff --from-empty`, which creates every enum, table, foreign key,
unique constraint, index and default from scratch. It is verified to apply
cleanly to a genuinely empty database, and a second `migrate deploy` is a no-op.

The development database was regenerated rather than migrated: its contents were
disposable development data, so no backfill was required.
