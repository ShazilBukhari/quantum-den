import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/GlassCard';
import { Plus, Save, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { data } from '@/lib/data';
import { storage } from '@/utils/storage';
import { toast } from '@/hooks/use-toast';

interface ProjectForm {
  id: string;
  title: string;
  description: string;
  link: string;
}

export default function PortfolioBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id || '';

  const [about, setAbout] = useState('');
  const [skills, setSkills] = useState<string>('');
  const [projects, setProjects] = useState<ProjectForm[]>([]);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    if (!userId) navigate('/signin');
    try {
      const raw = localStorage.getItem(`rpg:${userId}:portfolio`);
      if (raw) {
        const parsed = JSON.parse(raw);
        setAbout(parsed.about || '');
        setSkills(parsed.skills || '');
        setProjects(parsed.projects || []);
      }
    } catch {}
  }, [userId, navigate]);

  const persist = () => {
    localStorage.setItem(
      `rpg:${userId}:portfolio`,
      JSON.stringify({ about, skills, projects })
    );
  };

  const addProject = () => {
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setProjects((p) => [...p, { id, title: '', description: '', link: '' }]);
  };

  const removeProject = (id: string) => {
    setProjects((p) => p.filter((x) => x.id !== id));
  };

  const saveDraft = async () => {
    setSaving(true);
    try {
      persist();
      await data.addActivity(userId, { action: 'Portfolio saved', details: `${projects.length} project(s)` });
      toast({ title: 'Saved', description: 'Your portfolio draft has been saved.' });
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    setPublishing(true);
    try {
      persist();
      const currentViews = storage.getPortfolioViews(userId);
      storage.setPortfolioViews(userId, currentViews + 1);
      await data.addActivity(userId, { action: 'Portfolio published', details: `${projects.length} project(s)` });
      toast({ title: 'Published', description: 'Your portfolio has been published.' });
      navigate('/dashboard');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container-max section-padding">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Portfolio Builder</h1>
            <p className="text-muted-foreground">Add projects and skills, then publish your portfolio.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button variant="outline" onClick={saveDraft} disabled={saving}>
              {saving ? 'Saving…' : (<><Save className="h-4 w-4 mr-2"/>Save Draft</>)}
            </Button>
            <Button onClick={publish} disabled={publishing}>
              {publishing ? 'Publishing…' : (<><Upload className="h-4 w-4 mr-2"/>Publish</>)}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-4">About You</h2>
              <Textarea value={about} onChange={(e) => setAbout(e.target.value)} rows={4} placeholder="Short bio or summary" />
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Projects</h2>
                <Button size="sm" onClick={addProject}><Plus className="h-4 w-4 mr-1"/>Add Project</Button>
              </div>
              <div className="space-y-6">
                {projects.length === 0 && (
                  <p className="text-sm text-muted-foreground">No projects yet. Add your first project.</p>
                )}
                {projects.map((p, idx) => (
                  <div key={p.id} className="p-4 border rounded-lg space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`title-${p.id}`}>Project Title</Label>
                        <Input id={`title-${p.id}`} value={p.title} onChange={(e) => setProjects(prev => prev.map(x => x.id === p.id ? { ...x, title: e.target.value } : x))} placeholder="e.g., E-commerce Platform" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`link-${p.id}`}>Project Link</Label>
                        <Input id={`link-${p.id}`} value={p.link} onChange={(e) => setProjects(prev => prev.map(x => x.id === p.id ? { ...x, link: e.target.value } : x))} placeholder="https://…" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`desc-${p.id}`}>Description</Label>
                      <Textarea id={`desc-${p.id}`} rows={3} value={p.description} onChange={(e) => setProjects(prev => prev.map(x => x.id === p.id ? { ...x, description: e.target.value } : x))} placeholder="What did you build? What was your impact?" />
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => removeProject(p.id)}>
                        <Trash2 className="h-4 w-4 mr-1"/>Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-4">Skills</h2>
              <Textarea value={skills} onChange={(e) => setSkills(e.target.value)} rows={8} placeholder="Comma-separated skills, e.g., React, TypeScript, Node.js" />
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
