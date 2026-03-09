import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, AlertCircle } from 'lucide-react';

const API_BASE = (import.meta as any).env?.VITE_API_URL ?? '/api';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: string;
}

const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());

export const ContactModal = ({ isOpen, onClose, type }: ContactModalProps) => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (formData.name.trim().length < 2) {
            return setError('Please enter your full name (at least 2 characters).');
        }
        if (!isValidEmail(formData.email)) {
            return setError('Please enter a valid email address.');
        }
        if (formData.message.trim().length < 10) {
            return setError('Message must be at least 10 characters.');
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, type })
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false);
                    setFormData({ name: '', email: '', phone: '', message: '' });
                    onClose();
                }, 3000);
            } else {
                const data = await res.json().catch(() => ({}));
                setError(data.error || 'Submission failed. Please try again.');
            }
        } catch (err) {
            setError('Unable to connect. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        if (type === 'shipping') return 'Shipping & Returns Inquiry';
        if (type === 'size') return 'Size Guide Assistance';
        if (type === 'privacy') return 'Privacy Policy Request';
        return 'Contact Support';
    };

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="bg-brand-white dark:bg-[#1e2028] text-brand-black dark:text-brand-white w-full max-w-lg rounded-[32px] p-6 sm:p-8 relative overflow-hidden shadow-2xl border border-black/10 dark:border-white/10"
                    >
                        <button
                            onClick={onClose}
                            aria-label="Close modal"
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-2xl sm:text-3xl font-serif italic mb-2 tracking-tighter pr-8">{getTitle()}</h2>
                        <p className="opacity-60 text-sm mb-6">Fill out the form below and our support team will respond within 24 hours.</p>

                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-500/10 text-green-600 dark:text-green-400 p-6 rounded-2xl border border-green-500/20 text-center"
                            >
                                <div className="text-4xl mb-4">✨</div>
                                <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                                <p className="text-sm opacity-80">We've received your inquiry and will contact you shortly.</p>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Full Name"
                                        value={formData.name}
                                        minLength={2}
                                        maxLength={100}
                                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                                    />
                                    <input
                                        required
                                        type="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        maxLength={200}
                                        onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                                        className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                                    />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Phone Number (Optional)"
                                    value={formData.phone}
                                    maxLength={20}
                                    onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange transition-colors"
                                />
                                <textarea
                                    required
                                    placeholder="How can we help you today?"
                                    rows={4}
                                    minLength={10}
                                    maxLength={2000}
                                    value={formData.message}
                                    onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                                    className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-orange transition-colors resize-none"
                                />

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                                    >
                                        <AlertCircle size={16} className="shrink-0" />
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-brand-orange text-brand-black rounded-xl py-4 font-bold text-sm tracking-widest uppercase hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Sending...' : 'Send Message'} <Send size={16} />
                                </button>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
