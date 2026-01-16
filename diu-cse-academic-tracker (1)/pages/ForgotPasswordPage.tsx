
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { supabaseService } from '../supabaseService';
import { Mail, Loader2, AlertCircle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSent, setIsSent] = useState(false);

    const handleResetRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await supabaseService.resetPassword(email);
            setIsSent(true);
        } catch (err: any) {
            setError(err.message || 'Failed to send reset link');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden p-6">
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px]" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[480px] relative z-10">
                <div className="bg-white dark:bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 lg:p-14 shadow-2xl">
                    <div className="mb-10 text-center">
                        <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-8">
                            <ShieldCheck size={32} className="text-white" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter uppercase italic">Security Hub</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-[10px] uppercase tracking-widest px-4">Recover your CR access credentials</p>
                    </div>

                    {!isSent ? (
                        <form onSubmit={handleResetRequest} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Registered Mail</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={18} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold dark:text-white"
                                        placeholder="name@diu.edu.bd"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-3">
                                    <AlertCircle size={16} /> {error}
                                </motion.div>
                            )}

                            <button type="submit" disabled={isLoading} className="w-full py-5 bg-indigo-600 text-white font-black rounded-[1.5rem] flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-indigo-500/20">
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><span className="uppercase tracking-[0.3em] text-xs">Send Recovery Link</span><ArrowRight size={18} /></>}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h4 className="text-xl font-black text-slate-900 dark:text-white mb-3">CHECK YOUR MAIL</h4>
                            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">A recovery link has been sent to <b>{email}</b>. Please check your inbox.</p>
                            <Link to="/login" className="premium-btn block py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] text-xs text-center">Back to Login</Link>
                        </div>
                    )}

                    <div className="mt-10 text-center">
                        <Link to="/login" className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-500 transition-colors">Return to Port Entry</Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPasswordPage;
