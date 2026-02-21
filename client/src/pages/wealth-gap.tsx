import React, { useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { CONFIG } from '../config';
import RentVsBuyCalculator, { RentVsBuyCalculatorRef } from '@/components/rent-vs-buy-calculator';

const WealthGapEngine = () => {
  const calculatorRef = useRef<RentVsBuyCalculatorRef>(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', CONFIG.developer.brandColor);
    document.documentElement.style.setProperty('--ring', CONFIG.developer.brandColor);
  }, []);

  return (
    <div className="min-h-screen lg:h-screen bg-background text-foreground font-sans selection:bg-primary/30 flex flex-col transition-colors duration-300 overflow-auto lg:overflow-hidden">
      {/* NAV BAR */}
      <nav className="h-16 md:h-20 shrink-0 border-b border-primary/20 px-8 md:px-16 flex items-center justify-between bg-primary backdrop-blur-md z-50">
        <div className="flex-1 flex items-center">
          {CONFIG.developer.logo ? (
            <img 
              src={CONFIG.developer.logo} 
              alt={CONFIG.developer.name} 
              className="h-8 md:h-10 w-auto object-contain"
              data-testid="img-developer-logo"
            />
          ) : (
            <h1 className="text-lg md:text-xl font-black tracking-tight leading-none text-foreground uppercase">{CONFIG.developer.name}</h1>
          )}
        </div>
        
        <div className="flex-1 flex justify-center hidden md:flex">
          <p className="text-[10px] text-black/60 uppercase tracking-[0.2em] font-bold">{CONFIG.developer.tagline}</p>
        </div>
        
        <div className="flex-1 flex justify-end">
          <button 
            onClick={() => calculatorRef.current?.openLeadForm()}
            className="px-6 py-3 rounded-xl bg-black text-white font-black uppercase tracking-widest text-[10px] hover:bg-black/85 transition-all shadow-lg shadow-black/20 flex items-center gap-2"
            data-testid="button-speak-advisor"
          >
            Speak with an advisor
            <ChevronRight size={14} />
          </button>
        </div>
      </nav>
      <main className="flex-1 flex flex-col justify-center overflow-auto lg:overflow-hidden py-4">
        <section className="px-8 md:px-16">
          <RentVsBuyCalculator ref={calculatorRef} />
        </section>
      </main>
      <footer className="h-12 shrink-0 border-t border-border flex items-center px-8 md:px-16 bg-background">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">© 2026 {CONFIG.developer.name} Developments</div>
          <div className="flex gap-6">
            <a href="#" className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Legal</a>
            <a href="#" className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Privacy</a>
            <button className="text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors" data-testid="button-footer-contact">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WealthGapEngine;
