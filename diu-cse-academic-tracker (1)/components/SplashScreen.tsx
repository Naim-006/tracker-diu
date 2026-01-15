
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Code2 } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const SplashScreen: React.FC<Props> = ({ onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 2.8, duration: 0.8, ease: "easeInOut" }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 z-[1000] bg-[#020617] flex flex-col items-center justify-center overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative mb-10"
      >
        <div className="w-28 h-28 bg-indigo-600 rounded-[3rem] flex items-center justify-center text-white shadow-[0_0_50px_rgba(79,70,229,0.4)]">
          <Sparkles size={52} className="animate-pulse" />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 border-2 border-indigo-500/20 border-t-indigo-500 rounded-[3.5rem]"
        />
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-center"
      >
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
          CSE <span className="text-indigo-500">TRACKER</span>
        </h1>
        <div className="flex items-center justify-center gap-2 text-indigo-400 font-bold text-[10px] tracking-[0.4em] uppercase">
          <Code2 size={12} />
          Academic Sync System
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-12 text-[10px] font-black text-slate-600 tracking-[0.2em] uppercase"
      >
        Version 2.5.0 Stable • Secure Build
      </motion.div>

      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />
    </motion.div>
  );
};

export default SplashScreen;
