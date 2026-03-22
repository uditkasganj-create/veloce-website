/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Send,
  ChevronRight,
  Instagram,
  Twitter,
  Facebook,
  Search,
  Moon,
  Sun,
  Camera,
  Video,
  Image as ImageIcon,
  Star,
  Shield,
  Truck,
  CreditCard,
  MessageCircle,
  ArrowLeft,
  ArrowUp,
  Filter,
  Zap,
  Award,
  Users,
  BarChart3,
  TrendingUp,
  Activity,
  DollarSign,
  RotateCw,
  Maximize2
} from 'lucide-react';
import { GoogleGenAI, ThinkingLevel, Modality } from "@google/genai";
import Markdown from 'react-markdown';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { PRODUCTS, Product, TEAM_MEMBERS, BLOG_POSTS } from './constants';
import { cn } from './lib/utils';

// --- Types ---
type Page = 'home' | 'shop' | 'team' | 'blog' | 'pdp' | 'quiz' | 'ai-lab' | 'blog-detail' | 'analytics' | 'checkout';

// --- Components ---

const Navbar = ({
  currentPage,
  setPage,
  isDark,
  toggleDark,
  cartCount
}: {
  currentPage: Page,
  setPage: (p: Page) => void,
  isDark: boolean,
  toggleDark: () => void,
  cartCount: number
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 md:px-12 py-4 flex items-center justify-between",
      isScrolled ? "bg-brand-white/90 dark:bg-brand-black/90 backdrop-blur-xl py-2 border-b border-black/5 dark:border-white/5" : "bg-transparent"
    )}>
      <div className="flex items-center gap-8">
        <button onClick={() => setPage('home')} className="text-xl font-bold tracking-tighter font-serif italic hover:text-brand-orange transition-colors">VELOCE</button>
        <div className="hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">
          <button onClick={() => setPage('shop')} className={cn("hover:opacity-100 transition-all hover:tracking-[0.4em]", currentPage === 'shop' && "text-brand-orange opacity-100")}>Shop</button>
          <button onClick={() => setPage('team')} className={cn("hover:opacity-100 transition-all hover:tracking-[0.4em]", currentPage === 'team' && "text-brand-orange opacity-100")}>Team</button>
          <button onClick={() => setPage('blog')} className={cn("hover:opacity-100 transition-all hover:tracking-[0.4em]", currentPage === 'blog' && "text-brand-orange opacity-100")}>Insights</button>
          <button onClick={() => setPage('ai-lab')} className={cn("hover:opacity-100 transition-all hover:tracking-[0.4em]", currentPage === 'ai-lab' && "text-brand-orange opacity-100")}>AI Lab</button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={toggleDark} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button onClick={() => setPage('checkout')} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors relative">
          <ShoppingBag size={18} />
          {cartCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-brand-orange text-white text-[8px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
        <button
          className="lg:hidden p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 bg-brand-white dark:bg-brand-black z-[60] p-12 flex flex-col gap-8 lg:hidden"
          >
            <button onClick={() => setIsMenuOpen(false)} className="self-end p-4"><X size={32} /></button>
            <button onClick={() => { setPage('home'); setIsMenuOpen(false); }} className="text-5xl font-serif italic">Home</button>
            <button onClick={() => { setPage('shop'); setIsMenuOpen(false); }} className="text-5xl font-serif italic">Shop</button>
            <button onClick={() => { setPage('team'); setIsMenuOpen(false); }} className="text-5xl font-serif italic">Team</button>
            <button onClick={() => { setPage('blog'); setIsMenuOpen(false); }} className="text-5xl font-serif italic">Insights</button>
            <button onClick={() => { setPage('ai-lab'); setIsMenuOpen(false); }} className="text-5xl font-serif italic">AI Lab</button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ setPage }: { setPage: (p: Page) => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  // Opacity transitions for "rolling" images - Refined for smoother dissolves
  const opacity1 = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [0, 1, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.55, 1], [0, 1]);

  const contentOpacity = useTransform(scrollYProgress, [0.85, 0.95], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0.85, 0.95], [1, 0.95]);

  return (
    <section ref={containerRef} className="relative h-[150vh] w-full">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-brand-black">
        <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
          <motion.video
            initial={{ scale: 1 }}
            animate={{ scale: 1.05 }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            autoPlay
            muted
            loop
            playsInline
            poster="https://picsum.photos/seed/veloce-hero/2070/1380"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          >
            <source src="/baner2.mp4" type="video/mp4" />
          </motion.video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/80" />
        </motion.div>

        <motion.div
          style={{ opacity: contentOpacity, scale: contentScale }}
          className="relative z-10 text-center px-6 max-w-6xl mx-auto flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-10"
          >
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            <p className="text-white font-mono text-[10px] md:text-xs uppercase tracking-[0.3em]">
              Next Gen Performance
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif italic tracking-tighter leading-none mb-6 text-white"
          >
            MAXIMUM VELOCITY. <br />
            <span className="text-stroke">ACHIEVED.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/80 max-w-lg text-base md:text-lg font-light mb-10 leading-relaxed"
          >
            Engineered for the urban athlete who demands precision, speed, and style in every stride.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6 w-full"
          >
            <button onClick={() => setPage('shop')} className="btn-primary min-w-[240px] py-5 text-sm hover:scale-105 transition-transform shadow-xl shadow-brand-orange/20">Shop The Collection</button>
            <button onClick={() => setPage('quiz')} className="btn-ghost text-white min-w-[240px] py-5 text-sm border-white/20 hover:bg-white/10 hover:border-white/40 backdrop-blur-sm">Find Your Perfect Fit</button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const BentoGrid = ({ setPage }: { setPage: (p: Page) => void }) => {
  return (
    <section className="py-32 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 md:gap-8 h-auto md:h-[800px]">
        {/* Main Featured Card */}
        <div className="md:col-span-2 md:row-span-2 bento-item bg-brand-charcoal group rounded-[40px] overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 shadow-2xl">
          <img
            src="https://picsum.photos/seed/veloce-bento1/1200/800"
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
           
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-transparent to-transparent" />
          <div className="absolute inset-0 p-12 flex flex-col justify-end text-white z-10">
            <h4 className="text-xs font-mono uppercase tracking-[0.4em] mb-6 opacity-60">Featured Model</h4>
            <h3 className="text-6xl font-serif italic mb-6 leading-[0.9]">The Urban Nomad</h3>
            <p className="opacity-80 mb-10 max-w-sm text-base leading-relaxed font-light">Designed for the 28-year-old professional balancing daily sprints and city life.</p>
            <button onClick={() => setPage('shop')} className="w-fit btn-primary py-4 px-10 text-xs hover:scale-105 transition-transform">Explore Model</button>
          </div>
        </div>

        {/* Quiz Block */}
        <div className="md:col-span-2 bento-item bg-brand-charcoal flex items-center justify-center p-12 text-white group overflow-hidden rounded-[40px] border border-white/5 hover:border-white/20 transition-all duration-500 shadow-xl">
          <img
            src="https://picsum.photos/seed/veloce-bento2/1200/800"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
           
          />
          <div className="absolute inset-0 bg-brand-black/40 backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all duration-700" />
          <div className="relative z-10 text-center max-w-md">
            <h3 className="text-5xl font-serif italic mb-6">Not Sure Which One?</h3>
            <p className="opacity-70 mb-10 text-base font-light">Our AI-powered quiz analyzes your gait to find your perfect VELOCE match.</p>
            <button onClick={() => setPage('quiz')} className="bg-brand-orange text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-brand-orange transition-all duration-300 shadow-xl shadow-brand-orange/20 hover:shadow-brand-orange/40 transform hover:-translate-y-1">Start 60s Quiz</button>
          </div>
        </div>

        {/* New Drop Block */}
        <div className="md:col-span-1 bento-item bg-brand-charcoal group rounded-[40px] overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 shadow-lg">
          <img
            src="/aero.jpeg"
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000"
           
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/30 to-brand-black/80" />
          <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-brand-orange transition-colors duration-500">
              <Zap size={20} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-[0.3em] text-[10px] mb-3 opacity-50">New Drop</h4>
              <p className="font-serif italic text-3xl leading-none mb-6">Aero Flow 2.0</p>
              <button onClick={() => setPage('shop')} className="text-[10px] font-bold uppercase tracking-widest border-b border-white/30 pb-1 hover:border-brand-orange hover:text-brand-orange transition-all">Shop Now</button>
            </div>
          </div>
        </div>

        {/* Insight Block */}
        <div className="md:col-span-1 bento-item bg-brand-charcoal group rounded-[40px] overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 shadow-lg">
          <img
            src="/speed.jpeg"
            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-1000"
           
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/30 to-brand-black/80" />
          <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 group-hover:bg-brand-orange transition-colors duration-500">
              <Award size={20} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold uppercase tracking-[0.3em] text-[10px] mb-3 opacity-50">Insights</h4>
              <p className="font-serif italic text-3xl leading-none mb-6">The Science of Speed</p>
              <button onClick={() => setPage('blog')} className="text-[10px] font-bold uppercase tracking-widest text-brand-orange border-b border-brand-orange/30 pb-1 hover:border-brand-orange transition-all">Read More</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductCarousel = ({ onSelect, setPage }: { onSelect: (p: Product) => void, setPage: (p: Page) => void }) => {
  return (
    <section className="py-24 overflow-hidden">
      <div className="px-6 max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h2 className="text-5xl font-serif italic">Best Sellers</h2>
          <p className="opacity-50 font-mono text-sm uppercase tracking-widest">Performance Redefined</p>
        </div>
        <button onClick={() => setPage('shop')} className="text-xs font-bold uppercase tracking-widest border-b border-current pb-1">View All</button>
      </div>

      {/* Mobile: Vertical Stack / Grid */}
      <div className="md:hidden px-6 grid grid-cols-1 gap-8">
        {PRODUCTS.map((product) => (
          <motion.div
            key={product.id}
            onClick={() => onSelect(product)}
            className="cursor-pointer group bg-white dark:bg-white/5 rounded-[32px] p-4 border border-black/5 dark:border-white/5 hover:border-brand-orange/30 hover:shadow-2xl transition-all duration-500"
          >
            <div className="aspect-square bg-black/5 dark:bg-white/5 rounded-3xl overflow-hidden mb-6 relative">
              <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">{product.category}</span>
                <div className="flex items-center gap-1 bg-brand-orange text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm">
                  <Star size={10} fill="currentColor" />
                  {product.rating}
                </div>
              </div>
              <button
                className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-brand-orange hover:text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(product);
                }}
              >
                Quick View
              </button>
            </div>
            <div className="flex justify-between items-start px-2 pb-2">
              <div>
                <h3 className="text-2xl font-serif italic mb-2 group-hover:text-brand-orange transition-colors">{product.name}</h3>
                <p className="text-xs opacity-60 font-mono uppercase tracking-widest">Starting at ₹{product.price}</p>
              </div>
              <div className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:bg-brand-orange group-hover:border-brand-orange group-hover:text-white transition-all duration-300 transform group-hover:rotate-[-45deg]">
                <ArrowRight size={18} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop: Horizontal Carousel */}
      <div className="hidden md:flex gap-8 overflow-x-auto px-6 no-scrollbar pb-16 snap-x snap-mandatory">
        {PRODUCTS.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -15, scale: 1.02 }}
            onClick={() => onSelect(product)}
            className="min-w-[420px] snap-center cursor-pointer group bg-white dark:bg-white/5 rounded-[32px] p-4 border border-black/5 dark:border-white/5 hover:border-brand-orange/30 hover:shadow-2xl transition-all duration-500"
          >
            <div className="aspect-square bg-black/5 dark:bg-white/5 rounded-3xl overflow-hidden mb-6 relative">
              <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">{product.category}</span>
                <div className="flex items-center gap-1 bg-brand-orange text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-sm">
                  <Star size={10} fill="currentColor" />
                  {product.rating}
                </div>
              </div>
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <button
                  className="bg-white/90 dark:bg-black/80 backdrop-blur-md px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-brand-orange hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(product);
                  }}
                >
                  Quick View
                </button>
              </div>
            </div>
            <div className="flex justify-between items-start px-2 pb-2">
              <div>
                <h3 className="text-2xl font-serif italic mb-2 group-hover:text-brand-orange transition-colors">{product.name}</h3>
                <p className="text-xs opacity-60 font-mono uppercase tracking-widest">Starting at ₹{product.price}</p>
              </div>
              <div className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center group-hover:bg-brand-orange group-hover:border-brand-orange group-hover:text-white transition-all duration-300 transform group-hover:rotate-[-45deg]">
                <ArrowRight size={18} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const TeamPage = () => {
  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <h1 className="text-7xl md:text-9xl font-serif italic mb-8">THE INNOVATORS</h1>
        <p className="opacity-60 max-w-2xl mx-auto text-lg">
          We are a collective of visionaries, engineers, and storytellers dedicated to democratizing premium performance tech.
          Frustrated by overpriced gear, we built VELOCE to empower every runner.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {TEAM_MEMBERS.map((member) => (
          <div key={member.id} className="glass-panel p-12 rounded-[40px] flex flex-col justify-between min-h-[400px]">
            <div>
              <span className="text-brand-orange font-mono text-xs uppercase tracking-[0.3em] mb-4 block">{member.role}</span>
              <h3 className="text-4xl font-serif italic mb-4">{member.name}</h3>
              <p className="opacity-60 leading-relaxed">{member.description}</p>
            </div>
            <div className="pt-8 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
              <span className="font-mono text-[10px] opacity-30 uppercase tracking-widest">ID: {member.id}</span>
              <div className="flex gap-4 opacity-30">
                <Twitter size={16} />
                <Instagram size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div>
          <h2 className="text-5xl font-serif italic mb-8">Our Sustainability Pledge</h2>
          <div className="space-y-6 opacity-70">
            <p>Every VELOCE shoe is crafted with a conscience. We use 100% recycled ocean-bound plastic for our mesh uppers and bio-based EVA foam derived from sugarcane.</p>
            <p>Our manufacturing partners are strictly vetted for ethical labor practices and carbon-neutral operations. We believe performance shouldn't cost the planet.</p>
          </div>
        </div>
        <div className="aspect-video bg-black/5 dark:bg-white/5 rounded-3xl overflow-hidden">
          <img src="/jordan.jpeg" className="w-full h-full object-cover grayscale" />
        </div>
      </div>
    </div>
  );
};

const ZoomImage = ({ src, alt }: { src: string, alt: string }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className="relative aspect-square bg-black/5 dark:bg-white/5 rounded-[40px] overflow-hidden cursor-zoom-in"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setShowZoom(true)}
      onMouseLeave={() => setShowZoom(false)}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        animate={{
          scale: showZoom ? 2 : 1,
          x: showZoom ? `${50 - position.x}%` : "0%",
          y: showZoom ? `${50 - position.y}%` : "0%"
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
       
      />
      <div className="absolute top-6 right-6 p-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-opacity">
        <Maximize2 size={16} />
      </div>
    </div>
  );
};

const View360 = ({ productId }: { productId: string }) => {
  const [frame, setFrame] = useState(0);
  const totalFrames = 12;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(x);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = x - startX;
    if (Math.abs(diff) > 10) {
      const frameDiff = Math.floor(diff / 20);
      setFrame(prev => (prev - frameDiff + totalFrames) % totalFrames);
      setStartX(x);
    }
  };

  const handleEnd = () => setIsDragging(false);

  const images = Array.from({ length: totalFrames }).map((_, i) =>
    `https://picsum.photos/seed/shoe360${productId}${i}/800/800`
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      ref={containerRef}
      className="relative aspect-square bg-black/5 dark:bg-white/5 rounded-[40px] overflow-hidden cursor-grab active:cursor-grabbing touch-none"
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <img
        src={images[frame]}
        className="w-full h-full object-cover pointer-events-none"
       
      />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 text-white px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md flex items-center gap-3 border border-white/10">
        <RotateCw size={14} className="animate-spin-slow" />
        Drag to Rotate 360°
      </div>
    </motion.div>
  );
};

const PDP = ({ product, onBack, onAddToCart }: { product: Product, onBack: () => void, onAddToCart: (size: string) => void }) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [mainImage, setMainImage] = useState(product.image);
  const [viewMode, setViewMode] = useState<'gallery' | '360'>('gallery');

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size first.');
      return;
    }
    onAddToCart(selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity">
          <ArrowLeft size={14} /> Back to Collection
        </button>
        <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-2xl">
          <button
            onClick={() => setViewMode('gallery')}
            className={cn("px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all", viewMode === 'gallery' ? "bg-brand-orange text-white" : "opacity-50")}
          >
            Gallery
          </button>
          <button
            onClick={() => setViewMode('360')}
            className={cn("px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all", viewMode === '360' ? "bg-brand-orange text-white" : "opacity-50")}
          >
            360° View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Visuals */}
        <div className="space-y-6">
          {viewMode === 'gallery' ? (
            <ZoomImage src={mainImage} alt={product.name} />
          ) : (
            <View360 productId={product.id} />
          )}

          {viewMode === 'gallery' && (
            <div className="grid grid-cols-4 gap-4">
              <div
                onClick={() => setMainImage(product.image)}
                className={cn("aspect-square bg-black/5 dark:bg-white/5 rounded-2xl overflow-hidden cursor-pointer hover:opacity-70 transition-opacity border-2", mainImage === product.image ? "border-brand-orange" : "border-transparent")}
              >
                <img src={product.image} className="w-full h-full object-cover" />
              </div>
              {[1, 2, 3].map(i => {
                const imgUrl = `https://picsum.photos/seed/shoe${product.id}${i}/800/800`;
                return (
                  <div
                    key={i}
                    onClick={() => setMainImage(imgUrl)}
                    className={cn("aspect-square bg-black/5 dark:bg-white/5 rounded-2xl overflow-hidden cursor-pointer hover:opacity-70 transition-opacity border-2", mainImage === imgUrl ? "border-brand-orange" : "border-transparent")}
                  >
                    <img src={imgUrl} className="w-full h-full object-cover" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-6xl font-serif italic leading-none">{product.name}</h1>
              <div className="flex items-center gap-1 bg-brand-orange text-white px-3 py-1 rounded-full text-xs font-bold">
                <Star size={12} fill="currentColor" />
                {product.rating}
              </div>
            </div>
            <p className="text-3xl font-mono mb-2">₹{product.price}</p>
            <p className="text-sm text-brand-orange font-bold uppercase tracking-widest">{product.emi}</p>
          </div>

          <p className="opacity-60 text-lg mb-12 leading-relaxed">{product.description}</p>

          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xs font-bold uppercase tracking-widest">Select Size (UK)</h4>
              <button
                onClick={() => alert("Size Guide: Standard UK sizing. If between sizes, we recommend sizing up for performance models.")}
                className="text-[10px] font-bold uppercase tracking-widest border-b border-current pb-0.5 opacity-50 hover:opacity-100 transition-opacity"
              >
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {['7', '8', '9', '10', '11', '12'].map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "py-4 rounded-2xl border transition-all font-mono",
                    selectedSize === size
                      ? "bg-brand-black text-brand-white border-brand-black dark:bg-brand-white dark:text-brand-black dark:border-brand-white"
                      : "border-black/10 dark:border-white/10 hover:border-brand-orange"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={cn(
              "w-full py-6 text-lg mb-6 rounded-full font-bold uppercase tracking-widest transition-all duration-300",
              isAdded ? "bg-emerald-500 text-white" : "btn-primary"
            )}
          >
            {isAdded ? "Added to Cart!" : "Add to Cart"}
          </button>

          <div className="grid grid-cols-3 gap-4 mb-12">
            <div className="flex flex-col items-center text-center p-4 glass-panel rounded-2xl">
              <Truck size={20} className="mb-2 opacity-50" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 glass-panel rounded-2xl">
              <Shield size={20} className="mb-2 opacity-50" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">2 Year Warranty</span>
            </div>
            <div className="flex flex-col items-center text-center p-4 glass-panel rounded-2xl">
              <CreditCard size={20} className="mb-2 opacity-50" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Secure UPI</span>
            </div>
          </div>

          <div className="pt-12 border-t border-black/5 dark:border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-8">Performance DNA & Specs</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                    <span className="text-[10px] uppercase tracking-widest opacity-50">{key}</span>
                    <span className="text-xs font-mono font-bold">{val}</span>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-brand-orange/5 rounded-3xl border border-brand-orange/10">
                <h5 className="text-[10px] font-bold uppercase tracking-widest mb-4 text-brand-orange">Pro Insights</h5>
                <ul className="space-y-3 text-xs opacity-70">
                  <li className="flex gap-2">
                    <Zap size={12} className="shrink-0 text-brand-orange" />
                    <span>Optimized for high-cadence running and explosive takeoffs.</span>
                  </li>
                  <li className="flex gap-2">
                    <Activity size={12} className="shrink-0 text-brand-orange" />
                    <span>Advanced gait stability system reduces lateral roll by 15%.</span>
                  </li>
                  <li className="flex gap-2">
                    <Award size={12} className="shrink-0 text-brand-orange" />
                    <span>Voted "Best Daily Trainer" by Runner's World 2025.</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-6 glass-panel rounded-3xl">
                <h5 className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">Upper</h5>
                <p className="text-xs font-medium">Engineered V-Knit 3.0</p>
              </div>
              <div className="p-6 glass-panel rounded-3xl">
                <h5 className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-50">Midsole</h5>
                <p className="text-xs font-medium">Nitro-Fuel Superfoam</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="pt-12 border-t border-black/5 dark:border-white/5 mt-12">
            <h4 className="text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
              Reviews <span className="opacity-50">({product.reviews})</span>
            </h4>

            <div className="space-y-6">
              {[
                { name: 'Arjun K.', rating: 5, text: "Absolutely love these shoes! The cushioning is perfect for my daily 5k runs. Highly recommend.", verified: true },
                { name: 'Riya S.', rating: 4, text: "Great fit and very stylish. Took a couple of runs to break in, but now they feel amazing.", verified: true },
                { name: 'Sameer M.', rating: 5, text: "Best running shoes I've owned. The energy return is noticeable and my knees feel great.", verified: true }
              ].map((review, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange font-bold text-xs">
                        {review.name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold">{review.name}</p>
                        {review.verified && <p className="text-[10px] opacity-50 uppercase tracking-wider">Verified Buyer</p>}
                      </div>
                    </div>
                    <div className="flex text-brand-orange gap-0.5">
                      {[...Array(5)].map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          size={12}
                          fill={starIndex < review.rating ? "currentColor" : "none"}
                          className={starIndex < review.rating ? "" : "opacity-30"}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm opacity-80 leading-relaxed">"{review.text}"</p>
                </div>
              ))}
            </div>

            <button className="w-full mt-8 py-4 border border-black/10 dark:border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              View All Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AILab = () => {
  const [mode, setMode] = useState<'chat' | 'gen-image' | 'gen-video' | 'analyze'>('chat');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string, media?: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9'>('1:1');
  const [useSearch, setUseSearch] = useState(false);
  const [preset, setPreset] = useState<'none' | 'studio' | 'lifestyle' | 'action' | 'blueprint' | 'e-commerce product shot' | 'fashion editorial' | 'technical drawing'>('none');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const PRESETS = {
    studio: "Professional studio product photography of a premium performance running shoe, clean white background, soft cinematic lighting, 8k resolution, extreme detail on mesh and sole textures.",
    lifestyle: "Cinematic lifestyle shot of a runner wearing VELOCE shoes on a wet urban street at dusk, neon reflections, shallow depth of field, high fashion aesthetic, moody lighting.",
    action: "Dynamic action shot of a runner's feet in motion, motion blur on the background, sharp focus on the VELOCE shoe hitting the pavement, sparks of energy, high-speed photography.",
    blueprint: "Technical blueprint and exploded view of a futuristic running shoe, architectural drawing style, labels for carbon plate and foam technology, minimalist aesthetic.",
    'e-commerce product shot': "High-end e-commerce product photography, pure white background, soft even lighting, 4k resolution, showcasing the shoe from a 3/4 angle.",
    'fashion editorial': "High-fashion editorial shot, avant-garde styling, dramatic lighting, moody atmosphere, featuring the shoe as a statement piece.",
    'technical drawing': "Detailed technical drawing of the shoe, wireframe style, showcasing internal components and materials, engineering aesthetic."
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAI = async () => {
    if (!input.trim() && !selectedImage) return;
    setIsLoading(true);
    const userMsg = input;
    const currentImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    setMessages(prev => [...prev, { role: 'user', content: userMsg, media: currentImage || undefined }]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

      if (mode === 'chat') {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: currentImage ? {
            parts: [
              { inlineData: { data: currentImage.split(',')[1], mimeType: "image/png" } },
              { text: userMsg || "What shoes from the VELOCE collection would go best with this outfit? Consider the style, colors, and intended use." }
            ]
          } : userMsg,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
            systemInstruction: "You are the VELOCE AI Concierge. You are an expert in athletic footwear, biomechanics, and fashion. You help users like Rahul, a 28-year-old IT professional, find affordable performance gear. Offer personalized shoe recommendations based on user preferences (color, cushioning, terrain), body type (weight, arch type), and current fashion trends. If an image is provided, analyze the outfit and recommend matching VELOCE shoes. Use Google Search to provide up-to-date information on trends and technology.",
            tools: [{ googleSearch: {} }]
          }
        });
        setMessages(prev => [...prev, { role: 'ai', content: response.text || "I'm processing..." }]);
      } else if (mode === 'gen-image') {
        // Handle Image Editing if an image is provided
        if (currentImage) {
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: {
              parts: [
                { inlineData: { data: currentImage.split(',')[1], mimeType: "image/png" } },
                { text: userMsg || "Enhance this shoe design with cinematic lighting and urban textures." }
              ]
            }
          });
          const imgPart = response.candidates[0].content.parts.find(p => p.inlineData);
          if (imgPart) {
            const url = `data:image/png;base64,${imgPart.inlineData.data}`;
            setMessages(prev => [...prev, { role: 'ai', content: "Edited your design:", media: url }]);
          }
        } else {
          // Standard Image Generation
          const finalPrompt = preset !== 'none' ? `${PRESETS[preset as keyof typeof PRESETS]} ${userMsg}` : userMsg;
          const response = await ai.models.generateContent({
            model: "gemini-3-pro-image-preview",
            contents: finalPrompt,
            config: {
              imageConfig: { imageSize, aspectRatio },
              tools: useSearch ? [{ googleSearch: {} }] : []
            }
          });
          const imgPart = response.candidates[0].content.parts.find(p => p.inlineData);
          if (imgPart) {
            const url = `data:image/png;base64,${imgPart.inlineData.data}`;
            setMessages(prev => [...prev, { role: 'ai', content: "Generated your vision:", media: url }]);
          }
        }
      } else if (mode === 'gen-video') {
        // Check for paid API key for Veo
        if ((window as any).aistudio) {
          const hasKey = await (window as any).aistudio.hasSelectedApiKey();
          if (!hasKey) {
            await (window as any).aistudio.openSelectKey();
            // Re-initialize AI with the new key if available
          }
        }

        // Use the paid key if available, otherwise fallback (though Veo might fail without it)
        const videoApiKey = process.env.API_KEY || process.env.GEMINI_API_KEY!;
        const videoAI = new GoogleGenAI({ apiKey: videoApiKey });

        let operation = await videoAI.models.generateVideos({
          model: 'veo-3.1-generate-preview',
          prompt: `${userMsg} (Cinematic, High Quality, 4k, Detailed Texture, Professional Lighting)`,
          image: currentImage ? { imageBytes: currentImage.split(',')[1], mimeType: 'image/png' } : undefined,
          config: {
            resolution: '720p',
            aspectRatio: (aspectRatio === '16:9' || aspectRatio === '9:16') ? aspectRatio : '16:9'
          }
        });

        setMessages(prev => [...prev, { role: 'ai', content: "Rendering your cinematic masterpiece... This may take a moment." }]);

        while (!operation.done) {
          await new Promise(r => setTimeout(r, 5000));
          operation = await videoAI.operations.getVideosOperation({ operation });
        }

        const videoUrl = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (videoUrl) {
          // Fetch the video with the API key
          const vidResponse = await fetch(videoUrl, {
            headers: { 'x-goog-api-key': videoApiKey }
          });
          const blob = await vidResponse.blob();
          const localUrl = URL.createObjectURL(blob);

          setMessages(prev => [...prev, { role: 'ai', content: "Your performance cinematic is ready:", media: localUrl }]);
        }
      } else if (mode === 'analyze') {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-pro-preview",
          contents: {
            parts: [
              { inlineData: { data: currentImage?.split(',')[1] || "", mimeType: "image/png" } },
              { text: userMsg || "Analyze this footwear for design language, material quality, and intended use case." }
            ]
          }
        });
        setMessages(prev => [...prev, { role: 'ai', content: response.text || "Analysis complete." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', content: "The AI grid is experiencing turbulence. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-serif italic mb-4">VELOCE AI LAB</h1>
        <p className="opacity-60">Experiment with the future of design and performance analytics.</p>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto no-scrollbar">
        {[
          { id: 'chat', label: 'Style Chat', icon: MessageCircle },
          { id: 'gen-image', label: 'Design Image', icon: ImageIcon },
          { id: 'gen-video', label: 'Cinematic Video', icon: Video },
          { id: 'analyze', label: 'Analyze Gear', icon: Camera },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl border transition-all whitespace-nowrap text-xs font-bold uppercase tracking-widest",
              mode === m.id ? "bg-brand-orange text-white border-brand-orange" : "border-black/10 dark:border-white/10"
            )}
          >
            <m.icon size={16} />
            {m.label}
          </button>
        ))}
      </div>

      <div className="glass-panel rounded-[40px] overflow-hidden flex flex-col h-[600px]">
        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex flex-col max-w-[85%]", msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start")}>
              <div className={cn("px-6 py-4 rounded-3xl text-sm leading-relaxed", msg.role === 'user' ? "bg-brand-orange text-white" : "bg-black/5 dark:bg-white/10")}>
                <Markdown>{msg.content}</Markdown>
                {msg.media && (
                  <div className="mt-4 rounded-2xl overflow-hidden">
                    {msg.media.startsWith('data:image') ? (
                      <img src={msg.media} className="w-full h-auto" />
                    ) : (
                      <video src={msg.media} controls className="w-full h-auto" />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && <div className="animate-pulse text-xs font-mono opacity-30">AI IS THINKING...</div>}
        </div>

        <div className="p-6 bg-black/5 dark:bg-white/5 border-t border-black/5 dark:border-white/5">
          {mode === 'gen-image' && (
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-xl overflow-x-auto no-scrollbar">
                {(['none', 'studio', 'lifestyle', 'action', 'blueprint', 'e-commerce product shot', 'fashion editorial', 'technical drawing'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setPreset(p)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap",
                      preset === p ? "bg-brand-orange text-white" : "hover:bg-black/5 dark:hover:bg-white/10 opacity-50 hover:opacity-100"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex gap-4">
                <select value={imageSize} onChange={e => setImageSize(e.target.value as any)} className="bg-transparent border border-black/10 dark:border-white/10 rounded-lg text-[10px] p-2">
                  <option value="1K">1K Res</option>
                  <option value="2K">2K Res</option>
                  <option value="4K">4K Res</option>
                </select>
                <select value={aspectRatio} onChange={e => setAspectRatio(e.target.value as any)} className="bg-transparent border border-black/10 dark:border-white/10 rounded-lg text-[10px] p-2">
                  {['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'].map(ratio => (
                    <option key={ratio} value={ratio}>{ratio} Ratio</option>
                  ))}
                </select>
                <button
                  onClick={() => setUseSearch(!useSearch)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all",
                    useSearch ? "bg-brand-orange text-white border-brand-orange" : "border-black/10 dark:border-white/10"
                  )}
                >
                  Search {useSearch ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          )}

          {mode === 'gen-video' && (
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex gap-4 items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Video Settings:</span>
                <select
                  value={aspectRatio}
                  onChange={e => setAspectRatio(e.target.value as any)}
                  className="bg-transparent border border-black/10 dark:border-white/10 rounded-lg text-[10px] p-2"
                >
                  <option value="16:9">16:9 Landscape</option>
                  <option value="9:16">9:16 Portrait</option>
                </select>
                <span className="text-[10px] opacity-40 italic">Generates 720p preview</span>
              </div>
            </div>
          )}

          {selectedImage && (
            <div className="mb-4 relative w-24 h-24 rounded-xl overflow-hidden border border-brand-orange">
              <img src={selectedImage} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedImage(null)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"><X size={12} /></button>
            </div>
          )}

          <div className="flex gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-4 bg-black/5 dark:bg-white/10 rounded-2xl hover:bg-brand-orange hover:text-white transition-colors"
            >
              <Camera size={20} />
            </button>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAI()}
              placeholder={
                mode === 'chat' ? "Ask about pronation, sizing, or get personalized style advice..." :
                  mode === 'gen-image' ? (selectedImage ? "Describe how to edit this design..." : "Describe your custom shoe vision...") :
                    mode === 'gen-video' ? "Describe the cinematic motion..." :
                      "Upload a photo to analyze gear..."
              }
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
            />
            <button onClick={handleAI} className="p-4 bg-brand-orange text-white rounded-2xl"><Send size={20} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogDetail = ({ post, onBack }: { post: any, onBack: () => void }) => {
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [isBlogDark, setIsBlogDark] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fontSizeClasses = {
    sm: 'text-base',
    base: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl'
  };

  return (
    <div className={cn("min-h-screen transition-colors duration-500", isBlogDark ? "bg-[#1a1a1a] text-gray-200" : "bg-transparent")}>
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent">
        <div
          className="h-full bg-brand-orange transition-all duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reading Controls */}
      <div className="fixed top-24 right-6 z-40 flex flex-col gap-2 glass-panel p-2 rounded-2xl">
        <button
          onClick={() => setIsBlogDark(!isBlogDark)}
          className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-xl transition-colors"
          title="Toggle Reading Mode"
        >
          {isBlogDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="h-px bg-black/10 dark:bg-white/10 my-1" />
        <button
          onClick={() => setFontSize('sm')}
          className={cn("p-2 rounded-xl text-xs font-bold", fontSize === 'sm' && "bg-brand-orange text-white")}
        >
          A
        </button>
        <button
          onClick={() => setFontSize('base')}
          className={cn("p-2 rounded-xl text-sm font-bold", fontSize === 'base' && "bg-brand-orange text-white")}
        >
          A
        </button>
        <button
          onClick={() => setFontSize('lg')}
          className={cn("p-2 rounded-xl text-lg font-bold", fontSize === 'lg' && "bg-brand-orange text-white")}
        >
          A
        </button>
      </div>

      <div className="pt-32 pb-24 px-6 max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-12 opacity-50 hover:opacity-100 transition-opacity">
          <ArrowLeft size={14} /> Back to Insights
        </button>

        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-serif italic mb-8 leading-tight">{post.title}</h1>
          <div className="aspect-video rounded-[40px] overflow-hidden mb-12 shadow-2xl">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className={cn("prose-custom leading-relaxed opacity-80 space-y-8 text-justify transition-all duration-300", fontSizeClasses[fontSize])}>
          <Markdown>{post.content}</Markdown>
        </div>

        <div className="mt-24 pt-12 border-t border-black/5 dark:border-white/5 text-center">
          <h3 className="text-2xl font-serif italic mb-6">Ready to elevate your run?</h3>
          <button onClick={() => onBack()} className="btn-primary">Browse our affordable performance shoe collection</button>
        </div>
      </div>
    </div>
  );
};

const Quiz = ({ onComplete }: { onComplete: (shoe: Product) => void }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const questions = [
    {
      q: "What's your primary running terrain?",
      options: ['City Streets / Pavement', 'Track / Sprinting', 'Trail / Off-road', 'Treadmill']
    },
    {
      q: "How many kilometers do you run per week?",
      options: ['0-10 km (Beginner)', '10-30 km (Intermediate)', '30-60 km (Advanced)', '60+ km (Pro)']
    },
    {
      q: "What is your main goal?",
      options: ['Weight Loss', 'Speed / PRs', 'Endurance', 'General Fitness']
    },
    {
      q: "Do you experience any discomfort?",
      options: ['Knee Pain', 'Shin Splints', 'Arch Pain', 'None / Just want comfort']
    },
    {
      q: "What's your budget range?",
      options: ['Under ₹4,000', '₹4,000 - ₹6,000', '₹6,000 - ₹8,000', 'Premium / No Limit']
    }
  ];

  const handleAnswer = (opt: string) => {
    const newAnswers = [...answers, opt];
    if (step < questions.length - 1) {
      setAnswers(newAnswers);
      setStep(step + 1);
    } else {
      // Logic to recommend a shoe
      const recommendation = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
      onComplete(recommendation);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-2xl mx-auto text-center">
      <h1 className="text-6xl font-serif italic mb-8">Find Your Fit</h1>
      <p className="opacity-60 mb-12">Answer 5 quick questions about your running habits and we'll recommend the perfect VELOCE model for you.</p>
      <div className="glass-panel p-12 rounded-[40px] text-left">
        <h3 className="text-2xl font-serif italic mb-8">Question {step + 1}: {questions[step].q}</h3>
        <div className="space-y-4">
          {questions[step].options.map(opt => (
            <button
              key={opt}
              onClick={() => handleAnswer(opt)}
              className="w-full p-6 rounded-2xl border border-black/10 dark:border-white/10 text-left hover:border-brand-orange hover:bg-brand-orange/5 transition-all"
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="mt-12 flex justify-between items-center">
          <span className="text-[10px] font-mono opacity-30 uppercase tracking-widest">{step + 1} of 5</span>
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={() => setStep(step - 1)} className="px-6 py-2 rounded-full border border-black/10 dark:border-white/10 text-[10px] font-bold uppercase tracking-widest">Back</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = ({ setPage }: { setPage: (p: Page) => void }) => {
  return (
    <footer className="bg-brand-charcoal text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 mb-24">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-4xl font-serif italic mb-8">VELOCE</h2>
          <p className="opacity-50 max-w-sm mb-12">Democratizing premium performance tech for the everyday runner. Designed for comfort, built for durability.</p>
          <div className="flex gap-6">
            <Instagram onClick={() => window.open('https://instagram.com', '_blank')} className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
            <Twitter onClick={() => window.open('https://twitter.com', '_blank')} className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
            <Facebook onClick={() => window.open('https://facebook.com', '_blank')} className="opacity-50 hover:opacity-100 transition-opacity cursor-pointer" />
          </div>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-8 text-brand-orange">Explore</h4>
          <ul className="space-y-4 text-sm opacity-50">
            <li onClick={() => setPage('shop')} className="cursor-pointer hover:text-brand-orange transition-colors">Shop All</li>
            <li onClick={() => setPage('shop')} className="cursor-pointer hover:text-brand-orange transition-colors">Beginner Series</li>
            <li onClick={() => setPage('shop')} className="cursor-pointer hover:text-brand-orange transition-colors">Pro Performance</li>
            <li onClick={() => setPage('analytics')} className="cursor-pointer hover:text-brand-orange transition-colors flex items-center gap-2"><BarChart3 size={12} /> Site Analytics</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-8 text-brand-orange">Support</h4>
          <ul className="space-y-4 text-sm opacity-50">
            <li className="cursor-pointer hover:text-brand-orange transition-colors" onClick={() => alert("Shipping & Returns: Free shipping on all orders above ₹2000. 30-day easy returns.")}>Shipping & Returns</li>
            <li className="cursor-pointer hover:text-brand-orange transition-colors" onClick={() => alert("Size Guide: Standard UK sizing applies. Check PDP for specific model fit.")}>Size Guide</li>
            <li className="cursor-pointer hover:text-brand-orange transition-colors" onClick={() => window.open('https://wa.me/1234567890', '_blank')}>WhatsApp Support</li>
            <li className="cursor-pointer hover:text-brand-orange transition-colors" onClick={() => alert("Privacy Policy: Your data is secure with VELOCE.")}>Privacy Policy</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center gap-8 text-[10px] font-mono opacity-30 uppercase tracking-widest">
        <p>© 2026 VELOCE FOOTWEAR. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" className="h-4 grayscale brightness-200" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-4 grayscale brightness-200" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-4 grayscale brightness-200" />
        </div>
      </div>
    </footer>
  );
};

const AnalyticsDashboard = ({ stats }: { stats: { activeVisitors: number, totalEngagement: number, pageViews: number } }) => {
  const [history, setHistory] = useState<{ time: string, visitors: number, engagement: number }[]>([]);

  useEffect(() => {
    setHistory(prev => {
      const newPoint = {
        time: new Date().toLocaleTimeString(),
        visitors: stats.activeVisitors,
        engagement: stats.totalEngagement
      };
      const newHistory = [...prev, newPoint];
      if (newHistory.length > 20) newHistory.shift();
      return newHistory;
    });
  }, [stats]);

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <h1 className="text-6xl font-serif italic mb-4">Live Analytics</h1>
      <p className="opacity-60 mb-12">Real-time performance metrics and user engagement tracking.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="glass-panel p-8 rounded-[32px] flex flex-col justify-between h-[200px]">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-brand-orange/10 rounded-2xl text-brand-orange">
              <Users size={24} />
            </div>
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live
            </span>
          </div>
          <div>
            <h3 className="text-5xl font-mono font-bold mb-2">{stats.activeVisitors}</h3>
            <p className="text-xs opacity-50 font-bold uppercase tracking-widest">Active Visitors</p>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[32px] flex flex-col justify-between h-[200px]">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
              <Activity size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-5xl font-mono font-bold mb-2">{stats.pageViews}</h3>
            <p className="text-xs opacity-50 font-bold uppercase tracking-widest">Total Page Views</p>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[32px] flex flex-col justify-between h-[200px]">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500">
              <TrendingUp size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-5xl font-mono font-bold mb-2">{stats.totalEngagement}</h3>
            <p className="text-xs opacity-50 font-bold uppercase tracking-widest">Engagement Events</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-[40px]">
          <h3 className="text-xl font-serif italic mb-8">Traffic Trends</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4e00" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff4e00" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="visitors" stroke="#ff4e00" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-[40px]">
          <h3 className="text-xl font-serif italic mb-8">Engagement Velocity</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}
                />
                <Bar dataKey="engagement" fill="#8884d8" radius={[4, 4, 0, 0]}>
                  {history.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#a78bfa'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-8 left-8 z-50 p-4 bg-brand-orange text-white rounded-full shadow-lg hover:bg-brand-orange/80 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-orange focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const CheckoutPage = ({ cart, onBack, setPage, onRemove }: { cart: { product: Product, size: string }[], onBack: () => void, setPage: (p: Page) => void, onRemove: (index: number) => void }) => {
  const total = cart.reduce((acc, item) => acc + item.product.price, 0);

  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-12 opacity-50 hover:opacity-100 transition-opacity">
        <ArrowLeft size={14} /> Continue Shopping
      </button>

      <h1 className="text-6xl font-serif italic mb-12">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {cart.length === 0 ? (
            <div className="text-center py-24 glass-panel rounded-[40px]">
              <ShoppingBag size={48} className="mx-auto mb-6 opacity-20" />
              <p className="opacity-50">Your cart is empty.</p>
              <button onClick={() => setPage('shop')} className="mt-8 btn-primary">Go to Shop</button>
            </div>
          ) : (
            cart.map((item, i) => (
              <div key={i} className="glass-panel p-6 rounded-3xl flex gap-6 items-center">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5">
                  <img src={item.product.image} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-serif italic">{item.product.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs opacity-50 font-mono uppercase tracking-widest">Size: UK {item.size}</p>
                    <button
                      onClick={() => onRemove(i)}
                      className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold">₹{item.product.price.toLocaleString()}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="glass-panel p-8 rounded-[40px] sticky top-32">
            <h3 className="text-xl font-serif italic mb-8">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="opacity-50">Subtotal</span>
                <span className="font-mono">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-50">Shipping</span>
                <span className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest">Free</span>
              </div>
              <div className="h-px bg-black/5 dark:bg-white/5 my-4" />
              <div className="flex justify-between text-xl font-serif italic">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => alert("Payment gateway integration coming soon!")}
              className="btn-primary w-full py-4 text-sm shadow-xl shadow-brand-orange/20"
              disabled={cart.length === 0}
            >
              Pay Now
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 opacity-30">
              <Shield size={12} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StickyCTA = ({ product, onAddToCart }: { product: Product, onAddToCart: (size: string) => void }) => {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart('9'); // Default size for sticky CTA if not on PDP
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="sticky-cta">
      <button
        onClick={handleAddToCart}
        className={cn(
          "w-full py-4 shadow-2xl shadow-brand-orange/40 rounded-full font-bold uppercase tracking-widest transition-all duration-300",
          isAdded ? "bg-emerald-500 text-white" : "btn-primary"
        )}
      >
        {isAdded ? "Added!" : `Add to Cart • ₹${product.price}`}
      </button>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [isDark, setIsDark] = useState(true);
  const [cart, setCart] = useState<{ product: Product, size: string }[]>([]);
  const [stats, setStats] = useState({ activeVisitors: 0, totalEngagement: 0, pageViews: 0 });
  const socketRef = useRef<WebSocket | null>(null);

  const addToCart = (product: Product, size: string) => {
    setCart(prev => [...prev, { product, size }]);
    setPage('checkout');
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const socket = new WebSocket(`${protocol}//${host}`);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'stats_update') {
        setStats({
          activeVisitors: data.activeVisitors,
          totalEngagement: data.totalEngagement,
          pageViews: data.pageViews
        });
      }
    };

    const handleClick = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'engagement' }));
      }
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'page_view' }));
    } else if (socketRef.current) {
      socketRef.current.onopen = () => {
        socketRef.current?.send(JSON.stringify({ type: 'page_view' }));
      };
    }
  }, [page]);

  useEffect(() => {
    document.body.classList.toggle('dark', isDark);
  }, [isDark]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const handleProductSelect = (p: Product) => {
    setSelectedProduct(p);
    setPage('pdp');
  };

  const handleBlogSelect = (post: any) => {
    setSelectedBlog(post);
    setPage('blog-detail');
  };

  return (
    <div className="min-h-screen selection:bg-brand-orange selection:text-white">
      <Navbar
        currentPage={page}
        setPage={setPage}
        isDark={isDark}
        toggleDark={() => setIsDark(!isDark)}
        cartCount={cart.length}
      />

      <main>
        <AnimatePresence mode="wait">
          {page === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Hero setPage={setPage} />
              <BentoGrid setPage={setPage} />
              <ProductCarousel onSelect={handleProductSelect} setPage={setPage} />

              {/* Social Proof */}
              <section className="py-24 px-6 max-w-7xl mx-auto">
                <h2 className="text-5xl font-serif italic mb-12 text-center">Worn by the Community</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group">
                      <img src={`https://picsum.photos/seed/ugc${i}/600/600`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                      <div className="absolute inset-0 bg-brand-orange/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Instagram className="text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Newsletter */}
              <section className="py-32 px-6 bg-brand-orange text-white text-center">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-6xl font-serif italic mb-6">Unlock 10% Off</h2>
                  <p className="opacity-80 mb-12">Join the VELOCE inner circle for exclusive drops and performance insights.</p>
                  <div className="flex flex-col sm:row gap-4">
                    <input type="email" placeholder="YOUR EMAIL" className="flex-1 bg-white/20 border-b-2 border-white py-4 px-6 outline-none placeholder:text-white/50 font-mono text-sm" />
                    <button className="bg-white text-brand-orange px-12 py-4 rounded-full font-bold uppercase tracking-widest">Subscribe</button>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {page === 'shop' && (
            <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-end mb-16">
                <div>
                  <h1 className="text-7xl font-serif italic mb-4">The Collection</h1>
                  <p className="opacity-50 font-mono text-sm uppercase tracking-widest">Performance for every stride</p>
                </div>
                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-black/10 dark:border-white/10 px-6 py-3 rounded-full">
                  <Filter size={14} /> Filter
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {PRODUCTS.map(p => (
                  <div key={p.id} onClick={() => handleProductSelect(p)} className="cursor-pointer group">
                    <div className="aspect-[4/5] bg-black/5 dark:bg-white/5 rounded-[40px] overflow-hidden mb-6">
                      <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-serif italic mb-1">{p.name}</h3>
                        <p className="text-sm opacity-50 font-mono">₹{p.price}</p>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-orange text-white px-3 py-1 rounded-full">{p.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {page === 'team' && (
            <motion.div key="team" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TeamPage />
            </motion.div>
          )}

          {page === 'pdp' && selectedProduct && (
            <motion.div key="pdp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PDP
                product={selectedProduct}
                onBack={() => setPage('shop')}
                onAddToCart={(size) => addToCart(selectedProduct, size)}
              />
            </motion.div>
          )}

          {page === 'checkout' && (
            <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CheckoutPage
                cart={cart}
                onBack={() => setPage('shop')}
                setPage={setPage}
                onRemove={removeFromCart}
              />
            </motion.div>
          )}

          {page === 'ai-lab' && (
            <motion.div key="ai-lab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AILab />
            </motion.div>
          )}

          {page === 'blog' && (
            <motion.div key="blog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
              <h1 className="text-7xl font-serif italic mb-16 text-center">Insights</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {BLOG_POSTS.map(post => (
                  <div key={post.id} onClick={() => handleBlogSelect(post)} className="group cursor-pointer flex flex-col">
                    <div className="aspect-[4/3] bg-black/5 dark:bg-white/5 rounded-[32px] overflow-hidden mb-6">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <h2 className="text-2xl font-serif italic mb-4 group-hover:text-brand-orange transition-colors leading-tight">{post.title}</h2>
                    <p className="opacity-60 text-sm mb-6 line-clamp-3">{post.excerpt}</p>
                    <button className="mt-auto text-[10px] font-bold uppercase tracking-widest border-b-2 border-brand-orange w-fit pb-1">Read Full Article</button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {page === 'blog-detail' && selectedBlog && (
            <motion.div key="blog-detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <BlogDetail post={selectedBlog} onBack={() => setPage('blog')} />
            </motion.div>
          )}

          {page === 'quiz' && (
            <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Quiz onComplete={(shoe) => handleProductSelect(shoe)} />
            </motion.div>
          )}

          {page === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AnalyticsDashboard stats={stats} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer setPage={setPage} />

      <ScrollToTop />

      {/* Sticky Mobile CTA */}
      {page === 'pdp' && selectedProduct && (
        <StickyCTA
          product={selectedProduct}
          onAddToCart={(size) => addToCart(selectedProduct, size)}
        />
      )}
    </div>
  );
}
