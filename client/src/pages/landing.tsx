import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ChevronRight, ChevronDown, Award, Gift, Video, Phone, Linkedin, Instagram, Globe, AlertTriangle, Lock, Play } from 'lucide-react';
import { CONFIG } from '../config';
import RentVsBuyCalculator from '@/components/rent-vs-buy-calculator';

const projectName = CONFIG.developer.tagline || CONFIG.developer.name;
const prospectName = CONFIG.prospectName;
const propertyImages = CONFIG.data.map(d => d.image);
const CALENDLY_URL = CONFIG.calendlyUrl;
const TPL_LOGO = CONFIG.tpl.logo;
const HEADSHOT_URL = CONFIG.tpl.about.headshot;
const FAQ_ITEMS = CONFIG.tpl.faq;

function getYouTubeEmbedUrl(url: string): string {
  try {
    if (!url) return '';
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split(/[?&#]/)[0] || '';
    } else if (url.includes('youtube.com/watch')) {
      videoId = new URL(url).searchParams.get('v') || '';
    } else if (url.includes('youtube.com/embed/')) {
      return url;
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch {
    return url;
  }
}

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const calendlyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', CONFIG.developer.brandColor);
    document.documentElement.style.setProperty('--ring', CONFIG.developer.brandColor);
  }, []);

  useEffect(() => {
    const initCalendly = () => {
      if ((window as any).Calendly && calendlyRef.current) {
        calendlyRef.current.innerHTML = '';
        (window as any).Calendly.initInlineWidget({
          url: CALENDLY_URL,
          parentElement: calendlyRef.current,
        });
      }
    };

    if ((window as any).Calendly) {
      initCalendly();
      return;
    }

    const existing = document.querySelector('script[src*="assets.calendly.com"]');
    if (existing) {
      existing.addEventListener('load', initCalendly);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = initCalendly;
    document.head.appendChild(script);
  }, []);

  const mockupDomain = `${projectName.toLowerCase().replace(/\s+/g, '-')}.thepropertylook.com`;

  return (
    <div className="min-h-screen flex flex-col">

      {/* ============================================================
          PERSONAL GREETING NAV — slim, elegant, personalised
          ============================================================ */}
      <nav className="h-10 md:h-12 shrink-0 border-b border-white/10 px-6 md:px-16 flex items-center justify-between sticky top-0 z-50 bg-black">
        <div className="flex items-center gap-3">
          <img
            src={TPL_LOGO}
            alt="The Property Look"
            className="h-4 md:h-5 w-auto object-contain brightness-0 invert opacity-80"
            data-testid="img-tpl-logo"
          />
          <div className="w-px h-4 bg-white/20 hidden md:block" />
          <p className="text-[9px] md:text-[10px] tracking-[0.15em] text-white/40 font-tpl">
            <span className="hidden sm:inline">This page was built for </span><span className="text-white/80">{prospectName}</span><span className="hidden md:inline"> by The Property Look</span>
          </p>
        </div>
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-tpl px-4 py-1.5 rounded-lg text-black tracking-widest text-[9px] uppercase hover:opacity-90 transition-all flex items-center gap-1.5"
          style={{ backgroundColor: '#fffcf3' }}
          data-testid="button-book-call-nav"
        >
          Book a Call
          <ChevronRight size={12} />
        </a>
      </nav>

      <main className="flex-1">
        {/* ===== SECTION 1: HERO — with floating property images ===== */}
        <section className="relative px-8 md:px-16 pt-12 md:pt-16 pb-4 font-tpl overflow-hidden" style={{ backgroundColor: '#fffcf3' }} data-testid="section-hero">

          {/* Floating property images — decorative, behind content */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {propertyImages[0] && (
              <div
                className="absolute w-32 h-44 md:w-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl border border-black/10 opacity-[0.15] md:opacity-20"
                style={{
                  top: '8%',
                  left: '-2%',
                  transform: 'rotate(-8deg)',
                  animation: 'floatA 6s ease-in-out infinite',
                }}
              >
                <img src={propertyImages[0]} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            {propertyImages[1] && (
              <div
                className="absolute w-28 h-40 md:w-44 md:h-56 rounded-2xl overflow-hidden shadow-2xl border border-black/10 opacity-[0.12] md:opacity-[0.18]"
                style={{
                  top: '5%',
                  right: '-1%',
                  transform: 'rotate(6deg)',
                  animation: 'floatB 7s ease-in-out infinite',
                }}
              >
                <img src={propertyImages[1]} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            {propertyImages[2] && (
              <div
                className="absolute w-24 h-32 md:w-36 md:h-48 rounded-2xl overflow-hidden shadow-2xl border border-black/10 opacity-[0.1] md:opacity-[0.15] hidden md:block"
                style={{
                  bottom: '10%',
                  right: '5%',
                  transform: 'rotate(-4deg)',
                  animation: 'floatC 8s ease-in-out infinite',
                }}
              >
                <img src={propertyImages[2]} alt="" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Hero content */}
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 border border-black/10 mb-4">
              <span className="text-[9px] uppercase tracking-widest text-black/60 font-tpl">Built Specifically For {prospectName}</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight text-black mb-5 leading-[1.15] font-tpl-thin">
              Hey {prospectName}, <strong className="font-tpl whitespace-nowrap">{projectName}</strong>
              <br />
              Now Has Its Own <span className="whitespace-nowrap">Wealth Calculator</span>
            </h2>
            <p className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-sm md:text-base font-tpl tracking-wide mb-8 shadow-lg shadow-black/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              Ready to Deploy in Just 15 Minutes
            </p>

            <div className="max-w-3xl mx-auto mb-4">
              <div className="aspect-video rounded-2xl overflow-hidden border border-black/10 shadow-2xl bg-black relative">
                {videoPlaying ? (
                  <iframe
                    src={`${getYouTubeEmbedUrl(CONFIG.walkthroughVideoUrl)}?autoplay=1`}
                    title="Walkthrough Video"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    data-testid="video-walkthrough"
                  />
                ) : (
                  <button
                    onClick={() => setVideoPlaying(true)}
                    className="w-full h-full relative group cursor-pointer block"
                    data-testid="button-play-video"
                  >
                    <img
                      src={CONFIG.youtubeThumbnail || propertyImages[0]}
                      alt={projectName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

                    <div className="absolute top-5 left-5 flex items-center gap-2.5">
                      {CONFIG.developer.logo && (
                        <img src={CONFIG.developer.logo} alt={CONFIG.developer.name} className="h-5 md:h-7 w-auto object-contain brightness-0 invert opacity-90" />
                      )}
                      <div className="w-px h-5 bg-white/30" />
                      <span className="text-white/80 text-[10px] md:text-xs font-tpl tracking-wide">{projectName}</span>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 shadow-2xl">
                        <Play size={28} className="text-white ml-1" fill="white" />
                      </div>
                      <p className="text-white/90 text-sm md:text-base font-tpl mt-4 tracking-wide">Watch the Walkthrough</p>
                      <p className="text-white/50 text-[10px] md:text-xs font-tpl-thin mt-1">See exactly how it works</p>
                    </div>

                    <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4">
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-3 border-white/60 shadow-2xl">
                        <img src={HEADSHOT_URL} alt={CONFIG.tpl.about.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>

            <div className="max-w-3xl mx-auto bg-red-50 border-2 border-red-300 rounded-xl p-4 flex gap-3 items-center" data-testid="alert-watch-video">
              <AlertTriangle size={22} className="text-red-600 shrink-0" />
              <p className="text-sm text-red-800 font-bold uppercase tracking-wide text-left font-tpl">
                Watch the video above first — this was built specifically for you, not a template.
              </p>
            </div>
          </div>
        </section>

        {/* ===== TRAFFIC FLOW TRANSITION ===== */}
        <div className="pt-12 md:pt-16 pb-0 text-center font-tpl" style={{ backgroundColor: '#fffcf3' }}>
          <div className="max-w-5xl mx-auto px-8 md:px-16">
            <p className="text-[10px] uppercase tracking-[0.4em] text-black/40 mb-3">Here's what your buyers will see, {prospectName}</p>
            <div className="flex items-center justify-center gap-3 mb-3">
              {CONFIG.developer.logo && (
                <img src={CONFIG.developer.logo} alt={CONFIG.developer.name} className="h-7 w-auto object-contain opacity-60" />
              )}
            </div>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-tpl-thin text-black mb-4 leading-tight">
              {projectName}
            </h3>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-400/50 mb-10" style={{ backgroundColor: 'rgba(34, 197, 94, 0.08)', boxShadow: '0 0 12px rgba(34, 197, 94, 0.15), 0 0 4px rgba(34, 197, 94, 0.1)' }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] md:text-xs font-tpl text-green-700/80 tracking-wide">Live Interactive Calculator</span>
            </div>

            <p className="text-[9px] uppercase tracking-[0.4em] text-black/30 mb-5">Traffic Sources</p>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-0">
              {[
                { name: 'Google', icon: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
                { name: 'Instagram', icon: <svg width="20" height="20" viewBox="0 0 24 24"><defs><radialGradient id="ig" cx="30%" cy="107%" r="150%"><stop offset="0%" stopColor="#fdf497"/><stop offset="5%" stopColor="#fdf497"/><stop offset="45%" stopColor="#fd5949"/><stop offset="60%" stopColor="#d6249f"/><stop offset="90%" stopColor="#285AEB"/></radialGradient></defs><rect x="2" y="2" width="20" height="20" rx="5" fill="url(#ig)"/><circle cx="12" cy="12" r="5" fill="none" stroke="white" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="white"/></svg> },
                { name: 'Facebook', icon: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.47h-2.796v8.385C19.612 22.954 24 17.99 24 12z" fill="#1877F2"/><path d="M16.671 15.47L17.203 12h-3.328V9.75c0-.95.465-1.875 1.956-1.875h1.513V4.922s-1.374-.235-2.686-.235c-2.741 0-4.533 1.66-4.533 4.668V12H7.078v3.47h3.047v8.385a12.09 12.09 0 0 0 3.75 0V15.47h2.796z" fill="white"/></svg> },
                { name: 'TikTok', icon: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.43a8.16 8.16 0 0 0 4.77 1.53V7.51a4.83 4.83 0 0 1-1.01-.82z" fill="#000"/><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.43a8.16 8.16 0 0 0 4.77 1.53V7.51a4.83 4.83 0 0 1-1.01-.82z" fill="#25F4EE" opacity="0.7" transform="translate(-1, -1)"/><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.43a8.16 8.16 0 0 0 4.77 1.53V7.51a4.83 4.83 0 0 1-1.01-.82z" fill="#FE2C55" opacity="0.7" transform="translate(1, 1)"/></svg> },
                { name: 'Snapchat', icon: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12.922-.214.04-.012.06-.012.1-.012.18 0 .36.048.51.153.12.09.18.21.22.33.04.135.07.36-.12.51-.03.03-1.59.96-1.59 2.52 0 1.5 1.17 2.31 1.59 2.55l.06.03c.39.21.665.54.78.93.09.33.06.72-.09 1.08-.42 1.02-1.65 1.14-2.34 1.2-.12.015-.24.03-.33.06-.18.06-.39.18-.57.39-.36.42-.66 1.02-1.14 1.02-.12 0-.24-.03-.36-.06-1.02-.27-1.98-.69-3.27-.69s-2.25.42-3.27.69c-.12.03-.24.06-.36.06-.48 0-.78-.6-1.14-1.02-.18-.21-.39-.33-.57-.39-.09-.03-.21-.045-.33-.06-.69-.06-1.92-.18-2.34-1.2-.15-.36-.18-.75-.09-1.08.12-.39.39-.72.78-.93l.06-.03c.42-.24 1.59-1.05 1.59-2.55 0-1.56-1.56-2.49-1.59-2.52-.24-.21-.21-.42-.12-.57.09-.165.27-.285.48-.285h.06c.27.06.57.18.87.21.24.015.42-.03.51-.09-.012-.165-.022-.33-.03-.51l-.003-.06c-.105-1.628-.232-3.654.3-4.847C7.856 1.069 11.226.793 12.206.793z" fill="#FFFC00" stroke="#333" strokeWidth="0.5"/></svg> },
                { name: 'WhatsApp', icon: <svg width="20" height="20" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366"/><path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.142 1.595 5.945L0 24l6.335-1.652A11.95 11.95 0 0 0 12.04 23.8h.006c6.579 0 11.94-5.335 11.943-11.893.002-3.174-1.24-6.16-3.47-8.458zM12.045 21.785h-.005a9.93 9.93 0 0 1-5.055-1.378l-.363-.215-3.76.983 1.005-3.654-.237-.376A9.867 9.867 0 0 1 2.1 11.893C2.103 6.443 6.57 2.001 12.05 2.001c2.647 0 5.137 1.03 7.005 2.903a9.825 9.825 0 0 1 2.904 7.002c-.004 5.45-4.47 9.879-9.914 9.879z" fill="#25D366"/></svg> },
                { name: 'Email', icon: <svg width="20" height="20" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="3" fill="#EA4335"/><path d="M2 7l10 7 10-7" fill="none" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
                { name: 'Property Finder', icon: <img src="https://res.cloudinary.com/dshowga6n/image/upload/v1770821693/Property_Finder_iduDs3KUdg_0_tioii2.png" alt="Property Finder" className="w-5 h-5 object-contain" /> },
                { name: 'Bayut', icon: <img src="https://res.cloudinary.com/dshowga6n/image/upload/v1770821685/Bayut_idq1YS-g3S_0_dp9a9y.png" alt="Bayut" className="w-5 h-5 object-contain" /> },
              ].map((source) => (
                <div
                  key={source.name}
                  className="flex flex-col items-center gap-1.5 px-1"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white border border-black/8 flex items-center justify-center shadow-sm hover:shadow-md transition-all">
                    {source.icon}
                  </div>
                  <span className="text-[8px] md:text-[9px] uppercase tracking-wider text-black/30 font-tpl">{source.name}</span>
                </div>
              ))}
            </div>

            {/* Dotted trail from logos to calculator */}
            <div className="relative h-20 md:h-28 mx-auto max-w-4xl overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 800 100" preserveAspectRatio="none" fill="none">
                {[50, 150, 250, 350, 400, 450, 550, 650, 750].map((x, i) => (
                  <g key={i}>
                    {[0, 15, 30, 45, 60, 75, 90].map((yOff, j) => {
                      const progress = yOff / 90;
                      const cx = x + (400 - x) * progress * 0.6;
                      const opacity = 0.06 + (1 - Math.abs(i - 4) / 4) * 0.08 - progress * 0.04;
                      return (
                        <circle
                          key={j}
                          cx={cx}
                          cy={yOff + 5}
                          r={1.5 - progress * 0.5}
                          fill="black"
                          opacity={Math.max(0.03, opacity)}
                        />
                      );
                    })}
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* ============================================================
            CALCULATOR IN BROWSER MOCKUP FRAME
            ============================================================ */}
        <section className="relative px-4 md:px-12 lg:px-16 pb-16 font-tpl" style={{ backgroundColor: '#fffcf3' }} data-testid="section-calculator">
          <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent 0%, #fffcf3 40%, #fefbf0 100%)' }} />
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Browser chrome */}
            <div className="rounded-t-2xl border border-b-0 border-black/15 bg-[#f0edea] px-4 py-3">
              <div className="flex items-center gap-3">
                {/* Traffic light dots */}
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                </div>
                {/* URL bar */}
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 bg-white/80 rounded-lg px-4 py-1.5 text-[11px] text-black/50 font-mono max-w-md w-full">
                    <Lock size={11} className="text-black/30 shrink-0" />
                    <span className="truncate">{mockupDomain}</span>
                  </div>
                </div>
                {/* Spacer to balance dots */}
                <div className="w-14" />
              </div>
            </div>
            {/* Browser viewport */}
            <div className="rounded-b-2xl border border-t-0 border-black/15 bg-background shadow-2xl overflow-hidden">
              <div className="p-4 md:p-8">
                <RentVsBuyCalculator />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            THE PROPERTY LOOK BRANDED ZONE — below calculator
            ============================================================ */}

        {/* ===== SECTION 3: WHAT I MADE — TPL brand ===== */}
        <section className="px-8 md:px-16 py-10 font-tpl" style={{ backgroundColor: '#fffcf3' }} data-testid="section-what-i-made">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[9px] uppercase tracking-[0.4em] text-black/40 mb-3">What I Made For You</p>
              <h3 className="text-2xl md:text-3xl font-tpl-thin text-black">Everything You Need To Convert Buyers</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-black/8 rounded-2xl p-7 text-center shadow-sm hover:shadow-md transition-shadow" data-testid="card-lead-magnet">
                <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center mx-auto mb-4">
                  <Gift size={22} className="text-black/50" />
                </div>
                <h4 className="font-tpl text-base text-black mb-2">Custom Lead Magnet</h4>
                <p className="text-sm text-black/50 font-tpl-thin">An interactive wealth gap calculator personalized for {projectName}. Buyers see exactly how much wealth they're losing by renting — and what they'd build by owning.</p>
              </div>
              <div className="bg-white border border-black/8 rounded-2xl p-7 text-center shadow-sm hover:shadow-md transition-shadow" data-testid="card-walkthrough-video">
                <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center mx-auto mb-4">
                  <Video size={22} className="text-black/50" />
                </div>
                <h4 className="font-tpl text-base text-black mb-2">Walkthrough Video</h4>
                <p className="text-sm text-black/50 font-tpl-thin">A personalized video showing exactly how the calculator works, how leads flow in, and how to use it in your marketing.</p>
              </div>
              <div className="bg-white border border-black/8 rounded-2xl p-7 text-center shadow-sm hover:shadow-md transition-shadow" data-testid="card-setup-call">
                <div className="w-12 h-12 rounded-2xl bg-black/5 flex items-center justify-center mx-auto mb-4">
                  <Phone size={22} className="text-black/50" />
                </div>
                <h4 className="font-tpl text-base text-black mb-2">15-Min Setup Call</h4>
                <p className="text-sm text-black/50 font-tpl-thin">We hop on a quick call, connect everything to your domain, and launch it live. You're generating leads the same day.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 4: WHY THIS WILL WORK — TPL brand ===== */}
        <section className="px-8 md:px-16 py-12 md:py-16 font-tpl bg-white" data-testid="section-why-this-works">
          <div className="max-w-3xl mx-auto">
            <p className="text-[9px] uppercase tracking-[0.4em] text-black/40 mb-3 text-center">Why This Will Work</p>
            <h3 className="text-2xl md:text-3xl font-tpl-thin text-black text-center mb-8">The Problem With How Most Developers Capture Leads</h3>
            <div className="space-y-5 text-black/60 text-base leading-relaxed font-tpl-thin">
              <p>
                Most property developers rely on generic contact forms. "Interested? Fill in your details." The result? A flood of unqualified leads — tyre kickers, dreamers, and people who will never buy.
              </p>
              <p>
                Your sales team wastes hours chasing people who were never serious. Meanwhile, the real buyers — the ones who can actually afford {projectName} — get the same generic experience as everyone else.
              </p>
              <p>
                This calculator changes that. It shows buyers <span className="text-black font-tpl">the real cost of continuing to rent</span>. They input what they're paying now, their savings, their timeframe — and they see, year by year, how much wealth they're losing to rent versus how much equity they'd build by owning at {projectName}. By the time they submit their details, they've already convinced themselves.
              </p>
              <p className="text-black font-tpl">
                You don't get more leads. You get better ones.
              </p>
            </div>
          </div>
        </section>

        {/* ===== SECTION 5: CREDIBILITY — TPL brand ===== */}
        <section className="px-8 md:px-16 py-12 font-tpl" style={{ backgroundColor: '#fffcf3' }} data-testid="section-credibility">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-3 gap-4 md:gap-8 mb-10">
              {CONFIG.tpl.credibility.stats.map((stat, i) => (
                <div key={i} className={`text-center p-4 md:p-6 ${i === 1 ? 'border-x border-black/10' : ''}`} data-testid={`stat-${i}`}>
                  <p className="text-2xl md:text-4xl text-black font-tpl-thin">{stat.value}</p>
                  <p className="text-[9px] md:text-xs uppercase tracking-widest text-black/40 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-black/8 rounded-2xl p-8 md:p-10 shadow-sm" data-testid="case-study">
              <div className="flex items-center gap-2 mb-4">
                <Award size={18} className="text-black/40" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-black/40">Case Study</span>
              </div>
              <h4 className="text-xl md:text-2xl font-tpl text-black mb-4">{CONFIG.tpl.credibility.caseStudy.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {CONFIG.tpl.credibility.caseStudy.metrics.map((metric, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-2xl font-tpl text-black">{metric.value}</p>
                    <p className="text-sm text-black/50 font-tpl-thin">{metric.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-black/50 text-sm leading-relaxed font-tpl-thin">
                {CONFIG.tpl.credibility.caseStudy.description}
              </p>
            </div>
          </div>
        </section>

        {/* ===== SECTION 6: HOW IT WORKS — TPL brand ===== */}
        <section className="px-8 md:px-16 py-12 md:py-16 bg-white font-tpl" data-testid="section-how-it-works">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[9px] uppercase tracking-[0.4em] text-black/40 mb-3">How It Works</p>
              <h3 className="text-2xl md:text-3xl font-tpl-thin text-black">What Happens When A Buyer Finds Your Calculator</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="relative border border-black/8 rounded-2xl p-6 shadow-sm bg-[#fffcf3]" data-testid="step-engage">
                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center mb-4">
                  <span className="text-black/60 font-tpl text-lg">1</span>
                </div>
                <h4 className="font-tpl text-black mb-2">They Engage</h4>
                <p className="text-sm text-black/50 font-tpl-thin">A potential buyer lands on the calculator and starts adjusting sliders — rent, deposit, timeframe. Instant curiosity.</p>
              </div>
              <div className="relative border border-black/8 rounded-2xl p-6 shadow-sm bg-[#fffcf3]" data-testid="step-invest-time">
                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center mb-4">
                  <span className="text-black/60 font-tpl text-lg">2</span>
                </div>
                <h4 className="font-tpl text-black mb-2">They Invest Time</h4>
                <p className="text-sm text-black/50 font-tpl-thin">They spend 5–10 minutes exploring their numbers. They see how much wealth they're losing to rent every year — and how much equity they'd build owning at {projectName}.</p>
              </div>
              <div className="relative border border-black/8 rounded-2xl p-6 shadow-sm bg-[#fffcf3]" data-testid="step-self-qualify">
                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center mb-4">
                  <span className="text-black/60 font-tpl text-lg">3</span>
                </div>
                <h4 className="font-tpl text-black mb-2">They Self-Qualify</h4>
                <p className="text-sm text-black/50 font-tpl-thin">By the time they're done, they already know if they can afford it. No guessing for your sales team.</p>
              </div>
              <div className="relative border border-black/8 rounded-2xl p-6 shadow-sm bg-[#fffcf3]" data-testid="step-submit">
                <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center mb-4">
                  <span className="text-black/60 font-tpl text-lg">4</span>
                </div>
                <h4 className="font-tpl text-black mb-2">They Submit Details</h4>
                <p className="text-sm text-black/50 font-tpl-thin">Warm, pre-qualified leads arrive in your inbox with their budget, deposit, and property preference attached.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 7: BOOK A CALL — TPL brand ===== */}
        <section className="px-8 md:px-16 py-14 md:py-20 font-tpl" style={{ backgroundColor: '#fffcf3' }} data-testid="section-book-call">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[9px] uppercase tracking-[0.4em] text-black/40 mb-3">Ready To Launch?</p>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-tpl-thin text-black mb-4">
              Everything Is Built. We Just Need 15&nbsp;Minutes To&nbsp;Launch.
            </h3>
            <p className="text-black/50 text-base mb-10 max-w-2xl mx-auto font-tpl-thin">
              Book a quick call and I'll walk you through the calculator, connect it to your domain, and have it generating leads the same day.
            </p>
            <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-black/10 shadow-xl bg-white">
              <div
                ref={calendlyRef}
                style={{ minWidth: '320px', height: '700px' }}
                data-testid="calendly-embed"
              />
            </div>
          </div>
        </section>

        {/* ===== SECTION 8: FAQ — TPL brand ===== */}
        <section className="px-8 md:px-16 py-12 md:py-16 bg-white font-tpl" data-testid="section-faq">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[9px] uppercase tracking-[0.4em] text-black/40 mb-3">FAQ</p>
              <h3 className="text-2xl md:text-3xl font-tpl-thin text-black">Common Questions</h3>
            </div>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#fffcf3] border border-black/8 rounded-xl overflow-hidden shadow-sm"
                  data-testid={`faq-item-${index}`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-black/[0.02] transition-colors"
                    data-testid={`button-faq-${index}`}
                  >
                    <span className="font-tpl text-black text-sm pr-4">{item.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-black/30 shrink-0 transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5 text-sm text-black/50 leading-relaxed font-tpl-thin animate-in fade-in slide-in-from-top-2 duration-200">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SECTION 9: ABOUT ME — TPL brand ===== */}
        <section className="px-8 md:px-16 py-12 md:py-16 font-tpl" style={{ backgroundColor: '#fffcf3' }} data-testid="section-about">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-4 flex justify-center">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border border-black/10 shadow-xl bg-white">
                  <img
                    src={CONFIG.tpl.about.photo}
                    alt={CONFIG.tpl.about.name}
                    className="w-full h-full object-cover"
                    data-testid="img-tulsa-mann"
                  />
                </div>
              </div>
              <div className="md:col-span-8">
                <p className="text-[9px] uppercase tracking-[0.4em] text-black/40 mb-3">About Me</p>
                <h3 className="text-2xl md:text-3xl font-tpl-thin text-black mb-4">{CONFIG.tpl.about.name}</h3>
                <p className="text-sm text-black/50 mb-2 font-tpl">{CONFIG.tpl.about.title}</p>
                <p className="text-base text-black/60 leading-relaxed mb-6 font-tpl-thin">
                  {CONFIG.tpl.about.bio}
                </p>
                <div className="flex items-center gap-4">
                  {CONFIG.tpl.about.socials.linkedin && (
                    <a href={CONFIG.tpl.about.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-black/5 hover:bg-black/10 transition-colors" data-testid="link-linkedin">
                      <Linkedin size={18} className="text-black/40" />
                    </a>
                  )}
                  {CONFIG.tpl.about.socials.instagram && (
                    <a href={CONFIG.tpl.about.socials.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-black/5 hover:bg-black/10 transition-colors" data-testid="link-instagram">
                      <Instagram size={18} className="text-black/40" />
                    </a>
                  )}
                  {CONFIG.tpl.about.socials.website && (
                    <a href={CONFIG.tpl.about.socials.website} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-black/5 hover:bg-black/10 transition-colors" data-testid="link-website">
                      <Globe size={18} className="text-black/40" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SECTION 10: FINAL CTA — TPL brand dark ===== */}
        <section className="px-8 md:px-16 py-14 md:py-20 bg-black font-tpl" data-testid="section-final-cta">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-tpl-thin text-white mb-4">
              Let's Get This Live For {projectName}, {prospectName}
            </h3>
            <p className="text-white/50 text-base mb-8 font-tpl-thin">
              15 minutes. That's all it takes. Everything is already built and ready to deploy.
            </p>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-black uppercase tracking-widest text-xs font-tpl hover:opacity-90 transition-all shadow-lg"
              style={{ backgroundColor: '#fffcf3' }}
              data-testid="button-final-cta"
            >
              Book Your 15-Min Launch Call
              <ArrowRight size={16} />
            </a>
          </div>
        </section>
      </main>

      {/* FOOTER — TPL brand */}
      <footer className="h-12 shrink-0 border-t border-black/10 flex items-center px-8 md:px-16 font-tpl" style={{ backgroundColor: '#fffcf3' }}>
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="text-[9px] uppercase tracking-widest text-black/30">© 2026 The Property Look</div>
          <div className="flex gap-6">
            <a href="#" className="text-[9px] uppercase tracking-widest text-black/30 hover:text-black transition-colors">Legal</a>
            <a href="#" className="text-[9px] uppercase tracking-widest text-black/30 hover:text-black transition-colors">Privacy</a>
            <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="text-[9px] uppercase tracking-widest text-black/30 hover:text-black transition-colors" data-testid="button-footer-contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
