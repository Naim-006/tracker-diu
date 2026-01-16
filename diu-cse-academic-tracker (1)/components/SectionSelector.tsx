import React, { useState } from 'react';
import { Section, Batch } from '../types';
import { SECTIONS } from '../constants';
import { Sparkles, ArrowRight, Code2, Layers, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  batches: Batch[];
  onSelect: (batchId: string, section: Section, subSection?: string) => void;
}

const SectionSelector: React.FC<Props> = ({ batches, onSelect }) => {
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50 dark:bg-[#020617] relative overflow-hidden transition-colors duration-500">
      {/* Background Mesh Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-600/5 blur-[120px] rounded-full" />

      <div className="max-w-6xl w-full text-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-10 inline-flex items-center justify-center w-28 h-28 rounded-[3rem] bg-indigo-600 text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)] ring-8 ring-indigo-50 dark:ring-indigo-950/30"
        >
          <Sparkles size={48} />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter"
        >
          CSE <span className="text-indigo-600 dark:text-indigo-400">Tracker</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 dark:text-slate-400 mb-16 text-xl font-medium max-w-2xl mx-auto leading-relaxed"
        >
          {selectedBatchId
            ? "Now select your section and group to access personalized lecture logs."
            : "Select your batch to get started with the department's academic sync."}
        </motion.p>

        <AnimatePresence mode="wait">
          {!selectedBatchId ? (
            <motion.div
              key="batch-select"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            >
              {batches.length === 0 ? (
                <div className="col-span-full py-20 bg-white/50 dark:bg-slate-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No batches found. Check database connection.</p>
                </div>
              ) : (
                batches.map((batch) => (
                  <motion.div
                    key={batch.id}
                    variants={itemVariants}
                    onMouseEnter={() => setHoveredItem(batch.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => setSelectedBatchId(batch.id)}
                    className="group cursor-pointer relative"
                  >
                    <div className={`p-10 transition-all duration-500 text-center relative overflow-hidden rounded-[3rem] h-full flex flex-col items-center justify-center ${hoveredItem === batch.id
                      ? 'bg-indigo-600 border-indigo-500 shadow-2xl scale-[1.05] z-10 text-white'
                      : 'glass-pro border-transparent hover:border-indigo-500/30 text-slate-800 dark:text-white'
                      }`}>
                      <Layers size={32} className={`mb-4 transition-colors ${hoveredItem === batch.id ? 'text-white' : 'text-indigo-500'}`} />
                      <span className="text-3xl font-black mb-2">{batch.name}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${hoveredItem === batch.id ? 'text-white/60' : 'text-slate-400'}`}>Department View</span>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="section-select"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              <div className="flex justify-center">
                <button
                  onClick={() => setSelectedBatchId(null)}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-all"
                >
                  <ChevronLeft size={16} /> Back to Batches
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
                {SECTIONS.map((section, idx) => (
                  <motion.div
                    key={section}
                    variants={itemVariants}
                    onMouseEnter={() => setHoveredItem(section)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="group relative"
                  >
                    <div
                      className={`p-10 transition-all duration-500 text-center relative overflow-hidden rounded-[3rem] ${hoveredItem === section
                        ? 'bg-indigo-600 border-indigo-500 shadow-2xl scale-[1.05] z-10 text-white'
                        : 'glass-pro border-transparent hover:border-indigo-500/30'
                        }`}
                    >
                      <div className="relative z-10">
                        <span className={`block text-5xl font-black transition-colors mb-2 leading-none ${hoveredItem === section ? 'text-white' : 'text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>
                          {section}
                        </span>

                        <AnimatePresence>
                          {hoveredItem === section ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex flex-col gap-2 mt-4" >
                              <button onClick={() => onSelect(selectedBatchId, section)} className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10" > Whole Section </button>
                              <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => onSelect(selectedBatchId, section, '1')} className="py-2 px-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/10" > {section}1 </button>
                                <button onClick={() => onSelect(selectedBatchId, section, '2')} className="py-2 px-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/10" > {section}2 </button>
                              </div>
                            </motion.div>
                          ) : (
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">
                              Batch {batches.find(b => b.id === selectedBatchId)?.name}
                            </span>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <Code2 size={100} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-20 flex flex-col items-center gap-4">
          <div className="h-px w-24 bg-slate-200 dark:bg-slate-800" />
          <p className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">
            CSE Dept. Academic Sync System • v3.0
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SectionSelector;
