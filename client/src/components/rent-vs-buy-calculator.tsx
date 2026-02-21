import React, { useState, useEffect, useMemo, forwardRef, useImperativeHandle } from 'react';
import { ArrowRight, Info, Sparkles, Maximize2, X, CheckCircle, Loader2 } from 'lucide-react';
import { CONFIG } from '../config';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const FALLBACK_RANGES = {
  rent: { min: 1000, max: 50000, step: 1000, default: 10000 },
  deposit: { min: 50000, max: 2000000, step: 50000, default: 200000 }
};

const FALLBACK_PROPERTY = {
  id: "Property",
  price: 500000,
  beds: 1,
  image: "",
  monthlyCharge: 500,
  location: "N/A"
};

const getDefaultProperty = () => CONFIG.data[0] || FALLBACK_PROPERTY;

const calculateRangesFromProperties = () => {
  const properties = CONFIG.data;
  
  if (!properties || properties.length === 0) {
    return FALLBACK_RANGES;
  }
  
  const prices = properties.map(p => p.price).filter(p => p > 0).sort((a, b) => a - b);
  
  if (prices.length === 0) {
    return FALLBACK_RANGES;
  }
  
  const minPrice = prices[0];
  const maxPrice = prices[prices.length - 1];
  
  let depositMin = Math.round(minPrice * 0.2);
  let depositMax = Math.round(maxPrice * 0.8);
  
  if (depositMin >= depositMax) {
    depositMax = depositMin + 100000;
  }
  
  let depositStep = Math.round((depositMax - depositMin) / 20);
  depositStep = Math.max(depositStep, 1000);
  
  const depositDefault = Math.round(depositMin + (depositMax - depositMin) / 4);
  
  const interestRate = CONFIG.assumptions.interestRate || 0.05;
  const mortgageTerm = CONFIG.assumptions.mortgageTerm || 25;
  
  const estimateMonthlyCost = (price: number, deposit: number) => {
    const loan = price - deposit;
    const monthlyRate = interestRate / 12;
    const numPayments = mortgageTerm * 12;
    if (loan <= 0) return 1000;
    const mortgage = (loan * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const avgMonthlyCharge = properties.reduce((sum, p) => sum + (p.monthlyCharge || 0), 0) / properties.length;
    return mortgage + avgMonthlyCharge;
  };
  
  const minMonthlyCost = estimateMonthlyCost(minPrice, minPrice * 0.5);
  const maxMonthlyCost = estimateMonthlyCost(maxPrice, maxPrice * 0.3);
  
  let rentMin = Math.round(minMonthlyCost * 0.5);
  let rentMax = Math.round(maxMonthlyCost * 2);
  
  if (rentMin >= rentMax) {
    rentMax = rentMin + 10000;
  }
  
  let rentStep = Math.round((rentMax - rentMin) / 20);
  rentStep = Math.max(rentStep, 100);
  
  const rentDefault = Math.round(rentMin + (rentMax - rentMin) / 3);
  
  return {
    rent: { min: rentMin, max: rentMax, step: rentStep, default: rentDefault },
    deposit: { min: depositMin, max: depositMax, step: depositStep, default: depositDefault }
  };
};

let cachedRanges: ReturnType<typeof calculateRangesFromProperties> | null = null;
const getDynamicRanges = () => {
  if (!cachedRanges) {
    cachedRanges = calculateRangesFromProperties();
  }
  return cachedRanges;
};

export interface RentVsBuyCalculatorRef {
  openLeadForm: () => void;
}

const RentVsBuyCalculator = forwardRef<RentVsBuyCalculatorRef>((_, ref) => {
  const ranges = getDynamicRanges();
  const [rent, setRent] = useState(ranges.rent.default);
  const [deposit, setDeposit] = useState(ranges.deposit.default);
  const [years, setYears] = useState(10);
  const [activeProperty, setActiveProperty] = useState(getDefaultProperty());
  const [isChanging, setIsChanging] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useImperativeHandle(ref, () => ({
    openLeadForm: () => setIsLeadFormOpen(true),
  }));

  const submitLead = useMutation({
    mutationFn: async (payload: { name: string; email: string; phone: string; propertyId: string; propertyPrice: number; currentRent: number; depositAmount: number; yearsSelected: number; wealthGap: number }) => {
      const response = await apiRequest('POST', '/api/leads', payload);
      return response.json();
    },
    onSuccess: () => {
      setFormSubmitted(true);
    },
  });

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitLead.mutate({
      ...formData,
      propertyId: activeProperty.id,
      propertyPrice: Math.round(activeProperty.price),
      currentRent: Math.round(rent),
      depositAmount: Math.round(deposit),
      yearsSelected: years,
      wealthGap: Math.round(stats.wealthGap),
    });
  };

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', CONFIG.developer.brandColor);
    document.documentElement.style.setProperty('--ring', CONFIG.developer.brandColor);
  }, []);

  const INTEREST_RATE = CONFIG.assumptions.interestRate; 
  const MORTGAGE_TERM = CONFIG.assumptions.mortgageTerm; 
  const RENT_INFLATION = CONFIG.assumptions.rentInflation; 
  const PROPERTY_APPRECIATION = CONFIG.assumptions.propertyAppreciation; 

  const stats = useMemo(() => {
    let totalRentPaid = 0;
    let currentMonthlyRent = rent;
    for (let i = 0; i < years; i++) {
      totalRentPaid += currentMonthlyRent * 12;
      currentMonthlyRent *= (1 + RENT_INFLATION);
    }

    const calculateMonthlyMortgage = (price: number, dep: number) => {
      const loan = price - dep;
      const monthlyRate = INTEREST_RATE / 12;
      const numPayments = MORTGAGE_TERM * 12;
      if (loan <= 0) return 0;
      return (loan * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    };

    const sortedByPrice = [...CONFIG.data].sort((a, b) => a.price - b.price);
    
    const dynamicRanges = getDynamicRanges();
    
    const rentRange = dynamicRanges.rent.max - dynamicRanges.rent.min;
    const depositRange = dynamicRanges.deposit.max - dynamicRanges.deposit.min;
    
    const rentNormalized = rentRange > 0 
      ? Math.max(0, Math.min(1, (rent - dynamicRanges.rent.min) / rentRange))
      : 0.5;
    const depositNormalized = depositRange > 0 
      ? Math.max(0, Math.min(1, (deposit - dynamicRanges.deposit.min) / depositRange))
      : 0.5;
    
    const purchasingPower = (rentNormalized * 0.4) + (depositNormalized * 0.6);
    
    const numProperties = sortedByPrice.length;
    const tierIndex = numProperties > 0
      ? Math.min(Math.max(0, Math.floor(purchasingPower * numProperties)), numProperties - 1)
      : 0;
    
    const bestMatch = sortedByPrice[tierIndex] || getDefaultProperty();

    const futurePropertyValue = bestMatch.price * Math.pow(1 + PROPERTY_APPRECIATION, years);
    const loanAmount = bestMatch.price - deposit;
    const monthlyRate = INTEREST_RATE / 12;
    const n = MORTGAGE_TERM * 12;
    const p = years * 12;
    const remainingBalance = loanAmount * (Math.pow(1 + monthlyRate, n) - Math.pow(1 + monthlyRate, p)) / (Math.pow(1 + monthlyRate, n) - 1);
    
    const equityGain = futurePropertyValue - remainingBalance;
    const wealthGap = equityGain + totalRentPaid; 
    const monthlyOwnershipCost = calculateMonthlyMortgage(bestMatch.price, deposit) + bestMatch.monthlyCharge;

    return { totalRentPaid, equityGain, wealthGap, bestMatch, monthlyOwnershipCost };
  }, [rent, deposit, years]);

  useEffect(() => {
    if (stats.bestMatch.id !== activeProperty.id) {
      setIsChanging(true);
      const timer = setTimeout(() => {
        setActiveProperty(stats.bestMatch);
        setIsChanging(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [stats.bestMatch, activeProperty.id]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat(CONFIG.localization.locale, { 
      style: 'currency', 
      currency: CONFIG.localization.currency, 
      maximumFractionDigits: 0 
    }).format(val);

  return (
    <>
      <div className="max-w-7xl mx-auto text-center w-full">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles size={12} className="text-primary" />
          <span className="text-[9px] font-black uppercase tracking-widest text-primary">Limited Residence Availability</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-foreground mb-4 max-w-4xl mx-auto">
          {CONFIG.project.headline} <br/><span className="text-primary">{CONFIG.project.subHeadline}</span>
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto mb-8 font-medium">
          {CONFIG.project.description}
        </p>

        {/* CALCULATOR INTERFACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch max-w-6xl mx-auto">
          
          {/* INPUTS (LHS) */}
          <div className="lg:col-span-4 bg-card border border-border p-6 rounded-[2rem] shadow-xl text-left flex flex-col space-y-6">
            <div className="space-y-1">
              <h3 className="text-primary text-[9px] font-black uppercase tracking-[0.25em]">Step 1</h3>
              <p className="text-lg font-bold text-foreground">Your Current Spend</p>
            </div>

            <div className="space-y-6 flex-1 flex flex-col justify-between py-2">
              <div className="space-y-6">
                <div className="space-y-3 group">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-1.5">
                      <label className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Monthly Rent</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={10} className="text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] text-[10px]">
                          The amount of money you give to your landlord every single month.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="text-xl font-mono text-foreground group-hover:text-primary transition-colors">{formatCurrency(rent)}</span>
                  </div>
                  <input 
                    type="range" min={ranges.rent.min} max={ranges.rent.max} step={ranges.rent.step} 
                    value={rent} onChange={(e) => setRent(Number(e.target.value))}
                    className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>

                <div className="space-y-3 group">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-1.5">
                      <label className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Available deposit</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info size={10} className="text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[200px] text-[10px]">
                          The savings you have ready to put towards owning your own home.
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span className="text-xl font-mono text-foreground group-hover:text-primary transition-colors">{formatCurrency(deposit)}</span>
                  </div>
                  <input 
                    type="range" min={ranges.deposit.min} max={ranges.deposit.max} step={ranges.deposit.step} 
                    value={deposit} onChange={(e) => setDeposit(Number(e.target.value))}
                    className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <label className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Timeframe</label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={10} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px] text-[10px]">
                      How many years into the future you want to see your wealth growth.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="grid grid-cols-2 gap-2 p-1 bg-muted border border-border rounded-xl">
                  <button onClick={() => setYears(5)} className={`py-2 rounded-lg transition-all text-[9px] font-black tracking-widest uppercase ${years === 5 ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}>5 Years</button>
                  <button onClick={() => setYears(10)} className={`py-2 rounded-lg transition-all text-[9px] font-black tracking-widest uppercase ${years === 10 ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground'}`}>10 Years</button>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN STATS (CENTER) */}
          <div className="lg:col-span-4 flex flex-col justify-center items-center py-4">
            <div className="w-full flex flex-col items-center gap-0 max-w-xs">
              <div className="w-full flex justify-between items-center p-3 rounded-xl bg-red-500/15 border border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3),0_0_30px_rgba(239,68,68,0.15)] animate-pulse-subtle">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black uppercase text-red-500 tracking-widest">🔥 What You Lose</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={10} className="text-red-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[180px] text-[10px]">
                      Total rent paid over {years} years. You never get this money back.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="font-mono text-sm font-bold text-red-500">{formatCurrency(stats.totalRentPaid)}</span>
              </div>
              <div className="relative z-10 -my-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted border-2 border-border text-[9px] font-black text-muted-foreground tracking-wider">VS</span>
              </div>
              <div className="w-full flex justify-between items-center p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2),0_0_30px_rgba(16,185,129,0.1)]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black uppercase text-emerald-600 tracking-widest">What You Gain</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info size={10} className="text-emerald-500/50 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[180px] text-[10px]">
                      Your home's value minus what you owe the bank after {years} years. This is yours to keep.
                    </TooltipContent>
                  </Tooltip>
                </div>
                <span className="font-mono text-sm font-bold text-emerald-600">{formatCurrency(stats.equityGain)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex items-center gap-1 text-[9px] text-muted-foreground hover:text-foreground transition-colors cursor-help">
                    <Info size={10} />
                    <span className="font-medium underline underline-offset-2">View assumptions</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[280px] text-[10px] p-3 bg-foreground text-background">
                  <p className="font-bold mb-2">Calculation Assumptions</p>
                  <ul className="space-y-1">
                    <li><span className="opacity-70">Interest Rate:</span> {(INTEREST_RATE * 100).toFixed(1)}% p.a.</li>
                    <li><span className="opacity-70">Loan Term:</span> {MORTGAGE_TERM} years</li>
                    <li><span className="opacity-70">Rent Inflation:</span> {(RENT_INFLATION * 100).toFixed(0)}% p.a.</li>
                    <li><span className="opacity-70">Property Growth:</span> {(PROPERTY_APPRECIATION * 100).toFixed(0)}% p.a.</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* RECOMMENDATION (RHS) */}
          <div className="lg:col-span-4 bg-card border border-border p-6 rounded-[2rem] shadow-xl text-left flex flex-col justify-center">
            <div className="space-y-1 mb-4">
              <h3 className="text-primary text-[9px] font-black uppercase tracking-[0.25em]">Step 2</h3>
              <p className="text-lg font-bold text-foreground">Our Best Suggestion</p>
            </div>

            <div className={`transition-all duration-500 ${isChanging ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
              <div 
                className="relative rounded-2xl overflow-hidden aspect-video mb-4 border border-border shadow-sm group/img cursor-zoom-in"
                onClick={() => setIsImageModalOpen(true)}
              >
                <img src={activeProperty.image} className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105" alt={activeProperty.id} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <div className="absolute bottom-3 left-3 text-white font-bold text-base">{activeProperty.id}</div>
                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                  <div className="bg-white/90 backdrop-blur p-2 rounded-full shadow-lg transform translate-y-4 group-hover/img:translate-y-0 transition-transform duration-300">
                    <Maximize2 size={18} className="text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1">
                    <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">What You Pay</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={10} className="text-muted-foreground/50 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[180px] text-[10px]">
                        Your new monthly cost to own this home.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-base font-mono font-bold">{formatCurrency(stats.monthlyOwnershipCost)}</p>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1">
                    <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">The Difference</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={10} className="text-muted-foreground/50 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[180px] text-[10px]">
                        How much more or less this is than your current rent.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className={`text-base font-mono font-bold ${stats.monthlyOwnershipCost <= rent ? 'text-emerald-600' : 'text-foreground'}`}>
                    {stats.monthlyOwnershipCost > rent ? '+' : '-'}{formatCurrency(Math.abs(stats.monthlyOwnershipCost - rent))}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setIsLeadFormOpen(true)}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                data-testid="button-open-lead-form"
              >
                Let's make it yours
                <ArrowRight size={14} />
              </button>

              <p className="text-center text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed mt-4">
                For {formatCurrency(Math.abs(stats.monthlyOwnershipCost - rent))} {stats.monthlyOwnershipCost > rent ? 'extra' : 'less'} per month, <br/>you own the asset.
              </p>
            </div>
          </div>

        </div>
        
        {/* Currency Note */}
        <p className="text-[9px] text-muted-foreground mt-6 text-left max-w-6xl mx-auto">
          All prices displayed in {CONFIG.localization.currency}
        </p>
      </div>

      {/* IMAGE MODAL */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => setIsImageModalOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
            onClick={() => setIsImageModalOpen(false)}
          >
            <X size={24} />
          </button>
          <div 
            className="relative max-w-5xl w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={activeProperty.image} 
              alt={activeProperty.id}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            />
            <div className="absolute bottom-6 left-0 right-0 text-white text-center pointer-events-none">
              <p className="text-xl font-bold">{activeProperty.id}</p>
              <p className="text-sm opacity-70 uppercase tracking-widest">{activeProperty.location}</p>
            </div>
          </div>
        </div>
      )}
      {/* LEAD CAPTURE MODAL */}
      {isLeadFormOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={() => { setIsLeadFormOpen(false); setFormSubmitted(false); }}
        >
          <div 
            className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 p-1 rounded-full text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => { setIsLeadFormOpen(false); setFormSubmitted(false); }}
            >
              <X size={20} />
            </button>

            {formSubmitted ? (
              <div className="text-center py-8">
                <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Thank You!</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  Our team will contact you shortly about {activeProperty.id}.
                </p>
                <button 
                  onClick={() => { setIsLeadFormOpen(false); setFormSubmitted(false); }}
                  className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-foreground mb-1">Secure Your Future</h3>
                  <p className="text-muted-foreground text-sm">
                    Interested in {activeProperty.id}? Let's talk.
                  </p>
                </div>

                <form 
                  onSubmit={handleLeadSubmit}
                  className="space-y-4"
                  data-testid="lead-capture-form"
                >
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Full Name</label>
                    <input 
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="John Doe"
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Email Address</label>
                    <input 
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="john@example.com"
                      data-testid="input-email"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-1.5">Phone (Optional)</label>
                    <input 
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="+971 50 123 4567"
                      data-testid="input-phone"
                    />
                  </div>

                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-2">Your Selection</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground font-medium">{activeProperty.id}</span>
                      <span className="font-mono text-primary">{formatCurrency(activeProperty.price)}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Potential wealth gain: <span className="text-emerald-600 font-bold">{formatCurrency(stats.wealthGap)}</span> over {years} years
                    </p>
                  </div>

                  <button 
                    type="submit"
                    disabled={submitLead.isPending}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    data-testid="button-submit-lead"
                  >
                    {submitLead.isPending ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Get in Touch
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>

                  {submitLead.isError && (
                    <p className="text-red-500 text-xs text-center">
                      Something went wrong. Please try again.
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      )}
      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { box-shadow: 0 0 15px rgba(239,68,68,0.3), 0 0 30px rgba(239,68,68,0.15); }
          50% { box-shadow: 0 0 20px rgba(239,68,68,0.45), 0 0 40px rgba(239,68,68,0.25); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 1rem;
          width: 1rem;
          border-radius: 4px;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 3px solid hsl(var(--background));
          box-shadow: 0 2px 8px rgba(37,99,235,0.2);
        }
        input[type=range]::-moz-range-thumb {
          height: 1rem;
          width: 1rem;
          border-radius: 4px;
          background: hsl(var(--primary));
          cursor: pointer;
          border: 3px solid hsl(var(--background));
        }
      `}</style>
    </>
  );
});

export default RentVsBuyCalculator;
