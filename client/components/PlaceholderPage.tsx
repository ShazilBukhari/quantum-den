import { Button } from './ui/button';
import { GlassCard } from './GlassCard';
import { ArrowLeft, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container-max section-padding">
        <div className="max-w-2xl mx-auto text-center">
          <GlassCard className="p-12">
            <div className="mb-8">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Construction className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-4">{title}</h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {description}
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This page is coming soon! Continue prompting to help build out the remaining features.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link to="/">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/dashboard">
                    Go to Dashboard
                  </Link>
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
