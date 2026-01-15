import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AcademicRecord, EntryType } from '../types';
import {
    X,
    Clock,
    MapPin,
    FileText,
    Link as LinkIcon,
    ExternalLink,
    Calendar,
    Layers,
    Activity,
    User
} from 'lucide-react';
import { ENTRY_TYPE_COLORS } from '../constants';
import { format, parseISO } from 'date-fns';

interface Props {
    record: AcademicRecord | null;
    isOpen: boolean;
    onClose: () => void;
}

const QuickPreviewModal: React.FC<Props> = ({ record, isOpen, onClose }) => {
    if (!record) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="bg-white dark:bg-[#0b0f1a] w-full max-w-xl rounded-[2.5rem] shadow-pro relative z-10 overflow-hidden border border-slate-200 dark:border-slate-800/60"
                    >
                        {/* Header / Type Badge */}
                        <div className="p-8 pb-4">
                            <div className="flex justify-between items-start mb-6">
                                <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${ENTRY_TYPE_COLORS[record.type as EntryType] || 'bg-slate-100 text-slate-500'}`}>
                                    {record.type}
                                </span>
                                <button
                                    onClick={onClose}
                                    className="p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-rose-500 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight uppercase tracking-tighter">
                                {record.title}
                            </h2>

                            <div className="flex flex-wrap gap-4 mt-6">
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <Calendar size={14} className="text-indigo-600" />
                                    <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase">
                                        {format(parseISO(record.date), 'EEEE, MMM dd')}
                                    </span>
                                </div>
                                {record.time && (
                                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <Clock size={14} className="text-emerald-500" />
                                        <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase">{record.time}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-8 pt-4 space-y-8">
                            {record.topics && (
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Activity size={12} className="text-indigo-600" /> Topics Covered
                                    </h3>
                                    <div className="p-6 bg-slate-50 dark:bg-slate-900/30 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed uppercase tracking-tight">
                                            {record.topics}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin size={12} className="text-rose-500" /> Room / Venue
                                    </h3>
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">{record.room || 'Remote / TBA'}</p>
                                </div>

                                {record.sub_section && (
                                    <div className="space-y-3">
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Layers size={12} className="text-emerald-500" /> Lab Group
                                        </h3>
                                        <p className="text-sm font-bold text-emerald-500 uppercase tracking-tight">Group {record.sub_section}</p>
                                    </div>
                                )}
                            </div>

                            {/* Resource Bridge */}
                            {(record.link || record.link_two) && (
                                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Materials & Links</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {record.link && (
                                            <a href={record.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <LinkIcon size={16} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700 dark:text-indigo-400 group-hover:text-white">Lectures</span>
                                                </div>
                                                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        )}
                                        {record.link_two && (
                                            <a href={record.link_two} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl hover:bg-emerald-500 hover:text-white transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <FileText size={16} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 group-hover:text-white">Materials</span>
                                                </div>
                                                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-950/40 rounded-xl flex items-center justify-center text-indigo-600">
                                    <User size={14} />
                                </div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Record Details</span>
                            </div>
                            <p className="text-[8px] font-black text-slate-300 dark:text-slate-700 uppercase">DIU Academic Track v2.0</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default QuickPreviewModal;
