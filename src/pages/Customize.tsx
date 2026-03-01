import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Upload, Palette, Type, 
  Image, Building2, Globe, ChevronRight, LayoutDashboard,
  Settings2, Paintbrush
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useCompanies } from '@/hooks/useCompanies';
import { usePortals } from '@/hooks/usePortals';
import { toast } from 'sonner';

export default function Customize() {
  const navigate = useNavigate();
  const { settings, updateSettings, resetSettings } = useSiteSettings();
  const { companies } = useCompanies();
  const { portals } = usePortals();
  
  const [siteTitle, setSiteTitle] = useState(settings.siteTitle);
  const [themeColor, setThemeColor] = useState(settings.themeColor || '#14B8A6');
  const [activeSection, setActiveSection] = useState<'overview' | 'appearance'>('overview');
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const handleSaveTitle = () => {
    updateSettings({ siteTitle });
    toast.success('Site title updated');
  };

  const handleSaveTheme = () => {
    updateSettings({ themeColor });
    document.documentElement.style.setProperty('--primary', hexToHSL(themeColor));
    toast.success('Theme color updated');
  };

  const hexToHSL = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return '174 84% 40%';
    
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

  const sidebarItems = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'appearance' as const, label: 'Appearance', icon: Paintbrush },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 glass-navbar border-b border-border">
        <div className="px-6 py-3 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-xl">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Settings2 className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">Backend Management</p>
            </div>
          </div>
          <div className="flex-1" />
          <span className="admin-badge">Admin</span>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-57px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border/50 bg-muted/30 p-4 space-y-1 hidden md:block">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeSection === item.id
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-border/50">
            <p className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Content
            </p>
            <Link
              to="/admin/companies"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Building2 className="w-4 h-4" />
              Companies
              <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded-full">{companies.length}</span>
            </Link>
            <Link
              to="/admin/portals"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <Globe className="w-4 h-4" />
              Portals
              <span className="ml-auto text-xs bg-muted px-2 py-0.5 rounded-full">{portals.length}</span>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">

            {/* Mobile nav */}
            <div className="flex gap-2 mb-6 md:hidden overflow-x-auto pb-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    activeSection === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-1">Overview</h2>
                  <p className="text-muted-foreground">Manage all your CareerHub content from here.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border/50 bg-card p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-accent" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Companies</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{companies.length}</p>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-card p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Portals</span>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{portals.length}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Quick Actions</h3>

                  <Link to="/admin/companies" className="block">
                    <div className="rounded-2xl border border-border/40 bg-card p-5 hover:border-accent/50 transition-all group cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-accent" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                              Manage Companies
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Add, edit companies • AI Quick Add • AI Customize
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                      </div>
                    </div>
                  </Link>

                  <Link to="/admin/portals" className="block">
                    <div className="rounded-2xl border border-border/40 bg-card p-5 hover:border-primary/50 transition-all group cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              Manage Portals
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Add portals with images • Assign to Remote, Germany, Finland, etc.
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}

            {/* Appearance Section */}
            {activeSection === 'appearance' && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-1">Appearance</h2>
                  <p className="text-muted-foreground">Customize how your site looks.</p>
                </div>

                {/* Site Title */}
                <section className="rounded-2xl border border-border/40 bg-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Type className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Site Title</h3>
                      <p className="text-sm text-muted-foreground">Change the main title displayed in the header</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Input
                      value={siteTitle}
                      onChange={(e) => setSiteTitle(e.target.value)}
                      placeholder="CareerHub"
                      className="flex-1 rounded-xl"
                    />
                    <Button onClick={handleSaveTitle} className="btn-gradient rounded-xl">
                      Save
                    </Button>
                  </div>
                </section>

                {/* Banner Upload */}
                <section className="rounded-2xl border border-border/40 bg-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Image className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Site Banner</h3>
                      <p className="text-sm text-muted-foreground">Upload a custom banner for the hero section</p>
                    </div>
                  </div>
                  
                  {settings.bannerUrl && (
                    <div className="mb-4 relative rounded-xl overflow-hidden">
                      <img src={settings.bannerUrl} alt="Banner" className="w-full h-32 object-cover" />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 rounded-lg"
                        onClick={() => updateSettings({ bannerUrl: undefined })}
                      >
                        Remove
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
                  <Button variant="outline" onClick={() => bannerInputRef.current?.click()} className="rounded-xl">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Banner Image
                  </Button>
                </section>

                {/* Background Image */}
                <section className="rounded-2xl border border-border/40 bg-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Background Image</h3>
                      <p className="text-sm text-muted-foreground">Upload a custom background image</p>
                    </div>
                  </div>
                  
                  {settings.backgroundUrl && (
                    <div className="mb-4 relative rounded-xl overflow-hidden">
                      <img src={settings.backgroundUrl} alt="Background" className="w-full h-32 object-cover" />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 rounded-lg"
                        onClick={() => updateSettings({ backgroundUrl: undefined })}
                      >
                        Remove
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
                  <Button variant="outline" onClick={() => bgInputRef.current?.click()} className="rounded-xl">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Background Image
                  </Button>
                </section>

                {/* Theme Color */}
                <section className="rounded-2xl border border-border/40 bg-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Palette className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Theme Color</h3>
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
                      className="w-32 rounded-xl"
                      placeholder="#14B8A6"
                    />
                    <Button onClick={handleSaveTheme} className="btn-gradient rounded-xl">
                      Apply Color
                    </Button>
                  </div>
                </section>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
