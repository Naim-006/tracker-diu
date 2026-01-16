import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { supabaseService } from '../supabaseService';
import { LogOut, Clock, RefreshCw, ShieldAlert } from 'lucide-react';

const PendingApprovalPage: React.FC = () => {
    const { profile, refreshProfile } = useAuth();
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const navigate = useNavigate();

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshProfile();
        setIsRefreshing(false);
    };

    const handleLogout = async () => {
        await supabaseService.signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden p-6">
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-amber-600/20 rounded-full blur-[120px]" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[540px] relative z-10 text-center">
                <div className="bg-white dark:bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 lg:p-14 shadow-2xl">
                    <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <Clock className="text-amber-500" size={40} />
                    </div>

                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase italic">Access Pending</h2>

                    <div className="space-y-4 text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed px-4">
                        <p>Hi <span className="text-amber-500 font-bold">{profile?.full_name || 'Representative'}</span>,</p>
                        <p>Your Class Representative account is currently in the **verification queue**.</p>
                        <p className="text-sm">For security reasons, all CR accounts must be manually verified by the administrator to prevent unauthorized access.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="w-full py-5 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            <RefreshCw className={isRefreshing ? 'animate-spin' : ''} size={18} />
                            <span className="uppercase tracking-widest text-xs">Verify My Status</span>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="w-full py-5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                        >
                            <LogOut size={18} />
                            <span className="uppercase tracking-widest text-xs">Sign Out</span>
                        </button>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">Urgent Access Required?</p>
                        <div className="flex items-center justify-center gap-4">
                            <a href="mailto:admin@diu.edu.bd" className="flex items-center gap-2 text-indigo-500 hover:text-indigo-400 transition-colors text-xs font-bold px-4 py-2 bg-indigo-500/10 rounded-full">
                                <ShieldAlert size={14} /> Contact Admin
                            </a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default PendingApprovalPage;
