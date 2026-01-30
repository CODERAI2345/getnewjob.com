import { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface PageLayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
}

export function PageLayout({ children, onSearch }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar onSearch={onSearch} />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}
