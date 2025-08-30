import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { storage, type ResumeMeta, type PlanType, formatRelativeTime } from '@/utils/storage';
import { data } from '@/lib/data';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Plus,
  FileText,
  Globe,
  Download,
  Eye,
  CheckCircle,
  Circle,
  Crown,
  Settings,
  ArrowRight,
  Clock,
  Star,
  Trash2,
  Copy,
  Upload,
} from 'lucide-react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id || '';

  const [plan, setPlan] = useState<PlanType>('Free');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [onboardingProgress, setOnboardingProgress] = useState(storage.getOnboarding(userId || 'guest'));
  const [resumes, setResumes] = useState<ResumeMeta[]>(userId ? storage.getResumes(userId) : []);
  const [activity, setActivity] = useState(storage.getActivity(userId || 'guest'));
  const [portfolioViews, setPortfolioViews] = useState<number>(userId ? storage.getPortfolioViews(userId) : 0);

  useEffect(() => {
    const run = async () => {
      if (!userId) return;
      setPlan(storage.getPlan(userId));
      setOnboardingProgress(storage.getOnboarding(userId));
      setPortfolioViews(storage.getPortfolioViews(userId));
      const [list, act] = await Promise.all([
        data.getResumes(userId),
        data.getActivity(userId),
      ]);
      setResumes(list);
      setActivity(act);
    };
    run();
  }, [userId]);

  const onboardingSteps = [
    { key: 'personalInfo', label: 'Add Personal Info', description: 'Name, contact details, and summary' },
    { key: 'education', label: 'Add Education & Experience', description: 'Academic background and work history' },
    { key: 'projects', label: 'Add Projects & Skills', description: 'Showcase your best work and abilities' },
    { key: 'template', label: 'Pick Template', description: 'Choose from our professional designs' },
    { key: 'pdf', label: 'Generate PDF', description: 'Download your polished resume' },
    // { key: 'portfolio', label: 'Publish Portfolio', description: 'Share your work with the world' }
  ] as const;

  const completedSteps = Object.values(onboardingProgress).filter(Boolean).length;
  const progressPercentage = (completedSteps / Object.keys(onboardingProgress).length) * 100;

  const stats = useMemo(() => {
    const lastEdited = resumes.length
      ? formatRelativeTime([...resumes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0].updatedAt)
      : '—';
    const portfolioStatus = resumes.some(r => r.status === 'Published') ? 'Published' : 'Unpublished';
    return {
      resumes: resumes.length,
      portfolioViews,
      lastEdited,
      portfolioStatus,
    };
  }, [resumes, portfolioViews]);

  const recentResumes = useMemo(() => {
    return [...resumes]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 5);
  }, [resumes]);

const recentActivity = useMemo(() => 
    activity
      .filter(entry => entry.action !== "Portfolio published" && entry.action !== "Portfolio saved")
      .slice(0, 8),
  [activity]);
  const toggleStep = (step: keyof typeof onboardingProgress) => {
    const next = { ...onboardingProgress, [step]: !onboardingProgress[step] };
    setOnboardingProgress(next);
    if (userId) storage.setOnboarding(userId, next);
  };

  const createResume = async () => {
    if (!userId) return navigate('/signin');
    const current = await data.getResumes(userId);
    if (plan === 'Free' && current.length >= 1) {
      setShowUpgrade(true);
      return;
    }
    const baseName = 'Untitled Resume';
    const count = resumes.filter(r => r.name.startsWith(baseName)).length;
    const id = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
    const item: Omit<ResumeMeta, 'createdAt' | 'updatedAt'> = {
      id,
      name: count ? `${baseName} ${count + 1}` : baseName,
      template: 'modern',
      status: 'Draft',
    };
    const created = await data.addResume(userId, item);
    const [list, act] = await Promise.all([data.getResumes(userId), data.getActivity(userId)]);
    setResumes(list);
    setActivity(act);
    toast({ title: 'Resume created', description: created.name });
    navigate('/templates');
  };

  const publishResume = async (id: string) => {
    await data.updateResume(userId, id, { status: 'Published' });
    await data.addActivity(userId, { action: 'Portfolio published', details: 'Resume published' });
    const [list, act] = await Promise.all([data.getResumes(userId), data.getActivity(userId)]);
    setResumes(list);
    setActivity(act);
    toast({ title: 'Published', description: 'Your resume is now published.' });
  };

  const unpublishResume = async (id: string) => {
    await data.updateResume(userId, id, { status: 'Draft' });
    const list = await data.getResumes(userId);
    setResumes(list);
    toast({ title: 'Unpublished', description: 'Your resume is now a draft.' });
  };

  const removeResume = async (id: string) => {
    const found = resumes.find(r => r.id === id);
    await data.deleteResume(userId, id);
    const [list, act] = await Promise.all([data.getResumes(userId), data.getActivity(userId)]);
    setResumes(list);
    setActivity(act);
    toast({ title: 'Deleted', description: found?.name || 'Resume removed' });
  };

  const duplicateResume = async (id: string) => {
    if (!userId) return navigate('/signin');
    const current = await data.getResumes(userId);
    if (plan === 'Free' && current.length >= 1) {
      setShowUpgrade(true);
      return;
    }
    const copy = await data.duplicateResume(userId, id);
    if (copy) {
      const [list, act] = await Promise.all([data.getResumes(userId), data.getActivity(userId)]);
      setResumes(list);
      setActivity(act);
      toast({ title: 'Duplicated', description: copy.name });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container-max section-padding">
          <div className="h-8 w-64 bg-accent rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <GlassCard key={i} className="p-6">
                <div className="h-16 bg-accent rounded" />
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container-max section-padding">
          <GlassCard className="p-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Welcome to your Dashboard</h1>
            <p className="text-muted-foreground mb-6">Please sign in to access your resumes and portfolio.</p>
            <div className="flex justify-center gap-3">
              <Button asChild>
                <Link to="/signin">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/get-started">Get Started</Link>
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  const displayName = user.user_metadata?.first_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'There';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container-max section-padding">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2" data-user="name">
            Welcome back, {displayName}! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Let's continue building your career success story.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.resumes}</p>
                <p className="text-sm text-muted-foreground">Resumes Created</p>
              </div>
            </div>
          </GlassCard>

          {/* <GlassCard className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Eye className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.portfolioViews}</p>
                <p className="text-sm text-muted-foreground">Portfolio Views</p>
              </div>
            </div>
          </GlassCard> */}

          <GlassCard className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.lastEdited}</p>
                <p className="text-sm text-muted-foreground">Last Edited</p>
              </div>
            </div>
          </GlassCard>

          {/* <GlassCard className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Globe className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.portfolioStatus}</p>
                <p className="text-sm text-muted-foreground">Portfolio Status</p>
              </div>
            </div>
          </GlassCard> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Onboarding Checklist */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Getting Started Checklist</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-secondary rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground">{completedSteps}/{onboardingSteps.length}</span>
                </div>
              </div>

              <div className="space-y-4">
                {onboardingSteps.map((step) => (
                  <div key={step.key} className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleStep(step.key as keyof typeof onboardingProgress)}
                      className="mt-1 flex-shrink-0"
                    >
                      {onboardingProgress[step.key as keyof typeof onboardingProgress] ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h3 className={`font-medium ${onboardingProgress[step.key as keyof typeof onboardingProgress] ? 'line-through text-muted-foreground' : ''}`}>
                        {step.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {progressPercentage === 100 && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2">
                    <Star className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-700 dark:text-green-300">
                      Congratulations! You've completed all setup steps.
                    </span>
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Recent Resumes */}

            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Your Resumes</h2>
                
              </div>

              {recentResumes.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-3 opacity-60" />
                  <p>No resumes yet. Create your first one.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentResumes.map((resume) => (
                    <div key={resume.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-medium">{resume.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {String(resume.template).charAt(0).toUpperCase() + String(resume.template).slice(1)} • Last edited {formatRelativeTime(resume.updatedAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={resume.status === 'Published' ? 'default' : 'secondary'}>
                          {resume.status}
                        </Badge>
                        {resume.status === 'Draft' ? (
                          <Button size="sm" variant="outline" onClick={() => publishResume(resume.id)}>
                            <Upload className="h-4 w-4 mr-1" />
                            Publish
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => unpublishResume(resume.id)}>
                            Unpublish
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => duplicateResume(resume.id)}>
                          <Copy className="h-4 w-4 mr-1" />
                          Duplicate
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link to="/builder/resume">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => removeResume(resume.id)}>
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            {/* Recent Activity */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>

              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No activity yet.</div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((entry, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        {entry.action.includes('published') ? (
                          <Globe className="h-4 w-4 text-primary" />
                        ) : entry.action.includes('created') ? (
                          <FileText className="h-4 w-4 text-primary" />
                        ) : entry.action.includes('deleted') ? (
                          <Trash2 className="h-4 w-4 text-primary" />
                        ) : (
                          <Download className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{entry.action}</p>
                        {entry.details && (
                          <p className="text-sm text-muted-foreground">{entry.details}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(entry.time)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Status */}
            <GlassCard className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                {plan === 'Pro' && <Crown className="h-5 w-5 text-primary" />}
                <h3 className="font-semibold">
                  Plan: <span data-subscription="plan">{plan}</span>
                </h3>
              </div>

              {plan === 'Free' ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Upgrade to Pro to unlock unlimited resumes, advanced features, and priority support.
                  </p>
                  <Button className="w-full" asChild>
                    <Link to="/pricing#pro" data-billing="checkout">
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Pro
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    You have access to all Pro features including unlimited resumes and priority support.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" data-billing="portal" onClick={() => toast({ title: 'Billing portal', description: 'This would open your billing portal.' })}>
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Billing
                    </Button>
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Quick Actions */}
            <GlassCard className="p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>

              <div className="space-y-3">
                

                {/* <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/builder/portfolio">
                    <Globe className="h-4 w-4 mr-2" />
                    Build Portfolio
                  </Link>
                </Button> */}

                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/templates">
                    <Eye className="h-4 w-4 mr-2" />
                    Browse Templates
                  </Link>
                </Button>

                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/account">
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Link>
                </Button>
              </div>
            </GlassCard>

            {/* Help & Support */}
            <GlassCard className="p-6">
              <h3 className="font-semibold mb-4">Need Help?</h3>

              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/support">
                    Help Center
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Link>
                </Button>

                <div className="text-sm text-muted-foreground">
                  <p>📧 support@rpgenerator.com</p>
                  <p className="mt-1">
                    {plan === 'Pro' ? '⚡ Priority support' : '💬 Community support'}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to create more resumes</DialogTitle>
            <DialogDescription>
              Free plan includes 1 resume. Upgrade to Pro for unlimited resumes, premium templates, and more.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setShowUpgrade(false)}>Maybe later</Button>
            <Button asChild>
              <Link to="/pricing#pro">Upgrade to Pro</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
