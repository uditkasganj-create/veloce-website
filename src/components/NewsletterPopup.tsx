import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { newsletterApi } from '@/lib/api';

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('veloce_newsletter_seen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('veloce_newsletter_seen', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await newsletterApi.subscribe(email);
      setSuccess(true);
      localStorage.setItem('veloce_newsletter_seen', 'true');
      setTimeout(() => {
        setIsOpen(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to subscribe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-[40px] p-8 md:p-12 shadow-2xl"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!success ? (
              <>
                <div className="text-center mb-8">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-widest mb-4">
                    Exclusive Offer
                  </span>
                  <h2 className="text-3xl md:text-4xl font-serif italic mb-4">
                    Join the Veloce Club
                  </h2>
                  <p className="opacity-60">
                    Subscribe to get 10% off your first order and exclusive access to new launches.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-6 py-4 rounded-full border border-gray-200 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-orange transition-all"
                  />
                  {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-full bg-brand-orange text-brand-black font-bold uppercase tracking-widest hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Subscribing...
                      </>
                    ) : (
                      'Subscribe Now'
                    )}
                  </button>
                </form>

                <p className="text-center text-xs opacity-40 mt-4">
                  By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
                </p>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-brand-orange/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎉</span>
                </div>
                <h2 className="text-3xl font-serif italic mb-4">You're In!</h2>
                <p className="opacity-60">
                  Check your email for your exclusive 10% discount code.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
