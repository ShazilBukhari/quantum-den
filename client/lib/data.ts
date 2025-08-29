import { supabase } from '@/lib/supabase';
import { storage, type ResumeMeta, type ActivityEntry } from '@/utils/storage';

// Helpers to map between DB snake_case and app camelCase
function mapDbToResume(row: any): ResumeMeta {
  return {
    id: row.id,
    name: row.name,
    template: row.template,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapResumeToDb(userId: string, data: ResumeMeta | Omit<ResumeMeta, 'createdAt' | 'updatedAt'>) {
  return {
    id: (data as any).id,
    user_id: userId,
    name: data.name,
    template: data.template,
    status: data.status,
  };
}

function canUseSupabase() {
  return typeof window !== 'undefined';
}

export const data = {
  async getResumes(userId: string): Promise<ResumeMeta[]> {
    if (!userId || !canUseSupabase()) return storage.getResumes(userId || 'guest');
    try {
      const { data: rows, error } = await supabase
        .from('resumes')
        .select('id,name,template,status,created_at,updated_at')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });
      if (error || !rows) throw error || new Error('No data');
      return rows.map(mapDbToResume);
    } catch {
      return storage.getResumes(userId);
    }
  },

  async addResume(userId: string, item: Omit<ResumeMeta, 'createdAt' | 'updatedAt'>): Promise<ResumeMeta> {
    if (!userId || !canUseSupabase()) return storage.addResume(userId || 'guest', item);
    try {
      const payload = mapResumeToDb(userId, item);
      const { data: rows, error } = await supabase
        .from('resumes')
        .insert(payload)
        .select('id,name,template,status,created_at,updated_at')
        .single();
      if (error || !rows) throw error || new Error('Insert failed');
      const created = mapDbToResume(rows);
      await this.addActivity(userId, { action: 'Resume created', details: created.name });
      return created;
    } catch {
      return storage.addResume(userId, item);
    }
  },

  async updateResume(userId: string, id: string, updates: Partial<ResumeMeta>): Promise<void> {
    if (!userId || !canUseSupabase()) return void storage.updateResume(userId || 'guest', id, updates);
    try {
      const payload: any = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.template !== undefined) payload.template = updates.template;
      if (updates.status !== undefined) payload.status = updates.status;
      const { error } = await supabase.from('resumes').update(payload).eq('id', id).eq('user_id', userId);
      if (error) throw error;
    } catch {
      storage.updateResume(userId, id, updates);
    }
  },

  async deleteResume(userId: string, id: string): Promise<void> {
    if (!userId || !canUseSupabase()) return void storage.deleteResume(userId || 'guest', id);
    try {
      const { error } = await supabase.from('resumes').delete().eq('id', id).eq('user_id', userId);
      if (error) throw error;
    } catch {
      storage.deleteResume(userId, id);
    }
  },

  async duplicateResume(userId: string, id: string): Promise<ResumeMeta | null> {
    if (!userId || !canUseSupabase()) return storage.duplicateResume(userId || 'guest', id);
    try {
      const list = await this.getResumes(userId);
      const src = list.find(r => r.id === id);
      if (!src) return null;
      const copyBase: Omit<ResumeMeta, 'createdAt' | 'updatedAt'> = {
        id: crypto.randomUUID(),
        name: `${src.name} (Copy)`,
        template: src.template as ResumeMeta['template'],
        status: 'Draft',
      };
      return await this.addResume(userId, copyBase);
    } catch {
      return storage.duplicateResume(userId, id);
    }
  },

  async getActivity(userId: string): Promise<ActivityEntry[]> {
    if (!userId || !canUseSupabase()) return storage.getActivity(userId || 'guest');
    try {
      const { data: rows, error } = await supabase
        .from('activity_logs')
        .select('action,details,created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
      if (error || !rows) throw error || new Error('No activity');
      return rows.map((r) => ({ action: r.action, details: r.details || undefined, time: r.created_at }));
    } catch {
      return storage.getActivity(userId);
    }
  },

  async addActivity(userId: string, entry: Omit<ActivityEntry, 'time'>): Promise<void> {
    if (!userId || !canUseSupabase()) return void storage.addActivity(userId || 'guest', entry);
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({ user_id: userId, action: entry.action, details: entry.details || null });
      if (error) throw error;
    } catch {
      storage.addActivity(userId, entry);
    }
  },
};
