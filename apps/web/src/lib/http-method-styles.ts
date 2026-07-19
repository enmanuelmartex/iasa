export function getHttpMethodStyles(method: string) {
  const styles: Record<string, string> = {
    GET: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    POST: 'border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-400',
    PUT: 'border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    PATCH: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
    DELETE: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
    OPTIONS: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
    HEAD: 'border-slate-500/30 bg-slate-500/10 text-slate-600 dark:text-slate-400',
  };

  return styles[method.toUpperCase()] ?? styles.HEAD;
}
