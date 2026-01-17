
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { supabaseService } from '../supabaseService';
import { Section, Batch } from '../types';
import { SECTIONS } from '../constants';
import { User, UserCircle, Layers, Users, Mail, Lock, Loader2, AlertCircle, ArrowRight, ShieldCheck, Activity, Eye, EyeOff } from 'lucide-react';

const SignupPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const [batches, setBatches] = useState<Batch[]>([]);
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        batch_id: '',
        section: 'A' as Section,
        role: 'CR',
        student_id: '',
        sub_section: ''
    });

    React.useEffect(() => {
        supabaseService.fetchBatches().then(setBatches);
    }, []);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (!form.batch_id) {
            setError('Please select your batch.');
            setIsLoading(false);
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        try {
            console.log('[Signup] Starting signup for:', form.email);
            await supabaseService.signUp(
                form.email,
                form.password,
                form.section,
                form.name,
                'CR',
                form.batch_id,
                form.sub_section || undefined
            );

            // For signup, we explicitly move to verify page because they aren't "logged in" yet usually
            navigate('/verify-email');
        } catch (err: any) {
            console.error('[Signup] Error:', err);
            setError(err.message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden p-6 py-20">
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px]" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[640px] relative z-10">
                <div className="bg-white dark:bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 lg:p-14 shadow-2xl">
                    <div className="mb-12 text-center">
                        <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl mx-auto mb-8">
                            <ShieldCheck size={32} className="text-white" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tighter uppercase italic">CR Registration</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-xs tracking-widest lowercase">Request entry to the management panel</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold dark:text-white"
                                        placeholder="Your Name"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Student ID</label>
                                <div className="relative group">
                                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={18} />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold dark:text-white"
                                        placeholder="2XX-XX-XXX"
                                        value={form.student_id}
                                        onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Assigned Batch</label>
                            <div className="relative group">
                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-10" size={18} />
                                <select
                                    required
                                    className="w-full pl-12 pr-10 py-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black dark:text-white appearance-none cursor-pointer"
                                    value={form.batch_id}
                                    onChange={(e) => setForm({ ...form, batch_id: e.target.value })}
                                >
                                    <option value="">SELECT BATCH</option>
                                    {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-focus-within:text-indigo-500"><Activity size={12} /></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Assigned Section</label>
                                <div className="relative group">
                                    <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-10" size={18} />
                                    <select
                                        className="w-full pl-12 pr-10 py-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black dark:text-white appearance-none cursor-pointer"
                                        value={form.section}
                                        onChange={(e) => setForm({ ...form, section: e.target.value as Section })}
                                    >
                                        {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-focus-within:text-indigo-500"><Activity size={12} /></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Lab Group (Optional)</label>
                                <div className="relative group">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-10" size={18} />
                                    <select
                                        className="w-full pl-12 pr-10 py-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black dark:text-white appearance-none cursor-pointer"
                                        value={form.sub_section}
                                        onChange={(e) => setForm({ ...form, sub_section: e.target.value })}
                                    >
                                        <option value="">WHOLE SECTION</option>
                                        <option value="1">GROUP 01</option>
                                        <option value="2">GROUP 02</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-focus-within:text-indigo-500"><Activity size={12} /></div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Institutional Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={18} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold dark:text-white"
                                    placeholder="id@diu.edu.bd"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Security Key (Password)</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold dark:text-white"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
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

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Confirm Security Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={18} />
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold dark:text-white"
                                    placeholder="••••••••"
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-3">
                                <AlertCircle size={16} /> {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[1.5rem] shadow-2xl shadow-indigo-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    <span className="uppercase tracking-[0.3em] text-xs">Request Admin Access</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                        Already registered? <Link to="/login" className="text-indigo-500 hover:text-indigo-600 transition-colors">Sign In</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPage;
