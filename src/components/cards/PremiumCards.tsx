import { ReactNode, useMemo } from 'react';
import { ArrowRight, Pin, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getTypographyTheme } from '@/components/inputs/RichTextPaste';

interface PremiumCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export function PremiumCard({ children, className, onClick, interactive = false }: PremiumCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        interactive ? 'premium-card-interactive' : 'premium-card',
        className
      )}
    >
      {children}
    </div>
  );
}

interface PortalCardProps {
  name: string;
  category: string;
  icon?: string;
  onOpen: () => void;
}

export function PortalCard({
  name,
  category,
  icon,
  onOpen,
}: PortalCardProps) {
  return (
    <div className="group premium-card-interactive" onClick={onOpen}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="icon-box">
            {icon ? (
              <span className="text-2xl">{icon}</span>
            ) : (
              <span className="text-primary font-bold text-lg">{name.charAt(0)}</span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground mt-1">
              {category}
            </span>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground arrow-slide" />
      </div>
    </div>
  );
}

interface CompanyCardProps {
  name: string;
  brandTitleHtml?: string;
  logoUrl?: string;
  industry?: string;
  companySize?: string;
  hqCity?: string;
  hqCountry?: string;
  technologies?: string[];
  isPinned: boolean;
  onPin: () => void;
  onClick: () => void;
}

export function CompanyCard({
  name,
  brandTitleHtml,
  logoUrl,
  industry,
  companySize,
  hqCity,
  hqCountry,
  technologies,
  isPinned,
  onPin,
  onClick,
}: CompanyCardProps) {
  const location = [hqCity, hqCountry].filter(Boolean).join(', ');
  
  // Get typography theme for fallback styling
  const typographyTheme = useMemo(() => getTypographyTheme(name), [name]);

  return (
    <div className="group premium-card-interactive relative" onClick={onClick}>
      {isPinned && (
        <div className="pinned-badge">
          <Pin className="w-3 h-3" />
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div className="icon-box icon-box-primary overflow-hidden">
          {logoUrl ? (
            <img src={logoUrl} alt={name} className="w-full h-full object-contain" />
          ) : (
            <span className="font-bold text-lg">{name.charAt(0)}</span>
          )}
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground arrow-slide" />
      </div>

      {brandTitleHtml ? (
        <h3 
          className="font-semibold text-lg mb-2 group-hover:opacity-80 transition-opacity"
          dangerouslySetInnerHTML={{ __html: brandTitleHtml }}
        />
      ) : (
        <h3 
          className="font-semibold text-lg mb-2 group-hover:opacity-80 transition-opacity"
          style={{
            fontWeight: typographyTheme.fontWeight,
            color: typographyTheme.color,
            fontStyle: typographyTheme.fontStyle as 'normal' | 'italic',
          }}
        >
          {name}
        </h3>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {industry && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
            {industry}
          </span>
        )}
        {companySize && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
            {companySize}
          </span>
        )}
      </div>

      {location && (
        <p className="text-sm text-muted-foreground mb-3">{location}</p>
      )}

      {technologies && technologies.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary"
            >
              {tech}
            </span>
          ))}
          {technologies.length > 3 && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground">
              +{technologies.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div 
        className="flex items-center gap-2 pt-4 border-t border-border/50"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onPin}
          className={cn(
            "p-2 rounded-lg transition-all duration-200",
            isPinned 
              ? "text-primary bg-primary/10 hover:bg-primary/20" 
              : "text-muted-foreground hover:text-primary hover:bg-muted"
          )}
        >
          <Pin className={cn("w-4 h-4", isPinned && "fill-current")} />
        </button>
      </div>
    </div>
  );
}

interface LinkCardProps {
  title: string;
  url: string;
  icon?: ReactNode;
}

export function LinkCard({ title, url, icon }: LinkCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="link-card group"
    >
      <div className="icon-box">
        {icon || <ExternalLink className="w-5 h-5 text-primary" />}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
          {title}
        </h4>
        <p className="text-sm text-muted-foreground truncate">{url}</p>
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground arrow-slide" />
    </a>
  );
}