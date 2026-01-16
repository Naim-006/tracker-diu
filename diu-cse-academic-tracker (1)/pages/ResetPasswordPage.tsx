
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '../supabaseService';
import { Lock, Loader2, AlertCircle, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await supabaseService.updatePassword(password);
            alert('Password updated successfully! Redirecting to login...');
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Failed to update password');
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
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter">New Password</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Create a secure password for your account</p>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold dark:text-white"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl text-[10px] font-black uppercase flex items-center gap-3">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <button type="submit" disabled={isLoading} className="w-full py-5 bg-indigo-600 text-white font-black rounded-[1.5rem] flex items-center justify-center gap-3 disabled:opacity-50">
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><span className="uppercase tracking-[0.3em] text-xs">Update Password</span><ArrowRight size={18} /></>}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;
