import { TemplateType } from '@/types/resume';

export type PlanType = 'Free' | 'Pro';

export type ResumeStatus = 'Draft' | 'Published';

export interface ResumeMeta {
  id: string;
  name: string;
  template: TemplateType | 'corporate' | 'modern' | 'creative';
  status: ResumeStatus;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export interface OnboardingProgress {
  personalInfo: boolean;
  education: boolean;
  experience: boolean;
  projects: boolean;
  skills: boolean;
  template: boolean;
  pdf: boolean;
  portfolio: boolean;
}

export interface ActivityEntry {
  action: string;
  details?: string;
  time: string; // ISO
}

const base = (userId: string) => `rpg:${userId}`;
const keys = (userId: string) => ({
  resumes: `${base(userId)}:resumes`,
  onboarding: `${base(userId)}:onboarding`,
  plan: `${base(userId)}:plan`,
  portfolioViews: `${base(userId)}:portfolioViews`,
  activity: `${base(userId)}:activity`,
});

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export const storage = {
  getPlan(userId: string): PlanType {
    const { plan } = keys(userId);
    return readJSON<PlanType>(plan, 'Free');
  },
  setPlan(userId: string, planValue: PlanType) {
    const { plan } = keys(userId);
    writeJSON(plan, planValue);
  },
  getResumes(userId: string): ResumeMeta[] {
    const { resumes } = keys(userId);
    const list = readJSON<ResumeMeta[]>(resumes, []);
    return Array.isArray(list) ? list : [];
  },
  saveResumes(userId: string, list: ResumeMeta[]) {
    const { resumes } = keys(userId);
    writeJSON(resumes, list);
  },
  addResume(userId: string, item: Omit<ResumeMeta, 'createdAt' | 'updatedAt'>): ResumeMeta {
    const now = new Date().toISOString();
    const newItem: ResumeMeta = { ...item, createdAt: now, updatedAt: now };
    const list = storage.getResumes(userId);
    storage.saveResumes(userId, [newItem, ...list]);
    storage.addActivity(userId, { action: 'Resume created', details: newItem.name });
    return newItem;
  },
  updateResume(userId: string, id: string, updates: Partial<ResumeMeta>) {
    const list = storage.getResumes(userId);
    const now = new Date().toISOString();
    const updated = list.map(r => (r.id === id ? { ...r, ...updates, updatedAt: now } : r));
    storage.saveResumes(userId, updated);
  },
  deleteResume(userId: string, id: string) {
    const list = storage.getResumes(userId);
    const found = list.find(r => r.id === id);
    storage.saveResumes(userId, list.filter(r => r.id !== id));
    if (found) storage.addActivity(userId, { action: 'Resume deleted', details: found.name });
  },
  duplicateResume(userId: string, id: string): ResumeMeta | null {
    const list = storage.getResumes(userId);
    const src = list.find(r => r.id === id);
    if (!src) return null;
    const copy: ResumeMeta = {
      ...src,
      id: crypto.randomUUID(),
      name: `${src.name} (Copy)`,
      status: 'Draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storage.saveResumes(userId, [copy, ...list]);
    storage.addActivity(userId, { action: 'Resume duplicated', details: copy.name });
    return copy;
  },
  getOnboarding(userId: string): OnboardingProgress {
    const { onboarding } = keys(userId);
    return readJSON<OnboardingProgress>(onboarding, {
      personalInfo: false,
      education: false,
      experience: false,
      projects: false,
      skills: false,
      template: false,
      pdf: false,
      portfolio: false,
    });
  },
  setOnboarding(userId: string, value: OnboardingProgress) {
    const { onboarding } = keys(userId);
    writeJSON(onboarding, value);
  },
  getPortfolioViews(userId: string): number {
    const { portfolioViews } = keys(userId);
    return readJSON<number>(portfolioViews, 0);
  },
  setPortfolioViews(userId: string, value: number) {
    const { portfolioViews } = keys(userId);
    writeJSON(portfolioViews, value);
  },
  getActivity(userId: string): ActivityEntry[] {
    const { activity } = keys(userId);
    return readJSON<ActivityEntry[]>(activity, []);
  },
  addActivity(userId: string, entry: Omit<ActivityEntry, 'time'>) {
    const { activity } = keys(userId);
    const list = storage.getActivity(userId);
    const newEntry: ActivityEntry = { ...entry, time: new Date().toISOString() };
    writeJSON(activity, [newEntry, ...list].slice(0, 20));
  },
};

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.floor(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  const y = Math.floor(mo / 12);
  return `${y}y ago`;
}
