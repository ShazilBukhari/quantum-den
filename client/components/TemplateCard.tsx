import { Button } from './ui/button';
import { GlassCard } from './GlassCard';
import { Badge } from './ui/badge';

interface TemplateCardProps {
  name: string;
  description: string;
  image: string;
  badges: string[];
  onPreview: () => void;
  onTryBuilder: () => void;
}

export function TemplateCard({ 
  name, 
  description, 
  image, 
  badges, 
  onPreview, 
  onTryBuilder 
}: TemplateCardProps) {
  return (
    <GlassCard className="overflow-hidden">
      {/* Template Preview */}
      <div className="aspect-[3/4] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6 flex items-center justify-center">
        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-lg shadow-lg flex items-center justify-center border">
          <div className="text-center space-y-2">
            <div className="w-24 h-3 bg-slate-200 dark:bg-slate-700 rounded mx-auto"></div>
            <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded mx-auto"></div>
            <div className="space-y-1 mt-4">
              <div className="w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded mx-auto"></div>
              <div className="w-28 h-2 bg-slate-100 dark:bg-slate-800 rounded mx-auto"></div>
              <div className="w-30 h-2 bg-slate-100 dark:bg-slate-800 rounded mx-auto"></div>
            </div>
            <div className="pt-4 space-y-1">
              <div className="w-20 h-2 bg-slate-200 dark:bg-slate-700 rounded mx-auto"></div>
              <div className="w-24 h-1 bg-slate-100 dark:bg-slate-800 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Template Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="flex flex-wrap gap-1">
            {badges.map((badge) => (
              <Badge key={badge} variant="secondary" className="text-xs">
                {badge}
              </Badge>
            ))}
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={onTryBuilder}
            className="flex-1"
            size="sm"
          >
            Try in Builder
          </Button>
          <Button 
            onClick={onPreview}
            variant="outline" 
            size="sm"
            data-action="preview-pdf"
            data-template={name.toLowerCase()}
          >
            Preview PDF
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
