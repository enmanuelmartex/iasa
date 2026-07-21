import type { PluginManifest } from '../scanner/types/plugin-manifest.types';

/**
 * Validates the rule declarations of every registered plugin.
 *
 * Rule ids are part of the issue fingerprint, so a duplicate id silently merges
 * two different vulnerabilities into one issue, and an unstable id silently
 * splits one vulnerability across many. Neither surfaces as an error at scan
 * time — the data is simply wrong — so this runs at boot and fails startup.
 *
 * Pure function over manifests so it is testable without a Nest context.
 * Returns every problem found rather than the first, so a maintainer adding a
 * plugin sees the full picture at once.
 */
export function findRuleDeclarationProblems(
  manifests: readonly PluginManifest[],
): string[] {
  const problems: string[] = [];
  /** ruleId → the plugin that declared it, for collision reporting. */
  const owners = new Map<string, string>();

  for (const manifest of manifests) {
    const { id, ruleNamespace, ruleIds } = manifest;

    if (!ruleNamespace?.trim()) {
      problems.push(`Plugin "${id}" declares no ruleNamespace.`);
      continue;
    }

    if (!ruleIds?.length) {
      problems.push(
        `Plugin "${id}" declares no ruleIds. A plugin that can emit a finding must ` +
          `declare every rule it produces, otherwise a finding could be persisted ` +
          `without a stable identity.`,
      );
      continue;
    }

    const seenInPlugin = new Set<string>();

    for (const ruleId of ruleIds) {
      if (!ruleId?.trim()) {
        problems.push(`Plugin "${id}" declares an empty ruleId.`);
        continue;
      }
      if (!ruleId.includes('.')) {
        problems.push(
          `Rule "${ruleId}" (plugin "${id}") is not namespaced. Expected "<namespace>.<rule>".`,
        );
        continue;
      }
      if (!ruleId.startsWith(`${ruleNamespace}.`)) {
        problems.push(
          `Rule "${ruleId}" (plugin "${id}") does not start with its declared namespace "${ruleNamespace}.".`,
        );
        continue;
      }
      if (seenInPlugin.has(ruleId)) {
        problems.push(`Plugin "${id}" declares "${ruleId}" more than once.`);
        continue;
      }
      const owner = owners.get(ruleId);
      if (owner) {
        problems.push(`Rule "${ruleId}" is declared by both "${owner}" and "${id}".`);
        continue;
      }
      seenInPlugin.add(ruleId);
      owners.set(ruleId, id);
    }
  }

  return problems;
}

/** Every valid rule id across the given manifests. */
export function collectDeclaredRuleIds(
  manifests: readonly PluginManifest[],
): Set<string> {
  const ids = new Set<string>();
  for (const manifest of manifests) {
    for (const ruleId of manifest.ruleIds ?? []) {
      if (ruleId?.trim()) ids.add(ruleId);
    }
  }
  return ids;
}
