import { useState } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Download, ClipboardPaste } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ImportResult, Company } from '@/types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: Partial<Company>[]) => ImportResult | Promise<ImportResult>;
}

const CSV_TEMPLATE = `Company Name,Industry,Location,Website,Company Size,Description,HQ,Founded,LinkedIn,Career URL,Headcount,Stage,Core Strength,Hiring Technologies,Notable Products,Career Benefits
"Google","Technology","Mountain View, CA","https://google.com","5000+","Search and cloud computing giant","USA",1998,"https://linkedin.com/company/google","https://careers.google.com","190000+","Public (NASDAQ: GOOGL)","AI, Cloud, Search","Python, Java, Go, C++","Google Search, Cloud Platform, Android","Competitive pay, innovation culture"
"Microsoft","Technology","Redmond, WA","https://microsoft.com","5000+","Software and cloud services leader","USA",1975,"https://linkedin.com/company/microsoft","https://careers.microsoft.com","220000+","Public (NASDAQ: MSFT)","Cloud, Enterprise, AI","C#, TypeScript, Python","Azure, Office 365, Windows","Great benefits, career growth"`;

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [bulkText, setBulkText] = useState('');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setResult(null);
    }
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
  };

  const parseCSV = (text: string): Partial<Company>[] => {
    const lines = text.split('\n').filter((line) => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV must have a header row and at least one data row');
    }

    const rawHeaders = parseCSVLine(lines[0]);
    const headers = rawHeaders.map((h) => h.trim().toLowerCase());
    const data: Partial<Company>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const row: any = {};

      headers.forEach((header, index) => {
        const value = values[index]?.trim();
        if (!value) return;

        switch (header) {
          case 'company name': case 'companyname': case 'company_name': case 'name':
            row.name = value; break;
          case 'logo': case 'logourl': case 'logo_url':
            row.logoUrl = value; break;
          case 'industry':
            row.industry = value; break;
          case 'location':
            row.location = value; row.hqCity = value; break;
          case 'description':
            row.description = value; break;
          case 'website': case 'website url':
            row.website = value; row.careerUrl = row.careerUrl || value; break;
          case 'company size': case 'companysize': case 'company_size': case 'size':
            row.companySize = value; break;
          case 'hq': case 'headquarters':
            row.hq = value; row.hqCountry = value; break;
          case 'about':
            row.about = value; row.description = row.description || value; break;
          case 'careerurl': case 'career_url': case 'careersiteurl': case 'career url':
            row.careerUrl = value; break;
          case 'linkedinurl': case 'linkedin_url': case 'linkedin':
            row.linkedinUrl = value; break;
          case 'foundedyear': case 'founded_year': case 'founded':
            row.foundedYear = parseInt(value) || undefined; break;
          case 'hqcity': case 'hq_city': case 'city':
            row.hqCity = value; break;
          case 'hqcountry': case 'hq_country': case 'country':
            row.hqCountry = value; break;
          case 'technologies': case 'tech':
            row.technologies = value.split(';').map((t: string) => t.trim()).filter(Boolean); break;
          case 'notes':
            row.notes = value; break;
          case 'headcount':
            row.headcount = value; break;
          case 'stage':
            row.stage = value; break;
          case 'core strength': case 'corestrength': case 'core_strength':
            row.coreStrength = value; break;
          case 'hiring technologies': case 'hiringtechnologies': case 'hiring_technologies':
            row.hiringTechnologies = value; break;
          case 'notable products': case 'notableproducts': case 'notable_products':
            row.notableProducts = value; break;
          case 'career benefits': case 'careerbenefits': case 'career_benefits':
            row.careerBenefits = value; break;
          case 'future direction': case 'futuredirection': case 'future_direction':
            row.futureDirection = value; break;
          case 'organization strength': case 'organizationstrength': case 'organization_strength':
            row.organizationStrength = value; break;
        }
      });

      if (row.name) {
        if (!row.careerUrl && row.website) row.careerUrl = row.website;
        else if (!row.careerUrl) row.careerUrl = '#';
        data.push(row);
      }
    }
    return data;
  };

  const handleImport = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    try {
      const text = await file.text();
      const data = parseCSV(text);
      const importResult = await onImport(data);
      setResult(importResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkImport = async () => {
    if (!bulkText.trim()) return;
    setIsProcessing(true);
    setError(null);
    try {
      const data = parseCSV(bulkText.trim());
      const importResult = await onImport(data);
      setResult(importResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse pasted text');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'companies_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setFile(null);
    setBulkText('');
    setResult(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-card rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-4 animate-scale-in border border-border max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-display text-2xl font-semibold mb-2">Import Companies</h2>
        <p className="text-muted-foreground mb-6">Upload a CSV file or paste CSV data directly</p>

        {!result ? (
          <>
            {/* Download Template */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10 mb-6">
              <Download className="w-5 h-5 text-primary shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Download CSV Template</p>
                <p className="text-xs text-muted-foreground">Pre-filled with example data and all supported columns</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownloadTemplate} className="rounded-lg shrink-0">
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Template
              </Button>
            </div>

            <Tabs defaultValue="file" className="space-y-4">
              <TabsList className="rounded-xl w-full">
                <TabsTrigger value="file" className="rounded-lg flex-1 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger value="paste" className="rounded-lg flex-1 flex items-center gap-1.5">
                  <ClipboardPaste className="w-3.5 h-3.5" />
                  Paste CSV
                </TabsTrigger>
              </TabsList>

              {/* File Upload Tab */}
              <TabsContent value="file" className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                  <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="csv-upload" />
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      {file ? <FileText className="w-7 h-7 text-primary" /> : <Upload className="w-7 h-7 text-primary" />}
                    </div>
                    {file ? (
                      <div>
                        <p className="font-medium text-foreground">{file.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">Click to change file</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-foreground">Click to upload CSV</p>
                        <p className="text-sm text-muted-foreground mt-1">or drag and drop</p>
                      </div>
                    )}
                  </label>
                </div>
                <Button onClick={handleImport} disabled={!file || isProcessing} className="w-full btn-gradient rounded-xl">
                  {isProcessing ? 'Processing...' : 'Import from File'}
                </Button>
              </TabsContent>

              {/* Paste CSV Tab */}
              <TabsContent value="paste" className="space-y-4">
                <Textarea
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder={`Paste CSV data here. First row must be headers.\n\nExample:\nCompany Name,Industry,Location,Website\nGoogle,Technology,"Mountain View, CA",https://google.com\nMicrosoft,Technology,"Redmond, WA",https://microsoft.com`}
                  className="rounded-xl min-h-[200px] font-mono text-xs"
                  rows={10}
                />
                <Button onClick={handleBulkImport} disabled={!bulkText.trim() || isProcessing} className="w-full btn-gradient rounded-xl">
                  {isProcessing ? 'Processing...' : 'Import from Pasted Data'}
                </Button>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive mt-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Supported Columns */}
            <div className="bg-muted/50 rounded-xl p-4 mt-4">
              <h3 className="font-medium text-sm mb-2">Supported Columns</h3>
              <p className="text-xs text-muted-foreground mb-1">
                <strong>Required:</strong> Company Name
              </p>
              <p className="text-xs text-muted-foreground mb-1">
                <strong>Basic:</strong> Industry, Location, Website, Company Size, Description, HQ, Founded, LinkedIn, Career URL
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Advanced:</strong> Headcount, Stage, Core Strength, Hiring Technologies, Notable Products, Career Benefits
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 text-green-700 dark:text-green-300">
                <CheckCircle className="w-6 h-6" />
                <div>
                  <p className="font-medium">Import Complete</p>
                  <p className="text-sm opacity-80">{result.added} companies added</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-xl bg-muted">
                  <p className="text-2xl font-bold text-foreground">{result.total}</p>
                  <p className="text-xs text-muted-foreground">Total Rows</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <p className="text-2xl font-bold text-primary">{result.added}</p>
                  <p className="text-xs text-muted-foreground">Added</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10">
                  <p className="text-2xl font-bold text-amber-600">{result.skipped}</p>
                  <p className="text-xs text-muted-foreground">Duplicates</p>
                </div>
              </div>
              {result.errors.length > 0 && (
                <div className="p-4 rounded-xl bg-destructive/10">
                  <p className="font-medium text-destructive mb-2">Errors ({result.errors.length})</p>
                  <ul className="text-sm text-destructive/80 space-y-1 max-h-32 overflow-y-auto">
                    {result.errors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              )}
            </div>
            <Button onClick={handleClose} className="w-full btn-gradient rounded-xl">Done</Button>
          </>
        )}
      </div>
    </div>
  );
}
