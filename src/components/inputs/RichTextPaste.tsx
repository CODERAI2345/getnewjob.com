import { useRef, useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';

interface RichTextPasteProps {
  value?: string;
  onChange: (html: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

// Typography theme presets for fallback
const typographyThemes = [
  { fontWeight: 'bold', color: '#1a1a1a', fontStyle: 'normal' },
  { fontWeight: '600', color: '#2563eb', fontStyle: 'normal' },
  { fontWeight: '700', color: '#7c3aed', fontStyle: 'normal' },
  { fontWeight: 'bold', color: '#059669', fontStyle: 'normal' },
  { fontWeight: '800', color: '#dc2626', fontStyle: 'normal' },
  { fontWeight: '600', color: '#ea580c', fontStyle: 'normal' },
  { fontWeight: 'bold', color: '#0891b2', fontStyle: 'normal' },
  { fontWeight: '700', color: '#4f46e5', fontStyle: 'italic' },
];

export function getTypographyTheme(name: string) {
  // Deterministic hash based on company name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return typographyThemes[Math.abs(hash) % typographyThemes.length];
}

export function RichTextPaste({ value, onChange, label, placeholder, className }: RichTextPasteProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== undefined && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    
    // Get HTML content from clipboard
    const html = e.clipboardData.getData('text/html');
    const text = e.clipboardData.getData('text/plain');
    
    if (html) {
      // Sanitize the HTML while preserving styles
      const sanitized = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['span', 'strong', 'em', 'b', 'i', 'u', 's', 'sub', 'sup'],
        ALLOWED_ATTR: ['style', 'class'],
      });
      
      document.execCommand('insertHTML', false, sanitized);
    } else {
      document.execCommand('insertText', false, text);
    }
    
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      // Sanitize before saving
      const sanitized = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['span', 'strong', 'em', 'b', 'i', 'u', 's', 'sub', 'sup'],
        ALLOWED_ATTR: ['style', 'class'],
      });
      onChange(sanitized);
    }
  };

  const isEmpty = !value || value === '<br>' || value === '';

  return (
    <div className={className}>
      {label && <Label className="mb-1.5 block">{label}</Label>}
      <div
        ref={editorRef}
        contentEditable
        onPaste={handlePaste}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={cn(
          'min-h-[44px] px-3 py-2 rounded-lg border bg-background text-foreground transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary/20',
          isFocused ? 'border-primary' : 'border-border',
          isEmpty && 'text-muted-foreground'
        )}
        data-placeholder={placeholder}
        style={{
          minHeight: '44px',
        }}
        suppressContentEditableWarning
      />
      <p className="text-xs text-muted-foreground mt-1.5">
        Paste styled text from company websites to preserve formatting
      </p>
      <style>{`
        [data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
