import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/GlassCard';
import { FeatureCard } from '@/components/FeatureCard';
import { TemplateCard } from '@/components/TemplateCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  FileText, 
  Download, 
  Globe, 
  Database, 
  Users, 
  BarChart, 
  Play, 
  Edit, 
  Share,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { data } from '@/lib/data';
import { storage } from '@/utils/storage';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false as any);
  const features = [
    {
      icon: FileText,
      title: '3 Polished Templates',
      description: 'Corporate, Modern, and Creative templates designed by professionals for maximum impact.',
      badge: 'ATS-Friendly'
    },
    {
      icon: Download,
      title: 'Live Preview & Instant PDF',
      description: 'See changes in real-time and download publication-ready PDFs with a single click.',
      badge: 'PDF-Ready'
    },
    {
      icon: Globe,
      title: 'Portfolio Site Builder',
      description: 'Create a stunning portfolio website to showcase your projects and skills online.',
      badge: 'Recruiter-Ready'
    },
    {
      icon: Database,
      title: 'Autosave to Cloud',
      description: 'Your work is automatically saved to Supabase, ensuring you never lose your progress.',
    },
    {
      icon: Users,
      title: 'Role-based Sections',
      description: 'Tailored sections for Interns, Fresh Graduates, and Experienced Professionals.',
    },
    {
      icon: BarChart,
      title: 'Analytics & Error Tracking',
      description: 'Monitor your portfolio performance and catch issues early with highlight.io integration.',
    },
  ];

  const templates = [
    {
      name: 'Corporate',
      description: 'Clean, professional design perfect for traditional industries and corporate roles.',
      image: '/placeholder.svg',
      badges: ['ATS-Friendly', 'Professional']
    },
    {
      name: 'Modern',
      description: 'Contemporary layout with subtle colors, ideal for tech and creative professionals.',
      image: '/placeholder.svg',
      badges: ['Tech-Focused', 'Creative']
    },
    {
      name: 'Creative',
      description: 'Bold, artistic design that stands out for designers and creative professionals.',
      image: '/placeholder.svg',
      badges: ['Eye-Catching', 'Designer-Approved']
    },
  ];

  const companies = [
    'Microsoft', 'Google', 'Apple', 'Amazon', 'Meta', 'Netflix'
  ];

  const steps = [
    {
      number: '01',
      title: 'Sign Up',
      description: 'Create your account in seconds with our streamlined registration process.'
    },
    {
      number: '02', 
      title: 'Fill Details',
      description: 'Add your information using our guided forms with helpful tips and examples.'
    },
    {
      number: '03',
      title: 'Download & Publish',
      description: 'Get your PDF resume and publish your portfolio site with one click.'
    }
  ];

  const faqs = [
    {
      question: 'How many resumes can I create?',
      answer: 'Free users get 1 resume with watermark. Pro users get unlimited resumes without watermarks.'
    },
    {
      question: 'Are the templates ATS-friendly?',
      answer: 'Yes! All our templates are designed to pass Applicant Tracking Systems used by most companies.'
    },
    {
      question: 'Can I customize the colors and fonts?',
      answer: 'Pro users can customize colors, fonts, and layouts. Free users have access to default styling.'
    },
    {
      question: 'How does the portfolio builder work?',
      answer: 'Simply toggle sections, add your projects, and publish. Your portfolio gets a custom URL you can share.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use Supabase for secure cloud storage and never share your personal information.'
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes, you can download your resume as PDF and export all your data at any time from your account settings.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 section-padding">
        <div className="container-max">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Build a{' '}
                  <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    Job-Ready
                  </span>{' '}
                  Resume & Portfolio in Minutes
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Three modern templates, instant PDF, and a live portfolio site. 
                  Supabase Auth + subscriptions ready.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8" data-auth="signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                  <Link to="/templates">
                    <Play className="mr-2 h-5 w-5" />
                    View Templates
                  </Link>
                </Button>
              </div>
            </div>
            
            {/* Device Mock */}
            <div className="relative">
              <GlassCard className="p-6 animate-float">
                <div className="aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg">
                  <div className="grid grid-cols-2 h-full">
                    <div className="p-4 border-r border-slate-300 dark:border-slate-600">
                      <div className="space-y-3">
                        <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-3/4"></div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                        <div className="space-y-2 pt-2">
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="h-full bg-white dark:bg-slate-900 rounded border shadow-sm p-3">
                        <div className="space-y-2">
                          <div className="h-4 bg-slate-800 dark:bg-slate-200 rounded w-3/4"></div>
                          <div className="h-2 bg-slate-400 dark:bg-slate-600 rounded w-1/2"></div>
                          <div className="pt-2 space-y-1">
                            <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded"></div>
                            <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
                            <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="py-12 border-b border-border">
        <div className="container-max">
          <div className="text-center space-y-8">
            <p className="text-sm text-muted-foreground">Trusted by job seekers who landed at</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {companies.map((company) => (
                <div key={company} className="text-2xl font-bold text-muted-foreground">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-padding bg-gradient-to-b from-background to-slate-50 dark:to-slate-900/50">
        <div className="container-max">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From resume creation to portfolio publishing, we've got every step of your job search covered.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                badge={feature.badge}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Templates Teaser */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Choose Your Perfect Template
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Professionally designed templates that make you stand out while staying ATS-compliant.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {templates.map((template) => (
              <TemplateCard
                key={template.name}
                name={template.name}
                description={template.description}
                image={template.image}
                badges={template.badges}
                onPreview={async () => {
                  if (!user) return navigate('/signin');
                  const plan = storage.getPlan(user.id);
                  const list = await data.getResumes(user.id);
                  if (plan === 'Free' && list.length >= 1) { setShowUpgrade(true); return; }
                  navigate('/templates');
                }}
                onTryBuilder={async () => {
                  if (!user) return navigate('/signin');
                  const plan = storage.getPlan(user.id);
                  const list = await data.getResumes(user.id);
                  if (plan === 'Free' && list.length >= 1) { setShowUpgrade(true); return; }
                  navigate('/templates');
                }}
              />
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link to="/templates">
                View All Templates
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-gradient-to-b from-slate-50 to-background dark:from-slate-900/50 dark:to-background">
        <div className="container-max">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Get Started in 3 Simple Steps
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From signup to job application in under 10 minutes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Start Free, Upgrade When Ready
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <GlassCard className="p-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold">Free</h3>
                    <p className="text-muted-foreground">Perfect for getting started</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>1 resume with watermark</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Basic portfolio</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Community support</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
              
              <GlassCard className="p-8 ring-2 ring-primary">
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-2xl font-bold">Pro</h3>
                      <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                        Popular
                      </span>
                    </div>
                    <p className="text-muted-foreground">Everything you need to succeed</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Unlimited resumes, no watermark</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>All templates & custom colors</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Portfolio publishing & analytics</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Priority support</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
            
            <Button size="lg" variant="outline" asChild>
              <Link to="/pricing">
                See Full Pricing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-gradient-to-b from-background to-slate-50 dark:to-slate-900/50">
        <div className="container-max">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Got questions? We've got answers. Can't find what you're looking for? Contact our support team.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-semibold">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container-max text-center">
          <div className="space-y-8 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of job seekers who've successfully landed interviews and offers using R&P Generator.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8" data-auth="signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary" asChild>
                <Link to="/templates">
                  <Play className="mr-2 h-5 w-5" />
                  Try Templates
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center space-x-1 text-sm opacity-75">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <span className="ml-2">Loved by 10,000+ job seekers</span>
            </div>
          </div>
        </div>
      </section>
      <Dialog open={!!showUpgrade} onOpenChange={setShowUpgrade as any}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to continue</DialogTitle>
            <DialogDescription>
              Free plan allows 1 resume. Upgrade to Pro for unlimited resumes, premium templates, and instant PDF downloads.
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
