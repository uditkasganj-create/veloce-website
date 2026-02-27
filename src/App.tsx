/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'motion/react';
import {
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  Send,
  ChevronRight,
  ChevronDown,
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
  Maximize2,
  SlidersHorizontal,
  LayoutGrid,
  List
} from 'lucide-react';
import { GoogleGenAI, ThinkingLevel, Modality } from "@google/genai";
import Markdown from 'react-markdown';
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { PRODUCTS, Product, TEAM_MEMBERS, BLOG_POSTS } from './constants';
import { cn } from './lib/utils';
import { useAnalytics, trackInteraction } from './hooks/useAnalytics';
import { ContactModal } from './components/ContactModal';

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

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const isHomeTop = currentPage === 'home' && !isScrolled;
  const isMinimalPage = ['shop', 'team', 'blog', 'ai-lab', 'analytics', 'checkout', 'pdp'].includes(currentPage);
  const forceOpaque = isMinimalPage || isScrolled;
  const navTextColor = (isHomeTop && !isMinimalPage) ? "text-white" : "text-brand-black dark:text-brand-white";

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand-orange z-[60] origin-left"
        style={{ scaleX }}
      />
      <nav className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 px-6 md:px-12 py-4 flex items-center justify-between",
        forceOpaque ? "bg-brand-white/90 dark:bg-brand-black/90 backdrop-blur-xl py-2 border-b border-black/5 dark:border-white/5" : "bg-transparent"
      )}>
        <div className="flex items-center gap-8">
          <button onClick={() => setPage('home')} className={cn("text-xl font-bold tracking-tighter font-serif italic transition-colors hover:text-brand-orange", navTextColor)}>VELOCE</button>
          <div className={cn("hidden lg:flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 dark:opacity-90", navTextColor)}>
            <button onClick={() => setPage('shop')} className={cn("hover:text-brand-orange transition-all hover:tracking-[0.4em]", currentPage === 'shop' && "text-brand-orange opacity-100")}>Shop</button>
            <button onClick={() => setPage('team')} className={cn("hover:text-brand-orange transition-all hover:tracking-[0.4em]", currentPage === 'team' && "text-brand-orange opacity-100")}>Team</button>
            <button onClick={() => setPage('blog')} className={cn("hover:text-brand-orange transition-all hover:tracking-[0.4em]", currentPage === 'blog' && "text-brand-orange opacity-100")}>Insights</button>
            <button onClick={() => setPage('ai-lab')} className={cn("hover:text-brand-orange transition-all hover:tracking-[0.4em]", currentPage === 'ai-lab' && "text-brand-orange opacity-100")}>Gait Analyzer</button>
          </div>
        </div>

        <div className={cn("flex items-center gap-4", navTextColor)}>
          <button onClick={toggleDark} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 hover:text-brand-orange rounded-full transition-colors">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <motion.button
            onClick={() => setPage('checkout')}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 hover:text-brand-orange rounded-full transition-colors relative"
            key={cartCount}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.3 }}
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-brand-orange text-white text-[8px] font-bold rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.5)]">
                {cartCount}
              </span>
            )}
          </motion.button>
          <button
            className="lg:hidden p-2 hover:bg-black/5 dark:hover:bg-white/10 hover:text-brand-orange rounded-full transition-colors"
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
              className="fixed inset-0 bg-brand-white dark:bg-brand-black z-[60] p-12 flex flex-col gap-8 lg:hidden text-brand-black dark:text-brand-white"
            >
              <button onClick={() => setIsMenuOpen(false)} className="self-end p-4 hover:text-brand-orange transition-colors"><X size={32} /></button>
              <button onClick={() => { setPage('home'); setIsMenuOpen(false); }} className="text-5xl font-serif italic hover:text-brand-orange transition-colors">Home</button>
              <button onClick={() => { setPage('shop'); setIsMenuOpen(false); }} className="text-5xl font-serif italic hover:text-brand-orange transition-colors">Shop</button>
              <button onClick={() => { setPage('team'); setIsMenuOpen(false); }} className="text-5xl font-serif italic hover:text-brand-orange transition-colors">Team</button>
              <button onClick={() => { setPage('blog'); setIsMenuOpen(false); }} className="text-5xl font-serif italic hover:text-brand-orange transition-colors">Insights</button>
              <button onClick={() => { setPage('ai-lab'); setIsMenuOpen(false); }} className="text-5xl font-serif italic hover:text-brand-orange transition-colors">Gait Analyzer</button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
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
            className="absolute inset-0 w-full h-full object-cover opacity-85 bg-brand-black"
          >
            <source src="/baner 2.mp4" type="video/mp4" />
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
            className="text-5xl md:text-7xl font-serif italic tracking-tighter leading-none mb-6 text-white uppercase"
          >
            MAXIMUM VELOCITY. <br />
            <span className="text-stroke">ACHIEVED.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-white/90 max-w-lg text-lg md:text-xl font-medium mb-8 leading-relaxed drop-shadow-lg"
          >
            Engineered for the urban athlete who demands precision, speed, and style in every stride.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-10 bg-black/40 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/20 shadow-xl"
          >
            <div className="flex gap-1 text-brand-orange">
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
              <Star size={14} fill="currentColor" />
            </div>
            <span className="text-white text-xs font-mono font-bold tracking-widest uppercase">4.8 / 5.0 (124 Reviews)</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6 w-full max-w-xl"
          >
            <button onClick={() => setPage('shop')} className="btn-ghost text-brand-orange w-full sm:w-auto sm:min-w-[220px] py-5 text-sm border-brand-orange hover:bg-brand-orange/10 backdrop-blur-md">Shop The Collection</button>
            <button onClick={() => setPage('quiz')} className="bg-brand-orange text-brand-black font-bold uppercase tracking-widest rounded-full hover:brightness-110 w-full sm:w-auto sm:min-w-[220px] py-5 text-sm transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)]">Find Your Perfect Fit</button>
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
            src="https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1200&fm=webp"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
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
            src="https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=1200&fm=webp"
            className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-1000"
            referrerPolicy="no-referrer"
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
            src="https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=800&fm=webp"
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-1000"
            referrerPolicy="no-referrer"
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
            src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&fm=webp"
            className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-110 transition-transform duration-1000"
            referrerPolicy="no-referrer"
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

const ProductCarousel = ({ onSelect, setPage, isDark }: { onSelect: (p: Product) => void, setPage: (p: Page) => void, isDark: boolean }) => {
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
            className={cn("cursor-pointer group rounded-[32px] p-4 border hover:shadow-2xl transition-all duration-500", isDark ? "bg-[#13141B] border-white/10 hover:border-brand-orange/50" : "bg-white border-black/5 hover:border-brand-orange/30")}
          >
            <div className="aspect-square bg-black/5 dark:bg-white/5 rounded-3xl overflow-hidden mb-6 relative">
              <img src={product.image} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-100 group-hover:opacity-0 group-hover:scale-110" referrerPolicy="no-referrer" />
              <img src={product.hoverImage} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-110" referrerPolicy="no-referrer" />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="bg-white dark:bg-brand-black/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg text-brand-black dark:text-brand-white">{product.category}</span>
                <div className="flex items-center gap-1 bg-brand-orange text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg">
                  <Star size={10} fill="currentColor" />
                  {product.rating}
                </div>
              </div>
              <div className="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <button
                  className="bg-brand-white dark:bg-brand-black backdrop-blur-md px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-2xl hover:bg-brand-orange dark:hover:bg-brand-orange hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 pointer-events-auto text-brand-black dark:text-brand-white border border-black/10 dark:border-white/20"
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
                <h3 className="text-2xl font-serif italic mb-2 group-hover:text-brand-orange transition-colors dark:text-brand-white">{product.name}</h3>
                <p className="text-xs opacity-80 font-mono uppercase tracking-widest font-medium dark:text-brand-white/70">Starting at ₹{product.price}</p>
              </div>
              <div className="w-12 h-12 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center group-hover:bg-brand-orange group-hover:border-brand-orange group-hover:text-white dark:text-brand-white transition-all duration-300 transform group-hover:rotate-[-45deg]">
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
            className={cn("min-w-[420px] snap-center cursor-pointer group rounded-[32px] p-4 border hover:shadow-2xl transition-all duration-500", isDark ? "bg-[#13141B] border-white/10 hover:border-brand-orange/50" : "bg-white border-black/5 hover:border-brand-orange/30")}
          >
            <div className="aspect-square bg-black/5 dark:bg-white/5 rounded-3xl overflow-hidden mb-6 relative">
              <img src={product.image} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-100 group-hover:opacity-0 group-hover:scale-110" referrerPolicy="no-referrer" />
              <img src={product.hoverImage} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 group-hover:scale-110" referrerPolicy="no-referrer" />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="bg-white dark:bg-brand-black/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg text-brand-black dark:text-brand-white">{product.category}</span>
                <div className="flex items-center gap-1 bg-brand-orange text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg">
                  <Star size={10} fill="currentColor" />
                  {product.rating}
                </div>
              </div>
              <div className="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <button
                  className="bg-brand-white dark:bg-brand-black backdrop-blur-md px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-2xl hover:bg-brand-orange dark:hover:bg-brand-orange hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 pointer-events-auto text-brand-black dark:text-brand-white border border-black/10 dark:border-white/20"
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
                <h3 className="text-2xl font-serif italic mb-2 group-hover:text-brand-orange transition-colors dark:text-brand-white">{product.name}</h3>
                <p className="text-xs opacity-80 font-mono uppercase tracking-widest font-medium dark:text-brand-white/70">Starting at ₹{product.price}</p>
              </div>
              <div className="w-12 h-12 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center group-hover:bg-brand-orange group-hover:border-brand-orange group-hover:text-white dark:text-brand-white transition-all duration-300 transform group-hover:rotate-[-45deg]">
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
          <img src="https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=1200&fm=webp" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
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
        referrerPolicy="no-referrer"
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
        referrerPolicy="no-referrer"
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
  const [showSizeError, setShowSizeError] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('specs');

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true);
      return;
    }
    setShowSizeError(false);
    onAddToCart(selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Collection
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        {/* Visuals - Sticky Container on desktop if content is long */}
        <div className="space-y-6">
          <div className="relative group">
            {viewMode === 'gallery' ? (
              <ZoomImage src={mainImage} alt={product.name} />
            ) : (
              <View360 productId={product.id} />
            )}

            {/* Overlay Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              <span className="bg-brand-orange text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">New Arrival</span>
              <span className="bg-white/90 dark:bg-black/90 backdrop-blur-md text-brand-black dark:text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">Eco-Conscious</span>
            </div>
          </div>


        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-8 p-8 bg-black/5 dark:bg-white/5 rounded-[40px]">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-6xl md:text-7xl font-serif italic leading-[0.9]">{product.name}</h1>
              <div className="flex items-center gap-1 bg-brand-orange text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                <Star size={12} fill="currentColor" />
                {product.rating}
              </div>
            </div>
            <div className="flex items-baseline gap-4 mb-2">
              <p className="text-4xl font-mono">₹{product.price}</p>
              <p className="text-lg font-mono opacity-30 line-through">₹{Math.floor(product.price * 1.2)}</p>
            </div>
            <p className="text-[10px] text-brand-orange font-bold uppercase tracking-widest">{product.emi}</p>
          </div>

          <p className="opacity-60 text-lg mb-12 leading-relaxed px-2">{product.description}</p>

          <div className="mb-12 px-2">
            <div className="flex justify-between items-center mb-6">
              <h4 className={cn("text-xs font-bold uppercase tracking-[0.2em] transition-colors", showSizeError ? "text-red-500" : "opacity-40")}>
                Select Size (UK) {showSizeError && <span className="ml-2 normal-case font-normal text-red-500">(Required)</span>}
              </h4>
              <button
                onClick={() => alert("Size Guide: Standard UK sizing. If between sizes, we recommend sizing up.")}
                className="text-[10px] font-bold uppercase tracking-widest border-b border-current pb-0.5 opacity-30 hover:opacity-100 transition-opacity"
              >
                Size Guide
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {['7', '8', '9', '10', '11', '12'].map(size => (
                <button
                  key={size}
                  onClick={() => { setSelectedSize(size); setShowSizeError(false); }}
                  className={cn(
                    "h-16 rounded-2xl border-2 transition-all duration-300 font-mono text-sm relative overflow-hidden group",
                    selectedSize === size
                      ? "bg-brand-orange text-white border-brand-orange shadow-xl scale-105"
                      : showSizeError ? "border-red-500/50 text-red-500" : "border-black/5 dark:border-white/5 hover:border-brand-orange"
                  )}
                >
                  <span className="relative z-10">{size}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Area */}
          <div className="px-2 space-y-4 mb-12">
            <button
              onClick={handleAddToCart}
              className={cn(
                "w-full py-6 text-sm rounded-full font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl relative overflow-hidden group",
                isAdded ? "bg-emerald-500 text-white shadow-emerald-500/30" : "bg-brand-orange text-white shadow-brand-orange/40 hover:brightness-110",
                showSizeError && "animate-shake bg-red-500"
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isAdded ? (
                  <><Award size={18} className="animate-bounce" /> Added to Bag</>
                ) : (
                  <><ShoppingBag size={18} /> Add to Bag • ₹{product.price}</>
                )}
              </span>
            </button>

          </div>

          {/* Trust Matrix */}
          <div className="grid grid-cols-2 gap-4 mb-16 px-2">
            {[
              { icon: <Truck size={18} />, label: "Express Shipping", sub: "Global delivery in 3-5 days" },
              { icon: <RotateCw size={18} />, label: "30 Day Returns", sub: "Hassle-free size exchange" },
              { icon: <Shield size={18} />, label: "Premium Warranty", sub: "2-year manufacturing cover" },
              { icon: <Award size={18} />, label: "A-Grade Quality", sub: "Lab-tested for 1000km+" }
            ].map((item, i) => (
              <div key={i} className="p-6 bg-black/5 dark:bg-white/5 rounded-3xl border border-transparent hover:border-brand-orange/20 transition-colors group">
                <div className="text-brand-orange mb-3 group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
                <h5 className="text-[10px] font-bold uppercase tracking-widest mb-1">{item.label}</h5>
                <p className="text-[9px] opacity-40 font-medium">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Accordion Specs */}
          <div className="border-t border-black/5 dark:border-white/5 pt-8 space-y-4">
            {[
              {
                id: 'specs', label: 'Technical Specifications', content: (
                  <div className="grid grid-cols-2 gap-x-12 gap-y-6 py-6">
                    {Object.entries(product.specs).map(([key, val]) => (
                      <div key={key} className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase tracking-widest opacity-40">{key}</span>
                        <span className="text-xs font-mono font-bold">{val}</span>
                      </div>
                    ))}
                  </div>
                )
              },
              {
                id: 'tech', label: 'Performance Technology', content: (
                  <div className="py-6 space-y-4">
                    <div className="p-5 bg-brand-orange/5 rounded-2xl border border-brand-orange/10 flex gap-4">
                      <Zap size={20} className="text-brand-orange shrink-0" />
                      <div>
                        <h6 className="text-[10px] font-bold uppercase mb-1">Nitro-Fuel Superfoam™</h6>
                        <p className="text-[11px] opacity-60">Engineered for 85% energy return on every strike.</p>
                      </div>
                    </div>
                    <div className="p-5 bg-brand-orange/5 rounded-2xl border border-brand-orange/10 flex gap-4">
                      <Activity size={20} className="text-brand-orange shrink-0" />
                      <div>
                        <h6 className="text-[10px] font-bold uppercase mb-1">Gait-Sense Stability™</h6>
                        <p className="text-[11px] opacity-60">Adaptive carbon-fiber plate that adjusts to your stride.</p>
                      </div>
                    </div>
                  </div>
                )
              },
              {
                id: 'shipping', label: 'Shipping & Returns', content: (
                  <div className="py-6 text-[11px] opacity-60 leading-relaxed">
                    We offer premium express shipping worldwide. All high-performance models are shipped in protective eco-friendly packaging. Returns are accepted within 30 days of purchase for unused products in their original packaging.
                  </div>
                )
              }
            ].map(sec => (
              <div key={sec.id} className="border-b border-black/5 dark:border-white/5">
                <button
                  onClick={() => setOpenAccordion(openAccordion === sec.id ? null : sec.id)}
                  className="w-full flex justify-between items-center py-4 group"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] group-hover:text-brand-orange transition-colors">{sec.label}</span>
                  <div className={cn("transition-transform duration-300", openAccordion === sec.id ? "rotate-180" : "")}>
                    <ChevronDown size={14} className="opacity-30" />
                  </div>
                </button>
                <AnimatePresence>
                  {openAccordion === sec.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {sec.content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Related Products Carousel Hook */}
          <div className="mt-24">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-12 opacity-40">Complete the Look</h4>
            <div className="grid grid-cols-2 gap-8">
              {PRODUCTS.filter(p => p.id !== product.id).slice(0, 2).map(p => (
                <div key={p.id} onClick={() => { setMainImage(p.image); setPage('pdp'); window.scrollTo(0, 0); }} className="group cursor-pointer">
                  <div className="aspect-square bg-black/5 dark:bg-white/5 rounded-3xl overflow-hidden mb-4 relative">
                    <img src={p.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
                  </div>
                  <h5 className="text-[10px] font-bold uppercase">{p.name}</h5>
                  <p className="text-[10px] font-mono opacity-50">₹{p.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

const AIGaitAnalyzer = ({ onProductSelect }: { onProductSelect: (p: Product) => void }) => {
  const [mode, setMode] = useState<'upload' | 'analyzing' | 'result'>('upload');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedVideo(url);
      setMode('analyzing');
      runAnalysis();
    }
  };

  const runAnalysis = async () => {
    try {
      // Fake delay for dramatic effect
      await new Promise(r => setTimeout(r, 4000));
      setAnalysis("We detected a slight overpronation (12-degree inward roll) during mid-stance. Your cadence is optimal at 168 SPM, but heel striking indicates a need for enhanced rearfoot cushioning.");
      setRecommendedProduct(PRODUCTS[0]); // Recommend Stride X
      setMode('result');
    } catch (err) {
      console.error(err);
      setMode('upload');
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-serif italic mb-4 uppercase">AI Gait Analyzer</h1>
        <p className="opacity-60 max-w-xl mx-auto text-lg leading-relaxed">
          Don't guess your fit. Upload a 10-second video of you running on a treadmill or street, and our AI will biomechanically analyze your stride to recommend the perfect VELOCE model.
        </p>
      </div>

      <div className="glass-panel rounded-[40px] overflow-hidden min-h-[500px] flex items-center justify-center p-8 relative">
        {mode === 'upload' && (
          <div className="text-center w-full max-w-md">
            <div className="w-24 h-24 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange mx-auto mb-8 border border-brand-orange/20">
              <Video size={40} />
            </div>
            <h3 className="text-2xl font-serif italic mb-4">Upload Your Run</h3>
            <p className="opacity-50 text-sm mb-8">Format: MP4, MOV. Max 10 seconds. Side profile works best.</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleVideoUpload}
              className="hidden"
              accept="video/*"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full btn-primary py-5 shadow-[0_0_30px_rgba(226,255,0,0.1)]"
            >
              Select Video
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 opacity-50">
              <Shield size={14} />
              <span className="text-[10px] uppercase tracking-widest font-bold">Privacy Secured. Video deleted after analysis.</span>
            </div>
          </div>
        )}

        {mode === 'analyzing' && (
          <div className="text-center w-full max-w-md">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8 outline outline-2 outline-brand-orange outline-offset-4 pointer-events-none">
              <video src={selectedVideo as string} autoPlay loop muted playsInline className="w-full h-full object-cover opacity-50 grayscale" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-t-2 border-brand-orange animate-spin" />
              </div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay animate-pulse" />
              {/* Fake scanning line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-orange/50 shadow-[0_0_20px_rgba(226,255,0,0.8)] animate-scan" />
            </div>
            <h3 className="text-3xl font-serif italic mb-2 animate-pulse text-brand-orange">Analyzing Biomechanics...</h3>
            <p className="opacity-50 text-sm font-mono tracking-widest">Calculating pronation angle and shock distribution</p>
          </div>
        )}

        {mode === 'result' && recommendedProduct && (
          <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-6 border border-emerald-500/20">
                <Award size={12} /> Analysis Complete
              </div>
              <h3 className="text-4xl font-serif italic mb-6">Your Perfect Match</h3>
              <p className="opacity-80 text-lg leading-relaxed mb-8 p-6 glass-panel rounded-2xl border-l-4 border-l-brand-orange">
                "{analysis}"
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => onProductSelect(recommendedProduct)}
                  className="w-full btn-primary py-5 shadow-[0_0_30px_rgba(226,255,0,0.2)]"
                >
                  View {recommendedProduct.name} - ₹{recommendedProduct.price}
                </button>
                <button onClick={() => { setMode('upload'); setSelectedVideo(null); }} className="w-full btn-ghost py-5 border-black/10 dark:border-white/10">
                  Analyze Another Video
                </button>
              </div>
            </div>

            <div className="relative group cursor-pointer" onClick={() => onProductSelect(recommendedProduct)}>
              <div className="aspect-square rounded-[32px] overflow-hidden relative">
                <img src={recommendedProduct.image} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-brand-orange font-mono text-[10px] uppercase tracking-widest font-bold mb-2 block">Top Recommendation</span>
                  <h4 className="text-3xl font-serif italic text-white">{recommendedProduct.name}</h4>
                </div>
                <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center text-brand-black transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all shadow-lg">
                  <ArrowRight size={20} />
                </div>
              </div>
            </div>
          </div>
        )}
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
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
  const [modalState, setModalState] = useState({ isOpen: false, type: '' });

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
            <li onClick={() => { setPage('shop'); window.scrollTo(0, 0); }} className="cursor-pointer hover:text-brand-orange transition-colors">Shop All</li>
            <li onClick={() => { setPage('shop'); window.scrollTo(0, 0); }} className="cursor-pointer hover:text-brand-orange transition-colors">Beginner Series</li>
            <li onClick={() => { setPage('shop'); window.scrollTo(0, 0); }} className="cursor-pointer hover:text-brand-orange transition-colors">Pro Performance</li>
            <li onClick={() => { setPage('analytics'); window.scrollTo(0, 0); }} className="cursor-pointer hover:text-brand-orange transition-colors flex items-center gap-2"><BarChart3 size={12} /> Site Analytics</li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest mb-8 text-brand-orange">Support</h4>
          <ul className="space-y-4 text-sm opacity-50">
            <li className="cursor-pointer hover:text-brand-orange transition-colors" onClick={() => setModalState({ isOpen: true, type: 'shipping' })}>Shipping & Returns</li>
            <li className="cursor-pointer hover:text-brand-orange transition-colors" onClick={() => setModalState({ isOpen: true, type: 'size' })}>Size Guide</li>
            <li className="cursor-pointer hover:text-brand-orange transition-colors" onClick={() => { trackInteraction('whatsapp_click'); window.open('https://wa.me/1234567890?text=Hi%20Veloce%20Team!%20I%20have%20a%20question%20about...', '_blank'); }}>WhatsApp Support</li>
            <li className="cursor-pointer hover:text-brand-orange transition-colors" onClick={() => setModalState({ isOpen: true, type: 'privacy' })}>Privacy Policy</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-mono opacity-30 uppercase tracking-widest text-center md:text-left">
        <p>© 2026 VELOCE FOOTWEAR. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" className="h-4 grayscale brightness-200" referrerPolicy="no-referrer" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-4 grayscale brightness-200" referrerPolicy="no-referrer" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-4 grayscale brightness-200" referrerPolicy="no-referrer" />
        </div>
      </div>

      <ContactModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        onClose={() => setModalState({ isOpen: false, type: '' })}
      />
    </footer>
  );
};

const AnalyticsDashboard = ({ stats }: { stats: { activeVisitors: number, totalEngagement: number, pageViews: number, recentSubmissions?: any[] } }) => {
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

      {stats.recentSubmissions && stats.recentSubmissions.length > 0 && (
        <div className="mt-12 glass-panel p-8 rounded-[40px]">
          <h3 className="text-xl font-serif italic mb-8">Recent Submissions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="opacity-50 border-b border-white/10 text-xs uppercase tracking-widest">
                <tr>
                  <th className="pb-4 font-normal">Type</th>
                  <th className="pb-4 font-normal">Name</th>
                  <th className="pb-4 font-normal">Message</th>
                  <th className="pb-4 font-normal">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recentSubmissions.map((sub, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-4"><span className="px-2 py-1 rounded bg-white/10 text-[10px] uppercase font-bold">{sub.type}</span></td>
                    <td className="py-4">{sub.name || 'Anonymous'}</td>
                    <td className="py-4 truncate max-w-[200px] opacity-80">{sub.message}</td>
                    <td className="py-4 opacity-50 text-[10px] font-mono">{new Date(sub.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
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
                  <img src={item.product.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
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
              className="w-full py-5 text-sm btn-primary shadow-xl shadow-brand-orange/20 relative overflow-hidden group mb-4"
              disabled={cart.length === 0}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Pay Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 transform skew-x-12 -translate-x-full group-hover:animate-shimmer" />
            </button>
            <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 space-y-4">
              <div className="flex items-center gap-3 opacity-60">
                <Shield size={16} className="text-emerald-500 shrink-0" />
                <span className="text-xs font-medium">Secure SSL Checkout</span>
              </div>
              <div className="flex items-center gap-3 opacity-60">
                <Shield size={16} className="text-blue-500 shrink-0" />
                <span className="text-xs font-medium">30-Day Money Back Guarantee</span>
              </div>
              <div className="flex items-center gap-3 opacity-60">
                <Shield size={16} className="text-purple-500 shrink-0" />
                <span className="text-xs font-medium">24/7 Priority Support</span>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4 opacity-30 grayscale saturate-0">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo.png" className="h-4" referrerPolicy="no-referrer" alt="UPI" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-3" referrerPolicy="no-referrer" alt="Visa" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-4" referrerPolicy="no-referrer" alt="Mastercard" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const ProductCard = ({ p, onClick }: { p: Product, onClick: () => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -10 }}
      onClick={onClick}
      className="cursor-pointer group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-[4/5] bg-black/5 dark:bg-white/5 rounded-[40px] overflow-hidden mb-6 relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={isHovered ? 'hover' : 'main'}
            src={isHovered ? p.hoverImage : p.image}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>

        {/* Quick Add Overlay */}
        <motion.div
          className="absolute inset-x-4 bottom-4 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
        >
          <button className="w-full py-4 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-2xl text-[10px] font-bold uppercase tracking-widest text-brand-black dark:text-white hover:bg-brand-orange hover:text-white transition-all shadow-xl">
            Quick View
          </button>
        </motion.div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {p.price > 7000 && (
            <span className="bg-brand-black/80 backdrop-blur-md text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-white/10">
              Limited Edition
            </span>
          )}
          {p.rating >= 4.9 && (
            <span className="bg-brand-orange text-white text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Best Seller
            </span>
          )}
        </div>
      </div>

      <div className="px-2">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1 block">{p.category}</span>
            <h3 className="text-2xl font-serif italic group-hover:text-brand-orange transition-colors">{p.name}</h3>
          </div>
          <p className="text-lg font-mono">₹{p.price}</p>
        </div>
        <div className="flex items-center gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={10} fill={i < Math.floor(p.rating) ? "currentColor" : "none"} className={i < Math.floor(p.rating) ? "text-brand-orange" : ""} />
          ))}
          <span className="text-[8px] font-bold ml-1">({p.reviews})</span>
        </div>
      </div>
    </motion.div>
  );
};

const ShopPage = ({ setPage, handleProductSelect }: { setPage: (p: Page) => void, handleProductSelect: (p: Product) => void }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');

  const categories = ['All', 'Performance', 'Lifestyle', 'Pro', 'Limited'];

  const filteredProducts = PRODUCTS
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      return 0;
    });

  return (
    <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
        <div>
          <h1 className="text-7xl font-serif italic mb-4">The Collection</h1>
          <div className="flex flex-wrap items-center gap-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.2em] transition-all pb-1 border-b-2",
                  activeCategory === cat ? "text-brand-orange border-brand-orange" : "opacity-40 border-transparent hover:opacity-100"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={14} />
            <input
              type="text"
              placeholder="SEARCH..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/5 dark:bg-white/5 border-none py-3 pl-10 pr-4 rounded-full text-[10px] font-bold tracking-widest outline-none focus:ring-1 focus:ring-brand-orange/30 transition-all"
            />
          </div>
          <button
            onClick={() => setSortBy(sortBy === 'price-low' ? 'price-high' : 'price-low')}
            className="p-3 bg-black/5 dark:bg-white/5 rounded-full hover:bg-brand-orange/10 transition-colors"
          >
            <SlidersHorizontal size={14} className={sortBy !== 'featured' ? "text-brand-orange" : "opacity-40"} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className={cn(
          "grid gap-x-8 gap-y-16",
          viewType === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          <AnimatePresence mode="popLayout">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} p={p} onClick={() => handleProductSelect(p)} />
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-32 text-center">
            <h3 className="text-3xl font-serif italic mb-4">No results found</h3>
            <p className="opacity-50">Try adjusting your filters or search query.</p>
            <button onClick={() => { setActiveCategory('All'); setSearchQuery(''); }} className="mt-8 text-brand-orange border-b border-brand-orange pb-1 font-bold uppercase tracking-widest text-[10px]">Clear all filters</button>
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [isDark, setIsDark] = useState(true);
  const [cart, setCart] = useState<{ product: Product, size: string }[]>([]);
  const [stats, setStats] = useState({ activeVisitors: 0, totalEngagement: 0, pageViews: 0, recentSubmissions: [] });
  const socketRef = useRef<WebSocket | null>(null);

  useAnalytics(page);

  const addToCart = (product: Product, size: string) => {
    trackInteraction('add_to_cart');
    setCart(prev => [...prev, { product, size }]);
    setPage('checkout');
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (page !== 'analytics') return;

    // HTTP fallback for initial load & recent submissions
    const fetchStats = async () => {
      try {
        const API_BASE = (import.meta as any).env?.VITE_API_URL ?? '/api';
        const res = await fetch(`${API_BASE}/analytics/stats`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        setStats(prev => ({
          ...prev, // Keep WS stats if already loaded
          recentSubmissions: data.recentSubmissions || [],
          // Only use HTTP stats if WS hasn't updated them yet
          activeVisitors: prev.activeVisitors || data.activeUsers || 0,
          totalEngagement: prev.totalEngagement || data.totalEngagements || 0,
          pageViews: prev.pageViews || data.totalViews || 0,
        }));
      } catch (err) {
        console.error('Failed to fetch analytics stats:', err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [page]);

  // Global WebSocket Connection
  useEffect(() => {
    const WS_URL = (import.meta as any).env?.VITE_WS_URL ?? (
      window.location.protocol === 'https:' ? `wss://${window.location.host}` : 'ws://localhost:5000'
    );

    const connectWS = () => {
      const ws = new WebSocket(WS_URL);
      socketRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'stats_update') {
            setStats(prev => ({
              ...prev,
              activeVisitors: data.activeVisitors,
              totalEngagement: data.totalEngagement,
              pageViews: data.pageViews
            }));
          }
        } catch (e) {
          console.error("WS parse error", e);
        }
      };

      ws.onclose = () => {
        setTimeout(connectWS, 3000); // Reconnect
      };
    };

    connectWS();

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, []);

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
              <ProductCarousel onSelect={handleProductSelect} setPage={setPage} isDark={isDark} />

              {/* Social Proof */}
              <section className="py-24 px-6 max-w-7xl mx-auto">
                <h2 className="text-5xl font-serif italic mb-12 text-center">Worn by the Community</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden relative group">
                      <img src={`https://picsum.photos/seed/ugc${i}/600/600`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-brand-orange/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Instagram className="text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Newsletter */}
              <section className="py-32 px-6 bg-brand-charcoal text-white text-center relative overflow-hidden">
                {/* Decorative background elements offset */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.1)_0%,transparent_50%)]" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-50" />
                <div className="max-w-2xl mx-auto relative z-10">
                  <h2 className="text-6xl font-serif italic mb-6">Unlock <span className="text-brand-orange">10% Off</span></h2>
                  <p className="opacity-80 mb-12 font-medium text-lg">Join the VELOCE inner circle for exclusive drops and performance insights.</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input type="email" placeholder="YOUR EMAIL ADDRESS" className="flex-1 bg-white/5 border border-white/10 py-5 px-6 outline-none focus:border-brand-orange transition-colors placeholder:text-white/30 font-mono text-sm font-bold rounded-2xl md:rounded-l-2xl md:rounded-r-none" />
                    <button className="bg-brand-orange text-brand-black px-12 py-5 font-bold uppercase tracking-widest hover:brightness-110 transition-all rounded-2xl md:rounded-r-2xl md:rounded-l-none shadow-[0_0_20px_rgba(212,175,55,0.2)]">Subscribe</button>
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-2 opacity-40">
                    <Shield size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">We respect your inbox. No spam.</span>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {page === 'shop' && <ShopPage setPage={setPage} handleProductSelect={handleProductSelect} />}

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
              <AIGaitAnalyzer onProductSelect={(p) => { setSelectedProduct(p); setPage('pdp'); window.scrollTo(0, 0); }} />
            </motion.div>
          )}

          {page === 'blog' && (
            <motion.div key="blog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
              <h1 className="text-7xl font-serif italic mb-16 text-center">Insights</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {BLOG_POSTS.map(post => (
                  <div key={post.id} onClick={() => handleBlogSelect(post)} className="group cursor-pointer flex flex-col">
                    <div className="aspect-[4/3] bg-black/5 dark:bg-white/5 rounded-[32px] overflow-hidden mb-6">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
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


    </div>
  );
}
