export function Footer() {
  return (
    <footer className="py-10 border-t border-border/30">
      <div className="section-container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center transition-transform duration-300 group-hover:rotate-6">
              <span className="text-primary-foreground font-bold text-sm">CH</span>
            </div>
            <span className="font-display font-bold gradient-text">CareerHub</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 CareerHub. Your data, your control.
          </p>
        </div>
      </div>
    </footer>
  );
}
