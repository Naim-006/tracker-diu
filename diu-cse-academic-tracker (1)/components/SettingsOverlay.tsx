
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Github, Linkedin, Star, ShieldAlert, Heart, 
  ChevronRight, Globe, Info, Coffee
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdminClick: () => void;
}

const SettingsOverlay: React.FC<Props> = ({ isOpen, onClose, onAdminClick }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-end p-4 sm:p-8 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#020617]/40 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ x: 100, opacity: 0, scale: 0.95 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: 100, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-100 dark:border-slate-800"
      >
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white leading-none">Settings Hub</h2>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Control Center</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
          {/* Admin Gateway */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] px-2">Management</h3>
            <button 
              onClick={onAdminClick}
              className="w-full flex items-center gap-4 p-5 bg-indigo-50 dark:bg-indigo-950/20 rounded-3xl border border-indigo-100/50 dark:border-indigo-900/30 hover:bg-indigo-600 hover:text-white transition-all group"
            >
              <div className="w-12 h-12 bg-white dark:bg-indigo-900 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-90 transition-transform shadow-sm">
                 <ShieldAlert size={20} />
              </div>
              <div className="text-left">
                <p className="font-black text-sm uppercase tracking-tight">Admin Gateway</p>
                <p className="text-[10px] opacity-60 font-medium">Verify as Class Representative</p>
              </div>
              <ChevronRight className="ml-auto opacity-40" size={16} />
            </button>
          </section>

          {/* Development Team */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] px-2">Engineering Team</h3>
            <div className="p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-16 h-16 rounded-3xl overflow-hidden bg-indigo-100 dark:bg-indigo-900 shadow-lg border-4 border-white dark:border-slate-700">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=diu-cse" alt="Dev" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 dark:text-white text-lg">DIU Tech Commitee</h4>
                  <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">Lead Engineering</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">
                Institutional architecture designed by the CSE Student body. Focused on digital productivity.
              </p>
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                  <Github size={16} /> <span className="text-[10px] font-black uppercase">Source</span>
                </button>
                <button className="flex-1 py-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                  <Linkedin size={16} /> <span className="text-[10px] font-black uppercase">Connect</span>
                </button>
              </div>
            </div>
          </section>

          {/* Statistics & Rating */}
          <section className="text-center space-y-6">
            <div className="p-6 bg-amber-50 dark:bg-amber-950/20 rounded-[2.5rem] border border-amber-100 dark:border-amber-900/30">
                <h3 className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.3em] mb-4">Ecosystem Experience</h3>
                <div className="flex justify-center gap-3 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-90 hover:scale-110"
                    >
                      <Star 
                        size={32} 
                        className={`transition-colors duration-300 ${
                          (hoveredRating || rating) >= star 
                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
                            : 'text-slate-200 dark:text-slate-800'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center">
                  Your feedback improves the tracker
                </p>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-slate-400 dark:text-slate-500 font-black text-[9px] uppercase tracking-[0.2em]">
                <div className="flex items-center gap-1"><Info size={12} /> Support</div>
                <div className="flex items-center gap-1"><Globe size={12} /> University</div>
                <div className="flex items-center gap-1"><Coffee size={12} /> Sponsors</div>
            </div>
          </section>
        </div>

        <div className="p-8 bg-slate-50 dark:bg-[#020617] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest">
            <Heart size={14} fill="currentColor" /> DIU CSE DEPT.
          </div>
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500">v2.5.0-STABLE</span>
        </div>
      </motion.div>
    </div>
  );
};

export default SettingsOverlay;
