'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Plus, FolderOpen, Globe, Activity, ChevronRight,
  Trash2, ExternalLink, Shield, Clock,
} from 'lucide-react';
import { projectsApi } from '@/lib/api';
import { formatRelative } from '@/lib/utils';
import type { Project } from '@/types';

const ENV_COLORS: Record<string, string> = {
  DEVELOPMENT: 'bg-emerald-500/10 text-emerald-400',
  STAGING: 'bg-yellow-500/10 text-yellow-400',
  PRODUCTION: 'bg-red-500/10 text-red-400',
};

export default function ProjectsPage() {
  const qc = useQueryClient();
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: projectsApi.list,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted');
    },
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Manage your API security projects
          </p>
        </div>
        <Link
          href="/projects/new"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !projects?.length ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
            <FolderOpen className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-white font-semibold mb-2">No projects yet</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm">
            Create your first project by importing an OpenAPI specification and configuring authentication.
          </p>
          <Link
            href="/projects/new"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create First Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onDelete={() => deleteMutation.mutate(project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  onDelete,
}: {
  project: Project;
  onDelete: () => void;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-violet-400" />
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${ENV_COLORS[project.environment] || ''}`}>
            {project.environment}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (confirm('Delete this project?')) onDelete();
            }}
            className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className="font-semibold text-white mb-1">{project.name}</h3>
      {project.description && (
        <p className="text-slate-500 text-xs mb-3 line-clamp-2">{project.description}</p>
      )}

      <div className="flex items-center gap-1.5 mb-4">
        <Globe className="w-3 h-3 text-slate-600" />
        <span className="text-slate-400 text-xs font-mono truncate">{project.baseUrl}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
        <div className="flex items-center gap-3 text-slate-500">
          <span className="flex items-center gap-1 text-xs">
            <Activity className="w-3 h-3" />
            {project._count?.assessments ?? 0} scans
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Clock className="w-3 h-3" />
            {formatRelative(project.updatedAt)}
          </span>
        </div>
        <Link
          href={`/projects/${project.id}`}
          className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          View <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
