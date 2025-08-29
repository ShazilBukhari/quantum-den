import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { data } from '@/lib/data';
import { storage, type PlanType } from '@/utils/storage';
import {
  User as UserIcon,
  Shield,
  Bell,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Check,
  CreditCard,
  Crown,
  Edit,
  Save,
  X,
  LogOut,
} from 'lucide-react';

export default function Account() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id || '';

  const [plan, setPlan] = useState<PlanType>('Free');
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'subscription' | 'notifications' | 'privacy'>('profile');

  // Profile state
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // Settings state (local)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
    portfolioAnalytics: true,
    autoSave: true,
    twoFactorAuth: false,
  });

  // Stats
  const [resumesCount, setResumesCount] = useState(0);
  const [portfolioViews, setPortfolioViews] = useState(0);
  const [lastActivity, setLastActivity] = useState<string>('—');

  useEffect(() => {
    if (!userId) {
      navigate('/signin');
      return;
    }
    setPlan(storage.getPlan(userId));
    setPortfolioViews(storage.getPortfolioViews(userId));

    // Load profile from Supabase metadata
    const fn = async () => {
      const { data: u } = await supabase.auth.getUser();
      const meta = u.user?.user_metadata || {};
      setProfile({
        firstName: meta.first_name || meta.firstName || '',
        lastName: meta.last_name || meta.lastName || '',
        email: u.user?.email || '',
        phone: meta.phone || '',
        location: meta.location || '',
        bio: meta.bio || '',
      });
      const [resumes, activity] = await Promise.all([data.getResumes(userId), data.getActivity(userId)]);
      setResumesCount(resumes.length);
      setLastActivity(activity[0]?.time ? new Date(activity[0].time).toLocaleString() : '—');

      // Load settings from localStorage
      try {
        const raw = localStorage.getItem(`rpg:${userId}:settings`);
        if (raw) setSettings({ ...settings, ...(JSON.parse(raw) || {}) });
      } catch {}
    };
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    localStorage.setItem(`rpg:${userId}:settings`, JSON.stringify(settings));
  }, [settings, userId]);

  const accountStats = useMemo(() => ({
    resumesCreated: resumesCount,
    portfolioViews,
    lastActive: lastActivity,
  }), [resumesCount, portfolioViews, lastActivity]);

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'subscription', label: 'Subscription', icon: Crown },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Data', icon: Shield },
  ] as const;

  const handleSaveProfile = async () => {
    try {
      const full_name = `${profile.firstName} ${profile.lastName}`.trim();
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: profile.firstName,
          last_name: profile.lastName,
          full_name,
          phone: profile.phone,
          location: profile.location,
          bio: profile.bio,
        },
      });
      if (error) throw error;
      setIsEditing(false);
      await data.addActivity(userId, { action: 'Profile updated', details: full_name });
      toast({ title: 'Profile saved', description: 'Your profile has been updated.' });
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to save profile.' });
    }
  };

  const handlePasswordChange = async () => {
    if (!passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: 'Password mismatch', description: 'Please confirm your new password.' });
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
      if (error) throw error;
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      await data.addActivity(userId, { action: 'Password changed', details: undefined });
      toast({ title: 'Password updated', description: 'Your password has been changed.' });
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to update password.' });
    }
  };

  const handleExportData = async () => {
    const [resumes, activity] = await Promise.all([data.getResumes(userId), data.getActivity(userId)]);
    const onboarding = storage.getOnboarding(userId);
    const portfolioRaw = localStorage.getItem(`rpg:${userId}:portfolio`);
    const settingsRaw = localStorage.getItem(`rpg:${userId}:settings`);
    const payload = {
      user: { id: userId, email: profile.email, firstName: profile.firstName, lastName: profile.lastName },
      plan,
      resumes,
      activity,
      onboarding,
      portfolio: portfolioRaw ? JSON.parse(portfolioRaw) : null,
      settings: settingsRaw ? JSON.parse(settingsRaw) : settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'account-export.json';
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Exported', description: 'Your data has been downloaded.' });
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Account deletion requires manual review. This will sign you out and clear local data. Continue?')) return;
    try {
      localStorage.removeItem(`rpg:${userId}:portfolio`);
      localStorage.removeItem(`rpg:${userId}:settings`);
      await data.addActivity(userId, { action: 'Account deletion requested', details: undefined });
      await signOut();
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Failed to process deletion request.' });
    }
  };

  if (!userId) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container-max section-padding">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Account Settings</h1>
          <p className="text-muted-foreground text-lg">Manage your profile, security, and subscription preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <GlassCard className="p-6">
              <div className="space-y-2">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as any)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === item.id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent text-muted-foreground'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4 text-sm">
                <h3 className="font-semibold">Account Overview</h3>
                <div className="flex justify-between"><span className="text-muted-foreground">Resumes</span><span className="font-medium">{accountStats.resumesCreated}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Portfolio Views</span><span className="font-medium">{accountStats.portfolioViews}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Last Active</span><span className="font-medium">{accountStats.lastActive}</span></div>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-3">
            {activeSection === 'profile' && (
              <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Profile Information</h2>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline"><Edit className="h-4 w-4 mr-2"/>Edit Profile</Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveProfile} size="sm"><Save className="h-4 w-4 mr-2"/>Save</Button>
                      <Button onClick={() => { setIsEditing(false); }} variant="outline" size="sm"><X className="h-4 w-4 mr-2"/>Cancel</Button>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center"><UserIcon className="h-10 w-10 text-primary" /></div>
                    <div>
                      <h3 className="font-semibold">{profile.firstName || profile.lastName ? `${profile.firstName} ${profile.lastName}` : profile.email}</h3>
                      <p className="text-muted-foreground">{profile.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={profile.firstName} onChange={(e) => setProfile(p => ({ ...p, firstName: e.target.value }))} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={profile.lastName} onChange={(e) => setProfile(p => ({ ...p, lastName: e.target.value }))} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={profile.email} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={profile.phone} onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" value={profile.location} onChange={(e) => setProfile(p => ({ ...p, location: e.target.value }))} disabled={!isEditing} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea id="bio" rows={3} value={profile.bio} onChange={(e) => setProfile(p => ({ ...p, bio: e.target.value }))} disabled={!isEditing} placeholder="Tell us about yourself..." />
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}

            {activeSection === 'security' && (
              <GlassCard className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Security Settings</h2>
                <div className="space-y-6 max-w-md">
                  <div>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative mt-2">
                      <Input id="currentPassword" type={showCurrentPassword ? 'text' : 'password'} value={passwordData.currentPassword} onChange={(e) => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))} />
                      <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showCurrentPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative mt-2">
                      <Input id="newPassword" type={showNewPassword ? 'text' : 'password'} value={passwordData.newPassword} onChange={(e) => setPasswordData(p => ({ ...p, newPassword: e.target.value }))} />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {showNewPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))} />
                  </div>
                  <Button onClick={handlePasswordChange}><Check className="h-4 w-4 mr-2"/>Update Password</Button>

                  <Separator className="my-6" />
                  <div>
                    <p className="text-muted-foreground mb-4">Sign out of your account on this device.</p>
                    <Button variant="outline" data-auth="signout" onClick={() => signOut()}><LogOut className="h-4 w-4 mr-2"/>Sign Out</Button>
                  </div>
                </div>
              </GlassCard>
            )}

            {activeSection === 'subscription' && (
              <GlassCard className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Subscription</h2>
                  <Badge className={plan === 'Pro' ? 'bg-primary' : 'bg-secondary'}>
                    {plan === 'Pro' && <Crown className="h-3 w-3 mr-1"/>}
                    {plan} Plan
                  </Badge>
                </div>
                <div className="p-6 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{plan} Plan</h3>
                      <p className="text-muted-foreground">{plan === 'Pro' ? 'All features unlocked' : 'Free plan with basic features'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{plan === 'Pro' ? '₹200' : '$0'}</div>
                      <div className="text-sm text-muted-foreground">{plan === 'Pro' ? '/month' : 'forever'}</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {plan === 'Free' ? (
                      <Button asChild data-billing="checkout"><Link to="/pricing#pro"><Crown className="h-4 w-4 mr-2"/>Upgrade to Pro</Link></Button>
                    ) : (
                      <Button variant="outline" data-billing="portal"><CreditCard className="h-4 w-4 mr-2"/>Manage Billing</Button>
                    )}
                  </div>
                </div>
              </GlassCard>
            )}

            {activeSection === 'notifications' && (
              <GlassCard className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  {([
                    { key: 'emailNotifications', title: 'Email Notifications', desc: 'Receive updates about your account and resumes' },
                    { key: 'marketingEmails', title: 'Marketing Emails', desc: 'Get tips, feature updates, and special offers' },
                    { key: 'securityAlerts', title: 'Security Alerts', desc: 'Important security updates and login notifications' },
                    { key: 'portfolioAnalytics', title: 'Portfolio Analytics', desc: 'Weekly reports about your portfolio performance' },
                    { key: 'autoSave', title: 'Auto-Save', desc: 'Automatically save your work as you type' },
                    { key: 'twoFactorAuth', title: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account' },
                  ] as const).map((row) => (
                    <div key={row.key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{row.title}</p>
                        <p className="text-sm text-muted-foreground">{row.desc}</p>
                      </div>
                      <Switch checked={(settings as any)[row.key]} onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, [row.key]: checked }))} />
                    </div>
                  ))}
                  <Button onClick={() => toast({ title: 'Preferences saved' })}><Check className="h-4 w-4 mr-2"/>Save Preferences</Button>
                </div>
              </GlassCard>
            )}

            {activeSection === 'privacy' && (
              <GlassCard className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Privacy & Data</h2>
                <div className="space-y-6">
                  <div className="p-6 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Export Your Data</h3>
                    <p className="text-muted-foreground mb-4">Download all your personal data, resumes, and portfolio information.</p>
                    <Button onClick={handleExportData} variant="outline"><Download className="h-4 w-4 mr-2"/>Export Data</Button>
                  </div>
                  <div className="p-6 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10 dark:border-red-800">
                    <div className="flex items-start space-x-3">
                      <Trash2 className="h-5 w-5 text-red-500 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-red-900 dark:text-red-100 mb-2">Delete Account</h3>
                        <p className="text-red-700 dark:text-red-200 mb-4">Account deletion requires manual review. We will process your request as soon as possible.</p>
                        <Button onClick={handleDeleteAccount} variant="destructive" data-billing="cancel">Delete Account</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
