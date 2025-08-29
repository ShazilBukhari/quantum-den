import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  CheckCircle,
  X,
  Star,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Crown,
  Gift
} from 'lucide-react';

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro'>('free');
  const navigate = useNavigate();

  const pricing = {
    free: {
      monthly: 0,
      // yearly: 0
    },
    pro: {
      monthly: 200,
      // yearly: 2000 // 2 months free
    }
  };

  const features = {
    free: [
      'Create 1 resume',
      'PDF export without watermark',
      'Limited template selection',
      'Community support',
      'Basic customization'
    ],
    pro: [
      'Unlimited resumes',
      'PDF export without watermark',
      'All premium templates',
      'Priority email support',
      'Advanced customization',
      'Custom colors & fonts',
      'Analytics & insights',
      'ATS optimization',
      'Team collaboration (coming soon)'
    ]
  };

  const faqs = [
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your Pro subscription at any time. You\'ll continue to have access to Pro features until the end of your billing period.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with your Pro subscription, contact us within 30 days for a full refund.'
    },
    {
      question: 'What happens to my data if I cancel?',
      answer: 'Your resumes and portfolio data remain accessible on the free plan. You can download all your data before canceling if needed.'
    },
    {
      question: 'Can I upgrade from Free to Pro later?',
      answer: 'Absolutely! You can upgrade to Pro at any time. Your existing resumes and data will be preserved, and you\'ll immediately get access to Pro features.'
    },
    {
      question: 'Do you offer student discounts?',
      answer: 'Yes! We offer a 50% student discount on Pro subscriptions. Contact our support team with your student email to apply.'
    },
    {
      question: 'Is there a team or enterprise plan?',
      answer: 'We\'re working on team features and enterprise plans. Contact sales@rpgenerator.com for early access and custom pricing.'
    }
  ];

  // Handler functions
  const handleSelectPlan = (plan: 'free' | 'pro') => {
    setSelectedPlan(plan);
  };

  const handleStartFree = () => {
    navigate('/get-started');
  };

  const handleGoPro = () => {
    // For now, redirect to get-started with a pro flag
    // In a real app, this would redirect to a payment processor
    navigate('/get-started?plan=pro');
  };

  const handleCheckout = () => {
    // Simulate checkout process
    // In production, this would integrate with Stripe, PayPal, etc.
    alert(`Starting checkout for ${selectedPlan} plan (${billingCycle} billing). This would redirect to payment processing in a real application.`);
  };

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Software Engineer',
      company: 'Google',
      content: 'R&P Generator helped me land my dream job at Google. The templates are professional and the portfolio feature really made me stand out.',
      avatar: '👩‍💻'
    },
    {
      name: 'Marcus Johnson',
      role: 'Product Designer',
      company: 'Airbnb',
      content: 'The Creative template perfectly showcased my design work. Got 3 interviews in the first week after publishing my portfolio.',
      avatar: '👨‍🎨'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Manager',
      company: 'Meta',
      content: 'Professional, easy to use, and the ATS optimization actually works. Highly recommend for anyone job hunting.',
      avatar: '👩‍💼'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-4xl md:text-5xl font-bold">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start free and upgrade when you're ready. No hidden fees, no surprises. 
              Cancel anytime with our 30-day money-back guarantee.
            </p>
          </div>

          {/* Billing Toggle */}
          {/* <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  billingCycle === 'yearly' ? 'bg-primary' : 'bg-input'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <Badge variant="secondary" className="ml-2">
                  <Gift className="h-3 w-3 mr-1" />
                  2 months free
                </Badge>
              )}
            </div>
          </div> */}

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {/* Free Plan */}
            <GlassCard
              className={`p-8 cursor-pointer transition-all hover:shadow-lg ${
                selectedPlan === 'free'
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:ring-1 hover:ring-primary/50'
              }`}
              onClick={() => handleSelectPlan('free')}
            >
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-2">
                  <h3 className="text-2xl font-bold">Free</h3>
                  {selectedPlan === 'free' && (
                    <CheckCircle className="h-6 w-6 text-primary ml-2" />
                  )}
                </div>
                <p className="text-muted-foreground mb-6">Perfect for getting started</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">₹{pricing.free[billingCycle]}</span>
                  <span className="text-muted-foreground ml-2">
                    {billingCycle === 'monthly' ? '/month' : '/year'}
                  </span>
                </div>
                <Button
                  className="w-full"
                  variant={selectedPlan === 'free' ? 'default' : 'outline'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStartFree();
                  }}
                >
                  Start Free
                </Button>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  What's included:
                </h4>
                {features.free.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Pro Plan */}
            <GlassCard
              className={`p-8 relative cursor-pointer transition-all hover:shadow-lg ${
                selectedPlan === 'pro'
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'ring-2 ring-primary/30 hover:ring-primary'
              }`}
              onClick={() => handleSelectPlan('pro')}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1">
                  <Crown className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-2">
                  <h3 className="text-2xl font-bold">Pro</h3>
                  {selectedPlan === 'pro' && (
                    <CheckCircle className="h-6 w-6 text-primary ml-2" />
                  )}
                </div>
                <p className="text-muted-foreground mb-6">Everything you need to succeed</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">₹{pricing.pro[billingCycle]}</span>
                  <span className="text-muted-foreground ml-2">
                    {billingCycle === 'monthly' ? '/month' : '/year'}
                  </span>
                  {billingCycle === 'yearly' && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      Save ₹400/year
                    </div>
                  )}
                </div>
                <Button
                  className="w-full"
                  variant={selectedPlan === 'pro' ? 'default' : 'secondary'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGoPro();
                  }}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Go Pro
                </Button>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                  Everything in Free, plus:
                </h4>
                {features.pro.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Money-back Guarantee */}
          <div className="text-center mb-16">
            <GlassCard className="p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Shield className="h-6 w-6 text-green-500" />
                <h3 className="text-lg font-semibold">30-Day Money-Back Guarantee</h3>
              </div>
              <p className="text-muted-foreground">
                Try Pro risk-free. If you're not completely satisfied, we'll refund your money within 30 days. 
                No questions asked.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-gradient-to-b from-background to-slate-50 dark:to-slate-900/50">
        <div className="container-max">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Trusted by Professionals Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of job seekers who've successfully landed their dream jobs using R&P Generator.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <GlassCard key={index} className="p-6">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container-max">
          <div className="text-center space-y-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions? We've got answers. Can't find what you're looking for? 
              <Link to="/support" className="text-primary hover:underline ml-1">Contact our support team</Link>.
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
          <div className="space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of professionals who've upgraded their careers with R&P Generator.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8"
                onClick={handleStartFree}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary"
                onClick={handleCheckout}
              >
                <Crown className="mr-2 h-5 w-5" />
                Go Pro Now
              </Button>
            </div>
            
            <p className="text-sm opacity-75">
              💳 No credit card required to start • ⚡ Instant access • 🔒 30-day money-back guarantee
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
