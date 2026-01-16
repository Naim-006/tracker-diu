
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const VerifyEmailPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#020617] relative overflow-hidden p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[480px] relative z-10 text-center">
                <div className="bg-white dark:bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 lg:p-14 shadow-2xl">
                    <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">CHECK YOUR EMAIL</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                        A verification link has been sent to your institutional email. Please verify your account to continue.
                    </p>

                    <Link to="/login" className="flex items-center justify-center gap-3 w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 uppercase tracking-[0.2em] text-xs">
                        Return to Login <ArrowRight size={18} />
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default VerifyEmailPage;
