import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Palette, Type, RotateCcw, Download, Trash2, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useCompanies } from '@/hooks/useCompanies';
import { usePortals } from '@/hooks/usePortals';
import { useCollections } from '@/hooks/useCollections';
import { toast } from 'sonner';

export default function Customize() {
  const navigate = useNavigate();
  const { settings, updateSettings, resetSettings } = useSiteSettings();
  const { companies, exportCompanies } = useCompanies();
  const { portals } = usePortals();
  const { collections } = useCollections();
  
  const [siteTitle, setSiteTitle] = useState(settings.siteTitle);
  const [themeColor, setThemeColor] = useState(settings.themeColor || '#632CA6');
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleSaveTitle = () => {
    updateSettings({ siteTitle });
    toast.success('Site title updated');
  };

  const handleSaveTheme = () => {
    updateSettings({ themeColor });
    // Apply theme color to CSS variable
    document.documentElement.style.setProperty('--primary', hexToHSL(themeColor));
    toast.success('Theme color updated');
  };

  const hexToHSL = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '262 59% 41%';
    
    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;
    
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSettings({ bannerUrl: reader.result as string });
        toast.success('Banner image uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSettings({ backgroundUrl: reader.result as string });
        toast.success('Background image uploaded');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportAll = () => {
    const allData = {
      companies: exportCompanies(),
      portals,
      collections,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careerhub-full-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Full backup exported');
  };

  const handleResetAll = () => {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      localStorage.removeItem('careerhub_companies');
      localStorage.removeItem('careerhub_portals');
      localStorage.removeItem('careerhub_collections');
      resetSettings();
      toast.success('All data has been reset');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-navbar border-b border-border">
        <div className="section-container py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">Customize</h1>
              <p className="text-sm text-muted-foreground">Admin settings</p>
            </div>
          </div>
        </div>
      </header>

      <main className="section-container py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Site Title */}
          <section className="premium-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box">
                <Type className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Site Title</h2>
                <p className="text-sm text-muted-foreground">Change the main title displayed in the header</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Input
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                placeholder="CareerHub"
                className="flex-1"
              />
              <Button onClick={handleSaveTitle} className="btn-gradient">
                Save
              </Button>
            </div>
          </section>

          {/* Banner Upload */}
          <section className="premium-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box">
                <Image className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Site Banner</h2>
                <p className="text-sm text-muted-foreground">Upload a custom banner for the hero section</p>
              </div>
            </div>
            
            {settings.bannerUrl && (
              <div className="mb-4 relative rounded-xl overflow-hidden">
                <img src={settings.bannerUrl} alt="Banner" className="w-full h-32 object-cover" />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => updateSettings({ bannerUrl: undefined })}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <input
              type="file"
              ref={bannerInputRef}
              accept="image/*"
              onChange={handleBannerUpload}
              className="hidden"
            />
            <Button variant="outline" onClick={() => bannerInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Banner Image
            </Button>
          </section>

          {/* Background Image */}
          <section className="premium-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Background Image</h2>
                <p className="text-sm text-muted-foreground">Upload a custom background image</p>
              </div>
            </div>
            
            {settings.backgroundUrl && (
              <div className="mb-4 relative rounded-xl overflow-hidden">
                <img src={settings.backgroundUrl} alt="Background" className="w-full h-32 object-cover" />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => updateSettings({ backgroundUrl: undefined })}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
            
            <input
              type="file"
              ref={bgInputRef}
              accept="image/*"
              onChange={handleBackgroundUpload}
              className="hidden"
            />
            <Button variant="outline" onClick={() => bgInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Background Image
            </Button>
          </section>

          {/* Theme Color */}
          <section className="premium-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Theme Color</h2>
                <p className="text-sm text-muted-foreground">Override the primary theme color</p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="relative">
                <input
                  type="color"
                  value={themeColor}
                  onChange={(e) => setThemeColor(e.target.value)}
                  className="w-12 h-12 rounded-lg cursor-pointer border-2 border-border"
                />
              </div>
              <Input
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="w-32"
                placeholder="#632CA6"
              />
              <Button onClick={handleSaveTheme} className="btn-gradient">
                Apply Color
              </Button>
            </div>
          </section>

          {/* Data Management */}
          <section className="premium-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="icon-box">
                <Download className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Data Management</h2>
                <p className="text-sm text-muted-foreground">Export backup or reset all data</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-muted/50">
                <div className="text-sm text-muted-foreground mb-3">
                  <strong>Current Data:</strong> {companies.length} companies, {portals.length} portals, {collections.length} collections
                </div>
                <Button variant="outline" onClick={handleExportAll}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Full Backup
                </Button>
              </div>
              
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive mb-3">
                  <strong>Danger Zone:</strong> Reset all data including companies, portals, collections, and settings.
                </p>
                <Button variant="destructive" onClick={handleResetAll}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset All Data
                </Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
