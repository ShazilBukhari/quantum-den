import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search,
  MessageSquare,
  Mail,
  Phone,
  Book,
  Video,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Zap,
  FileText,
  Download,
  Globe,
  Settings,
  HelpCircle
} from 'lucide-react';

export default function Support() {
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      icon: FileText,
      title: 'Resume Building',
      description: 'Learn how to create stunning resumes',
      count: 12,
      color: 'text-blue-500 bg-blue-500/10'
    },
    {
      icon: Globe,
      title: 'Portfolio Creation',
      description: 'Build and publish your portfolio',
      count: 8,
      color: 'text-green-500 bg-green-500/10'
    },
    {
      icon: Download,
      title: 'PDF & Export',
      description: 'Download and share your work',
      count: 6,
      color: 'text-purple-500 bg-purple-500/10'
    },
    {
      icon: Settings,
      title: 'Account & Billing',
      description: 'Manage your account and subscription',
      count: 10,
      color: 'text-orange-500 bg-orange-500/10'
    }
  ];

  const popularArticles = [
    {
      title: 'How to create your first resume',
      category: 'Resume Building',
      readTime: '5 min read',
      views: '2.3k views'
    },
    {
      title: 'Making your resume ATS-friendly',
      category: 'Resume Building',
      readTime: '7 min read',
      views: '1.8k views'
    },
    {
      title: 'Publishing your portfolio website',
      category: 'Portfolio Creation',
      readTime: '4 min read',
      views: '1.5k views'
    },
    {
      title: 'Customizing colors and fonts',
      category: 'Resume Building',
      readTime: '3 min read',
      views: '1.2k views'
    },
    {
      title: 'Upgrading to Pro plan',
      category: 'Account & Billing',
      readTime: '2 min read',
      views: '980 views'
    },
    {
      title: 'Downloading high-quality PDFs',
      category: 'PDF & Export',
      readTime: '3 min read',
      views: '890 views'
    }
  ];

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          question: 'How do I get started with R&P Generator?',
          answer: 'Simply sign up for a free account, choose a template, and start filling in your information. Our guided process will help you create a professional resume in minutes.'
        },
        {
          question: 'Can I use R&P Generator on mobile devices?',
          answer: 'Yes! Our platform is fully responsive and works on all devices including smartphones and tablets. You can create and edit your resume from anywhere.'
        },
        {
          question: 'How secure is my data?',
          answer: 'We take security seriously. All data is encrypted and stored securely with Supabase. We never share your personal information with third parties.'
        }
      ]
    },
    {
      category: 'Resume Building',
      questions: [
        {
          question: 'Are the templates ATS-friendly?',
          answer: 'Yes! All our templates are designed to pass Applicant Tracking Systems (ATS) used by most companies. They use proper formatting and structure that ATS software can read.'
        },
        {
          question: 'Can I customize the template colors and fonts?',
          answer: 'Pro users can fully customize colors, fonts, and layouts. Free users have access to default styling with limited customization options.'
        },
        {
          question: 'How many resumes can I create?',
          answer: 'Free users can create 1 resume with a watermark. Pro users get unlimited resumes without any watermarks.'
        }
      ]
    },
    {
      category: 'Billing & Plans',
      questions: [
        {
          question: 'Can I cancel my subscription anytime?',
          answer: 'Yes, you can cancel your Pro subscription at any time. You\'ll continue to have access to Pro features until the end of your billing period.'
        },
        {
          question: 'Do you offer refunds?',
          answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with your Pro subscription, contact us within 30 days for a full refund.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. All payments are processed securely through Stripe.'
        }
      ]
    }
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get help via email',
      detail: 'support@rpgenerator.com',
      responseTime: 'Usually within 24 hours',
      available: 'Always',
      action: 'Send Email'
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Chat with our team',
      detail: 'Available for Pro users',
      responseTime: 'Usually within 1 hour',
      available: 'Mon-Fri, 9AM-6PM EST',
      action: 'Start Chat',
      proBadge: true
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Get help from the community',
      detail: 'Ask questions and share tips',
      responseTime: 'Community-driven',
      available: 'Always',
      action: 'Visit Forum'
    }
  ];

  const videoTutorials = [
    {
      title: 'Getting Started with R&P Generator',
      duration: '5:32',
      thumbnail: '/placeholder.svg',
      views: '12k views'
    },
    {
      title: 'Creating Your First Resume',
      duration: '8:15',
      thumbnail: '/placeholder.svg',
      views: '8.5k views'
    },
    {
      title: 'Building a Portfolio Website',
      duration: '6:42',
      thumbnail: '/placeholder.svg',
      views: '6.2k views'
    },
    {
      title: 'Advanced Customization Tips',
      duration: '4:18',
      thumbnail: '/placeholder.svg',
      views: '4.1k views'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header Section */}
      <section className="section-padding border-b border-border">
        <div className="container-max">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold">
              How Can We Help You?
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find answers to your questions, browse our knowledge base, or get in touch with our support team.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search for help articles, guides, or FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-border"
              />
            </div>
          </div>

          {/* Help Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <GlassCard key={index} className="p-6 cursor-pointer hover:scale-105 transition-transform">
                <div className={`p-3 rounded-lg w-fit mb-4 ${category.color}`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{category.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{category.count} articles</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="section-padding">
        <div className="container-max">
          <h2 className="text-3xl font-bold mb-8">Popular Articles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {popularArticles.map((article, index) => (
              <GlassCard key={index} className="p-6 cursor-pointer hover:shadow-xl transition-shadow">
                <div className="flex items-center space-x-2 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {article.category}
                  </Badge>
                </div>
                <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{article.readTime}</span>
                  <span>{article.views}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Video Tutorials */}
      <section className="section-padding bg-gradient-to-b from-background to-slate-50 dark:to-slate-900/50">
        <div className="container-max">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Video Tutorials</h2>
            <Button variant="outline">
              <Video className="h-4 w-4 mr-2" />
              View All Videos
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoTutorials.map((video, index) => (
              <GlassCard key={index} className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 dark:bg-slate-900/90 rounded-full flex items-center justify-center">
                      <Video className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-muted-foreground">{video.views}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our support team is here to help. Choose the best way to reach us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {contactMethods.map((method, index) => (
              <GlassCard key={index} className="p-6 text-center">
                <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto mb-4">
                  <method.icon className="h-6 w-6 text-primary" />
                </div>
                
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <h3 className="font-semibold">{method.title}</h3>
                  {method.proBadge && (
                    <Badge className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      Pro
                    </Badge>
                  )}
                </div>
                
                <p className="text-muted-foreground text-sm mb-4">{method.description}</p>
                
                <div className="space-y-2 mb-6">
                  <p className="font-medium text-sm">{method.detail}</p>
                  <p className="text-xs text-muted-foreground">
                    Response: {method.responseTime}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Available: {method.available}
                  </p>
                </div>
                
                <Button className="w-full" variant={index === 1 ? 'default' : 'outline'}>
                  {method.action}
                </Button>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gradient-to-b from-slate-50 to-background dark:from-slate-900/50 dark:to-background">
        <div className="container-max">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions about R&P Generator.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-primary" />
                  {category.category}
                </h3>
                
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`${categoryIndex}-${index}`} 
                      className="border rounded-lg px-6"
                    >
                      <AccordionTrigger className="text-left font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Status & Resources */}
      <section className="section-padding border-t border-border">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <h3 className="font-semibold">System Status</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                All systems operational. No known issues at this time.
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Status Page
              </Button>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Book className="h-6 w-6 text-blue-500" />
                <h3 className="font-semibold">Documentation</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Comprehensive guides and API documentation for developers.
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Docs
              </Button>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="h-6 w-6 text-purple-500" />
                <h3 className="font-semibold">Community</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-4">
                Join our community to share tips and get help from other users.
              </p>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Join Community
              </Button>
            </GlassCard>
          </div>
        </div>
      </section>
    </div>
  );
}
