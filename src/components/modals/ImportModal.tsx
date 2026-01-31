import { useState } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImportResult, Company } from '@/types';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: Partial<Company>[]) => ImportResult;
}

export function ImportModal({ isOpen, onClose, onImport }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
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

  const parseCSV = (text: string): Partial<Company>[] => {
    const lines = text.split('\n').filter((line) => line.trim());
    if (lines.length < 2) {
      throw new Error('CSV file must have a header row and at least one data row');
    }

    // Parse header row handling quotes and spaces
    const rawHeaders = parseCSVLine(lines[0]);
    const headers = rawHeaders.map((h) => h.trim().toLowerCase());
    const data: Partial<Company>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const row: any = {};

      headers.forEach((header, index) => {
        const value = values[index]?.trim();
        if (!value) return;

        // New column mapping with spaces in names
        switch (header) {
          case 'company name':
          case 'companyname':
          case 'company_name':
          case 'name':
            row.name = value;
            break;
          case 'logo':
          case 'logourl':
          case 'logo_url':
            row.logoUrl = value;
            break;
          case 'industry':
            row.industry = value;
            break;
          case 'location':
            row.location = value;
            row.hqCity = value; // Also map to hqCity for compatibility
            break;
          case 'description':
            row.description = value;
            break;
          case 'website':
          case 'website url':
            row.website = value;
            row.careerUrl = row.careerUrl || value; // Use as careerUrl if not set
            break;
          case 'company size':
          case 'companysize':
          case 'company_size':
          case 'size':
            row.companySize = value;
            break;
          case 'hq':
          case 'headquarters':
            row.hq = value;
            row.hqCountry = value; // Map to hqCountry
            break;
          case 'about':
            row.about = value;
            row.description = row.description || value; // Fallback to description
            break;
          // Legacy mappings for backward compatibility
          case 'careerurl':
          case 'career_url':
          case 'careersiteurl':
            row.careerUrl = value;
            break;
          case 'linkedinurl':
          case 'linkedin_url':
          case 'linkedin':
            row.linkedinUrl = value;
            break;
          case 'foundedyear':
          case 'founded_year':
          case 'founded':
            row.foundedYear = parseInt(value) || undefined;
            break;
          case 'hqcity':
          case 'hq_city':
          case 'city':
            row.hqCity = value;
            break;
          case 'hqcountry':
          case 'hq_country':
          case 'country':
            row.hqCountry = value;
            break;
          case 'technologies':
          case 'tech':
            row.technologies = value.split(';').map((t) => t.trim()).filter(Boolean);
            break;
          case 'notes':
            row.notes = value;
            break;
        }
      });

      // Only company name is required
      if (row.name) {
        // Ensure careerUrl has a fallback
        if (!row.careerUrl && row.website) {
          row.careerUrl = row.website;
        } else if (!row.careerUrl) {
          row.careerUrl = '#';
        }
        data.push(row);
      }
    }

    return data;
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

  const handleImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const data = parseCSV(text);
      const importResult = onImport(data);
      setResult(importResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setResult(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-card rounded-2xl shadow-xl p-6 w-full max-w-lg mx-4 animate-scale-in border border-border">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-display text-2xl font-semibold mb-2">Import from CSV</h2>
        <p className="text-muted-foreground mb-6">Upload a CSV file to import companies</p>

        {!result ? (
          <>
            {/* File upload area */}
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center mb-6">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <div className="icon-box w-16 h-16 mx-auto mb-4">
                  {file ? (
                    <FileText className="w-8 h-8 text-primary" />
                  ) : (
                    <Upload className="w-8 h-8 text-primary" />
                  )}
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

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive mb-6">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* CSV Template Guide */}
            <div className="bg-muted/50 rounded-xl p-4 mb-6">
              <h3 className="font-medium text-sm mb-2">CSV Template Guide</h3>
              <p className="text-xs text-muted-foreground mb-2">
                <strong>Required column:</strong> Company Name
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                <strong>Optional:</strong> Logo, Industry, Location, Description, Website, Company Size, HQ, About
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> Column names can include spaces. Supports 250+ records per file.
              </p>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!file || isProcessing}
                className="flex-1 btn-gradient"
              >
                {isProcessing ? 'Processing...' : 'Import'}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Import results */}
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
                    {result.errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Button onClick={handleClose} className="w-full btn-gradient">
              Done
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
