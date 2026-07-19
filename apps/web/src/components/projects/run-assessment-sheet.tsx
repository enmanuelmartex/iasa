'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  IconBolt,
  IconCheck,
  IconLayersLinked,
  IconPlug,
  IconShieldCheck,
} from '@tabler/icons-react';
import { toast } from 'sonner';
import { assessmentsApi, pluginsApi, profilesApi } from '@/lib/api';
import type { Assessment, Plugin, Project, ScanProfile } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

type ExecutionMode = 'all' | 'profile' | 'manual';

function getErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.error ?? error.response?.data?.message;
    if (typeof message === 'string') return message;
  }
  return 'The assessment could not be started. Please try again.';
}

export function RunAssessmentSheet({ project }: { project: Project }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ExecutionMode>('all');
  const [profileId, setProfileId] = useState('');
  const [manualPluginIds, setManualPluginIds] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState('');

  const pluginsQuery = useQuery<Plugin[]>({
    queryKey: ['plugins'],
    queryFn: pluginsApi.list,
    enabled: open,
  });
  const profilesQuery = useQuery<ScanProfile[]>({
    queryKey: ['plugin-profiles'],
    queryFn: profilesApi.list,
    enabled: open,
  });

  const plugins = pluginsQuery.data ?? [];
  const enabledPlugins = useMemo(() => plugins.filter((plugin) => plugin.isEnabled), [plugins]);
  const customProfiles = useMemo(
    () => (profilesQuery.data ?? []).filter((profile) => !profile.isSystem),
    [profilesQuery.data],
  );
  const selectedProfile = customProfiles.find((profile) => profile.id === profileId);
  const selectedPlugins = useMemo(() => {
    if (mode === 'all') return enabledPlugins;
    if (mode === 'profile') {
      const ids = new Set(selectedProfile?.enabledPlugins ?? []);
      return enabledPlugins.filter((plugin) => ids.has(plugin.id));
    }
    const ids = new Set(manualPluginIds);
    return enabledPlugins.filter((plugin) => ids.has(plugin.id));
  }, [enabledPlugins, manualPluginIds, mode, selectedProfile]);

  const hasEndpoints = Boolean(project.apiSpec?.endpoints?.length);
  const isValid = hasEndpoints && selectedPlugins.length > 0 && (mode !== 'profile' || Boolean(profileId));

  const mutation = useMutation<Assessment>({
    mutationFn: () => assessmentsApi.run(project.id, {
      executionMode: mode,
      scanProfileId: mode === 'profile' ? profileId : undefined,
      manualPlugins: mode === 'manual' ? manualPluginIds : undefined,
    }),
    onMutate: () => setSubmitError(''),
    onSuccess: (assessment) => {
      queryClient.setQueryData<Project>(['projects', project.id], (current) => current ? {
        ...current,
        assessments: [assessment, ...(current.assessments ?? []).filter((item) => item.id !== assessment.id)].slice(0, 5),
      } : current);
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      setOpen(false);
      toast.success('Assessment queued', { description: `${selectedPlugins.length} plugins will run against ${project.name}.` });

      const token = window.localStorage.getItem('iasa_token');
      if (token) {
        const stream = assessmentsApi.streamProgress(assessment.id, token);
        stream.onmessage = (event) => {
          queryClient.invalidateQueries({ queryKey: ['projects', project.id] });
          try {
            const progress = JSON.parse(event.data) as { completed?: boolean; error?: string };
            if (progress.completed || progress.error) stream.close();
          } catch {
            // A malformed progress event must not interrupt the assessment itself.
          }
        };
        stream.onerror = () => stream.close();
      }
    },
    onError: (error) => setSubmitError(getErrorMessage(error)),
  });

  useEffect(() => {
    if (!open) {
      setMode('all');
      setProfileId('');
      setManualPluginIds([]);
      setSubmitError('');
    }
  }, [open]);

  const toggleManualPlugin = (pluginId: string, checked: boolean) => {
    setManualPluginIds((current) => checked
      ? [...new Set([...current, pluginId])]
      : current.filter((id) => id !== pluginId));
  };

  return (
    <Sheet open={open} onOpenChange={(nextOpen) => !mutation.isPending && setOpen(nextOpen)}>
      <SheetTrigger asChild>
        <Button disabled={project.status !== 'READY'}><IconShieldCheck />Run Assessment</Button>
      </SheetTrigger>
      <SheetContent className="flex h-dvh w-full flex-col p-0 sm:max-w-xl">
        <SheetHeader className="border-b pr-12">
          <SheetTitle>Run Assessment</SheetTitle>
          <SheetDescription>Choose exactly which enabled security plugins should scan this project.</SheetDescription>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-6 p-5">
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">Execution mode</legend>
              <RadioGroup value={mode} onValueChange={(value) => { setMode(value as ExecutionMode); setSubmitError(''); }}>
                {[
                  { value: 'all', title: 'All enabled plugins', description: 'Run every plugin currently enabled in your plugin settings.', icon: IconBolt },
                  { value: 'profile', title: 'Custom profile', description: 'Use only the enabled plugins saved in one of your profiles.', icon: IconLayersLinked },
                  { value: 'manual', title: 'Individual plugins', description: 'Select one or more enabled plugins for this assessment.', icon: IconPlug },
                ].map((option) => {
                  const Icon = option.icon;
                  const selected = mode === option.value;
                  return (
                    <label key={option.value} className={cn('flex min-h-16 cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors', selected ? 'border-primary bg-primary/5' : 'hover:bg-accent/50')}>
                      <RadioGroupItem value={option.value} className="mt-1" />
                      <Icon className="mt-0.5 size-5 text-muted-foreground" />
                      <span className="min-w-0 flex-1"><span className="block text-sm font-medium">{option.title}</span><span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{option.description}</span></span>
                    </label>
                  );
                })}
              </RadioGroup>
            </fieldset>

            {mode === 'profile' && (
              <section aria-labelledby="profile-heading" className="space-y-3">
                <h3 id="profile-heading" className="text-sm font-medium">Select a custom profile</h3>
                {profilesQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading profiles…</p> : customProfiles.length ? (
                  <RadioGroup value={profileId} onValueChange={setProfileId}>
                    {customProfiles.map((profile) => {
                      const profilePlugins = profile.enabledPlugins.map((id) => plugins.find((plugin) => plugin.id === id)).filter(Boolean) as Plugin[];
                      return (
                        <label key={profile.id} className={cn('flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors', profileId === profile.id ? 'border-primary bg-primary/5' : 'hover:bg-accent/50')}>
                          <RadioGroupItem value={profile.id} className="mt-1" />
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2"><span className="text-sm font-medium">{profile.name}</span><Badge variant="secondary">{profile.enabledPlugins.length} plugins</Badge></span>
                            {profile.description && <span className="mt-1 block text-xs leading-5 text-muted-foreground">{profile.description}</span>}
                            {profilePlugins.length > 0 && <span className="mt-2 block truncate text-xs text-muted-foreground">{profilePlugins.slice(0, 4).map((plugin) => plugin.name).join(', ')}{profilePlugins.length > 4 ? ` +${profilePlugins.length - 4} more` : ''}</span>}
                          </span>
                        </label>
                      );
                    })}
                  </RadioGroup>
                ) : (
                  <div className="rounded-lg border border-dashed p-4 text-center"><p className="text-sm font-medium">No custom profiles yet</p><p className="mt-1 text-xs text-muted-foreground">Create a reusable plugin selection, then return here to run it.</p><Button asChild variant="link" size="sm" className="mt-2"><Link href="/plugins/profiles">Create a profile</Link></Button></div>
                )}
              </section>
            )}

            {mode === 'manual' && (
              <section aria-labelledby="plugins-heading" className="space-y-3">
                <div className="flex items-center justify-between"><h3 id="plugins-heading" className="text-sm font-medium">Select plugins</h3><span className="text-xs text-muted-foreground">{manualPluginIds.length} selected</span></div>
                {pluginsQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading plugins…</p> : enabledPlugins.length ? (
                  <div className="space-y-2">
                    {enabledPlugins.map((plugin) => <label key={plugin.id} className="flex min-h-14 cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"><Checkbox checked={manualPluginIds.includes(plugin.id)} onCheckedChange={(checked) => toggleManualPlugin(plugin.id, checked === true)} className="mt-0.5" /><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="text-sm font-medium">{plugin.name}</span><Badge variant="outline">{plugin.category}</Badge></span><span className="mt-0.5 block text-xs text-muted-foreground">{plugin.description}</span></span></label>)}
                  </div>
                ) : <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">No plugins are enabled. Enable at least one plugin before running an assessment.</div>}
              </section>
            )}

            <section aria-labelledby="summary-heading" className="rounded-lg border bg-muted/30 p-4">
              <h3 id="summary-heading" className="text-sm font-medium">Run summary</h3>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-xs"><dt className="text-muted-foreground">Project</dt><dd className="text-right font-medium">{project.name}</dd><dt className="text-muted-foreground">Mode</dt><dd className="text-right font-medium">{{ all: 'All enabled', profile: 'Custom profile', manual: 'Individual plugins' }[mode]}</dd>{selectedProfile && <><dt className="text-muted-foreground">Profile</dt><dd className="text-right font-medium">{selectedProfile.name}</dd></>}<dt className="text-muted-foreground">Plugins</dt><dd className="text-right font-medium">{selectedPlugins.length}</dd><dt className="text-muted-foreground">Endpoints</dt><dd className="text-right font-medium">{project.apiSpec?.endpoints?.length ?? 0}</dd><dt className="text-muted-foreground">Environment</dt><dd className="text-right font-medium">{project.environment}</dd></dl>
              {selectedPlugins.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{selectedPlugins.map((plugin) => <Badge key={plugin.id} variant="secondary">{plugin.name}</Badge>)}</div>}
              <p className="mt-3 flex gap-2 border-t pt-3 text-xs leading-5 text-muted-foreground"><IconCheck className="mt-0.5 size-4 shrink-0" />The assessment may take several minutes. You can follow its status in Recent assessments.</p>
            </section>

            {!hasEndpoints && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">Import an OpenAPI specification with at least one endpoint before running an assessment.</p>}
            {submitError && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{submitError}</p>}
          </div>
        </ScrollArea>

        <SheetFooter className="border-t bg-card">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={mutation.isPending}>Cancel</Button>
          <Button onClick={() => mutation.mutate()} disabled={!isValid || pluginsQuery.isLoading || profilesQuery.isLoading} loading={mutation.isPending}>Run Assessment</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
