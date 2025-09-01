import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/GlassCard';
import { Badge } from '@/components/ui/badge';
import { ResumeForm } from '@/components/ResumeForm';
import { CorporateTemplate } from '@/components/templates/CorporateTemplate';
import { ModernTemplate } from '@/components/templates/ModernTemplate';
import { CreativeTemplate } from '@/components/templates/CreativeTemplate';
import { ResumeData, TemplateType } from '@/types/resume';
import { generatePDF, validateResumeData, UpgradeRequiredError } from '@/utils/pdfGenerator';
import { getSampleResumeData, getEmptyResumeData } from '@/utils/sampleData';
import {
  Download,
  Eye,
  ArrowLeft,
  CheckCircle,
  FileText,
  Palette,
  Building,
  Zap,
  AlertCircle,
  Wand2,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { data } from '@/lib/data';
import { storage } from '@/utils/storage';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase'; // ya jahan tera client hain


export default function Templates() {
  const previewRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'gallery' | 'builder'>('gallery');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('corporate');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Initialize with empty data
  const [resumeData, setResumeData] = useState<ResumeData>(getEmptyResumeData());

  const handleLoadSampleData = () => {
    setResumeData(getSampleResumeData());
    setShowPreview(true);
    setTimeout(() => {
      if (previewRef.current) {
        previewRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      setResumeData(getEmptyResumeData());
      setShowPreview(false);
    }
  };

  const templates = [
    {
      id: 'corporate' as TemplateType,
      name: 'Corporate Professional',
      description: 'Clean, traditional design perfect for finance, consulting, and corporate roles. Optimized for ATS scanning with clear hierarchy.',
      badges: ['ATS-Friendly', 'Professional', 'Traditional'],
      icon: Building,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-200',
      features: ['ATS Optimized', 'Clean Layout', 'Professional Typography']
    },
    {
      id: 'modern' as TemplateType,
      name: 'Modern Tech',
      description: 'Contemporary layout with subtle colors and clean typography. Perfect for tech professionals, startups, and modern companies.',
      badges: ['Tech-Focused', 'Modern', 'Clean'],
      icon: Zap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-200',
      features: ['Two-Column Layout', 'Tech-Focused', 'Modern Design']
    },
    {
      id: 'creative' as TemplateType,
      name: 'Creative Portfolio',
      description: 'Bold, artistic design that stands out from the crowd. Ideal for designers, artists, and creative professionals.',
      badges: ['Eye-Catching', 'Creative', 'Artistic'],
      icon: Palette,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'border-purple-200',
      features: ['Colorful Design', 'Creative Layout', 'Portfolio Focus']
    }
  ];

  const handleTemplateSelect = async (templateId: TemplateType) => {
  if (!user) {
    navigate('/signin');
    return;


    
  }

  // Profile fetch
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id);

  let profileData = data?.[0]; // null check

  if (!profileData) {
    // Agar profile nahi hai, create it
    const { data: newProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([{ id: user.id, email: user.email, plan: 'Free' }])
      .select('*');

    profileData = newProfile?.[0];
  }

  const plan = profileData?.plan || 'Free';

  // Resume list check
  const { data: resumes } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id);

  if (plan === 'Free' && resumes?.length >= 1) {
    setShowUpgrade(true);
    return;
  }

  setSelectedTemplate(templateId);
  setCurrentView('builder');
  setShowPreview(true);
};


  const handlePreview = () => {
    setShowPreview(true);
    // Scroll to preview section
    setTimeout(() => {
      if (previewRef.current) {
        previewRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleDownloadPDF = async () => {
    if (!user) {
      navigate('/signin');
      return;
    }
    const profile = await data.getProfile(user.id);
const plan = profile?.plan || "Free";

    const list = await data.getResumes(user.id);
    if (plan === 'Free' && list.length >= 1) {
      setShowUpgrade(true);
      return;
    }

    const validation = validateResumeData(resumeData);
    if (!validation.isValid) {
      alert(`Please fix the following errors before downloading:\n${validation.errors.join('\n')}`);
      return;
    }

    setIsGeneratingPDF(true);
    try {
      await generatePDF('resume-preview', {
        filename: `${resumeData.contact.fullName || 'resume'}_${selectedTemplate}.pdf`,
        quality: 3.0,
        format: 'a4'
      });
    } catch (error) {
      if ((error as any)?.code === 'UPGRADE_REQUIRED' || error instanceof UpgradeRequiredError) {
        setShowUpgrade(true);
        return;
      }
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderTemplate = () => {
    const commonProps = {
      data: resumeData,
      className: 'print:shadow-none'
    };

    switch (selectedTemplate) {
      case 'corporate':
        return <CorporateTemplate {...commonProps} />;
      case 'modern':
        return <ModernTemplate {...commonProps} />;
      case 'creative':
        return <CreativeTemplate {...commonProps} />;
      default:
        return <CorporateTemplate {...commonProps} />;
    }
  };

  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  if (currentView === 'gallery') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Header Section */}
        <section className="section-padding border-b border-border">
          <div className="container-max">
            <div className="text-center space-y-6 mb-12">
              <h1 className="text-4xl md:text-5xl font-bold">
                Professional Resume Templates
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Choose from our carefully crafted templates designed by professionals. 
                All templates are ATS-friendly and recruiter-approved.
              </p>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {templates.map((template) => (
                <GlassCard key={template.id} className="overflow-hidden group hover:shadow-2xl transition-all duration-300">
                  {/* Template Preview */}
                  <div className={`aspect-[3/4] ${template.bgColor} p-6 flex items-center justify-center relative`}>
                    <div className="w-full h-full bg-white rounded-lg shadow-lg p-4 flex flex-col relative overflow-hidden">
                      {/* Template specific preview content */}
                      {template.id === 'corporate' && (
                        <>
                          <div className="bg-slate-800 text-white p-2 rounded mb-3">
                            <div className="h-3 bg-white/80 rounded w-2/3 mb-1"></div>
                            <div className="h-1 bg-white/60 rounded w-1/2"></div>
                          </div>
                          <div className="space-y-2 flex-1">
                            <div className="h-2 bg-slate-200 rounded w-full"></div>
                            <div className="h-2 bg-slate-200 rounded w-5/6"></div>
                            <div className="h-2 bg-slate-200 rounded w-4/5"></div>
                            <div className="border-b border-slate-200 my-2"></div>
                            <div className="space-y-1">
                              <div className="h-2 bg-slate-300 rounded w-3/4"></div>
                              <div className="h-1 bg-slate-200 rounded w-full"></div>
                              <div className="h-1 bg-slate-200 rounded w-5/6"></div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {template.id === 'modern' && (
                        <div className="flex h-full">
                          <div className="w-1/3 bg-blue-50 p-2 rounded-l">
                            <div className="h-2 bg-blue-300 rounded w-full mb-2"></div>
                            <div className="space-y-1">
                              <div className="h-1 bg-blue-200 rounded w-full"></div>
                              <div className="h-1 bg-blue-200 rounded w-3/4"></div>
                            </div>
                            <div className="mt-3 space-y-1">
                              <div className="h-1 bg-blue-100 rounded w-full"></div>
                              <div className="h-1 bg-blue-100 rounded w-2/3"></div>
                            </div>
                          </div>
                          <div className="w-2/3 p-2">
                            <div className="space-y-1">
                              <div className="h-2 bg-slate-200 rounded w-full"></div>
                              <div className="h-1 bg-slate-100 rounded w-5/6"></div>
                              <div className="h-1 bg-slate-100 rounded w-4/5"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {template.id === 'creative' && (
                        <>
                          <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white p-2 rounded mb-3">
                            <div className="h-3 bg-white/80 rounded w-2/3 mb-1"></div>
                            <div className="h-1 bg-white/60 rounded w-1/2"></div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                              <div className="h-2 bg-purple-200 rounded w-1/3"></div>
                            </div>
                            <div className="space-y-1 ml-4">
                              <div className="h-1 bg-slate-200 rounded w-full"></div>
                              <div className="h-1 bg-slate-200 rounded w-5/6"></div>
                            </div>
                            <div className="flex items-center space-x-2 mt-3">
                              <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                              <div className="h-2 bg-pink-200 rounded w-1/4"></div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        onClick={() => handleTemplateSelect(template.id)}
                        size="lg"
                        className="bg-white text-black hover:bg-gray-100"
                      >
                        <FileText className="h-5 w-5 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <template.icon className={`h-5 w-5 ${template.color}`} />
                        <h3 className="text-xl font-semibold">{template.name}</h3>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.badges.map((badge) => (
                        <Badge key={badge} variant="secondary" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {template.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      {template.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      onClick={() => handleTemplateSelect(template.id)}
                      className="w-full"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <GlassCard className="p-12 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">
                  Ready to Build Your Resume?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Choose any template above to start building your professional resume. 
                  All templates include live preview and instant PDF download.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button size="lg" onClick={() => handleTemplateSelect('corporate')}>
                    Get Started
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/pricing">
                      View Pricing
                    </Link>
                  </Button>
                </div>
              </GlassCard>
            </div>
          </div>
        </section>

        <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
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

  // Builder View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container-max section-padding">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => setCurrentView('gallery')} 
              variant="outline"
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Resume Builder</h1>
              <p className="text-muted-foreground">
                Building with {currentTemplate?.name} template
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              onClick={handleLoadSampleData}
              variant="outline"
              size="sm"
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Load Sample
            </Button>
            <Button
              onClick={handleClearData}
              variant="outline"
              size="sm"
              disabled={!resumeData.contact.fullName && resumeData.education.length === 0 && resumeData.experience.length === 0}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            <Button
              onClick={handlePreview}
              variant="outline"
              disabled={!resumeData.contact.fullName}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF || !resumeData.contact.fullName}
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <ResumeForm
              data={resumeData}
              onChange={setResumeData}
              onPreview={handlePreview}
              onLoadSample={handleLoadSampleData}
            />
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Live Preview</h2>
                <div className="flex items-center space-x-2">
                  {currentTemplate && (
                    <Badge className={currentTemplate.color}>
                      <currentTemplate.icon className="h-3 w-3 mr-1" />
                      {currentTemplate.name}
                    </Badge>
                  )}
                </div>
              </div>

              {!showPreview || !resumeData.contact.fullName ? (
                <div className="aspect-[3/4] border-2 border-dashed border-border rounded-lg flex items-center justify-center text-center p-8">
                  <div>
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Resume Preview</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Fill in your information to see a live preview of your resume
                    </p>
                    {!resumeData.contact.fullName && (
                      <div className="flex items-center justify-center space-x-2 text-orange-600 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        <span>Please enter your name to start</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="border rounded-lg overflow-hidden bg-white">
                    <div
                      ref={previewRef}
                      className="transform scale-[0.35] origin-top-left"
                      style={{ width: '285.7%', height: 'auto' }}
                    >
                      {renderTemplate()}
                    </div>
                  </div>

                  {/* Hidden full-size container for PDF generation */}
                  <div
                    id="resume-preview"
                    className="fixed -left-[9999px] top-0 bg-white"
                    style={{ width: '210mm', minHeight: '297mm' }}
                  >
                    {renderTemplate()}
                  </div>
                </>
              )}

              {showPreview && resumeData.contact.fullName && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span>Ready to download?</span>
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Template loaded</span>
                    </div>
                  </div>
                  <Button 
                    onClick={handleDownloadPDF}
                    className="w-full"
                    disabled={isGeneratingPDF}
                  >
                    {isGeneratingPDF ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download as PDF
                      </>
                    )}
                  </Button>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>

      <Dialog open={showUpgrade} onOpenChange={setShowUpgrade}>
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
