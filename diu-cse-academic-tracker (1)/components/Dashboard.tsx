import React from 'react';
import { AcademicRecord, Course, EntryType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal,
  Activity,
  Layers,
  Clock,
  MapPin,
  ChevronRight,
  Calendar as CalIcon,
  BookOpen,
  AlertCircle,
  Zap,
  CheckCircle2,
  Filter,
  Users,
  ExternalLink
} from 'lucide-react';
import QuickPreviewModal from './QuickPreviewModal';
import { ENTRY_TYPE_COLORS } from '../constants';
import { format, isToday, isFuture, parseISO } from 'date-fns';

interface Props {
  records: AcademicRecord[];
  courses: Course[];
  onAction: (tab: any) => void;
  userProfile?: { sub_section?: string; section: string };
}

const Dashboard: React.FC<Props> = ({ records, courses, onAction, userProfile }) => {
  const [selectedRecord, setSelectedRecord] = React.useState<AcademicRecord | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const todayRecords = records.filter(r => isToday(parseISO(r.date)));
  const generalRecords = todayRecords.filter(r => !r.sub_section);
  const groupRecords = todayRecords.filter(r => r.sub_section === userProfile?.sub_section);

  const upcomingExams = records.filter(r =>
    [EntryType.CT, EntryType.MID, EntryType.FINAL].includes(r.type) &&
    isFuture(parseISO(r.date))
  ).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);

  const totalCredits = courses.reduce((acc, c) => acc + (c.credit || 0), 0);

  return (
    <div className="space-y-8 pb-20">
      <QuickPreviewModal
        record={selectedRecord}
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      {/* Modern High-Density Status Bar */}
      <div className="bg-white dark:bg-[#0b0f1a] border border-slate-200 dark:border-slate-800/60 rounded-[3rem] p-4 lg:p-6 flex flex-col md:flex-row items-center justify-between shadow-pro relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none" />

        <div className="flex flex-wrap items-center gap-6 lg:gap-10">
          <div className="flex items-center gap-4 pr-6 border-r border-slate-100 dark:border-slate-800/60">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg active-glow">
              <Activity size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Today's Schedule</p>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{todayRecords.length} Activities Today</h2>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pr-6 border-r border-slate-100 dark:border-slate-800/60">
            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-500/20">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Group</p>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">{userProfile?.sub_section ? `${userProfile.section}${userProfile.sub_section}` : 'General'}</h2>
            </div>
          </div>

          <div className="hidden lg:block">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Info</p>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase">Section {userProfile?.section}</span>
              <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">{totalCredits} Credits</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 md:mt-0">
          <button onClick={() => onAction('calendar')} className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95">Calendar</button>
          <button onClick={() => onAction('courses')} className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:border-indigo-500 transition-all">All Courses</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Grid: The Feed Architecture */}
        <div className="lg:col-span-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Primary Signal Feed */}
            <div className="bg-white dark:bg-[#0b0f1a] border border-slate-200 dark:border-slate-800/60 rounded-[2.5rem] p-8 shadow-pro relative overflow-hidden group/card">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover/card:opacity-10 transition-opacity">
                <Terminal size={80} className="text-slate-400" />
              </div>

              <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-50 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                    <Activity size={16} />
                  </div>
                  <h3 className="text-[11px] font-bold text-slate-900 dark:text-white tracking-widest uppercase">Theory Classes</h3>
                </div>
                <div className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 rounded text-[9px] font-bold">{generalRecords.length} TODAY</div>
              </div>

              <div className="space-y-4">
                {generalRecords.length === 0 ? (
                  <div className="py-16 text-center">
                    <CheckCircle2 size={32} className="mx-auto text-emerald-500/20 mb-4" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No activities today.</p>
                  </div>
                ) : (
                  generalRecords.map(record => {
                    const isExpanded = expandedId === record.id;
                    return (
                      <motion.div
                        layout
                        key={record.id}
                        whileHover={!isExpanded ? { scale: 1.01, y: -2 } : {}}
                        onClick={() => setExpandedId(isExpanded ? null : record.id)}
                        className={`p-5 rounded-[2rem] transition-all cursor-pointer group relative overflow-hidden border ${isExpanded
                          ? 'bg-indigo-600 border-indigo-500 shadow-xl z-10 text-white'
                          : 'glass-pro border-transparent hover:border-indigo-500/30'
                          }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider ${isExpanded ? 'bg-white/20 text-white' : (ENTRY_TYPE_COLORS[record.type] || 'bg-slate-100 text-slate-500')
                            }`}>
                            {record.type}
                          </span>
                          <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase ${isExpanded ? 'text-indigo-100' : 'text-slate-400'}`}>
                            <Clock size={12} className={isExpanded ? 'text-white' : 'text-indigo-400'} /> {record.time || 'TBA'}
                          </div>
                        </div>

                        <h4 className={`text-[13px] font-black uppercase leading-tight mb-2 transition-colors ${isExpanded ? 'text-white' : 'text-slate-800 dark:text-white group-hover:text-indigo-600'
                          }`}>
                          {record.title}
                        </h4>

                        <AnimatePresence>
                          {isExpanded ? (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-4 border-t border-white/10 mt-4 space-y-4"
                            >
                              {record.topics && (
                                <p className="text-[10px] font-medium text-indigo-50 leading-relaxed uppercase">
                                  {record.topics}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-2 text-[9px] font-bold text-white/80 uppercase">
                                <div className="flex items-center gap-1.5"><MapPin size={10} /> {record.room || 'Remote'}</div>
                              </div>

                              <div className="flex gap-2 pt-2">
                                {record.link && (
                                  <a href={record.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[8px] font-black uppercase text-center border border-white/10 transition-colors flex items-center justify-center gap-1.5">
                                    Lectures <ExternalLink size={10} />
                                  </a>
                                )}
                                {record.link_two && (
                                  <a href={record.link_two} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[8px] font-black uppercase text-center border border-white/10 transition-colors flex items-center justify-center gap-1.5">
                                    Files <ExternalLink size={10} />
                                  </a>
                                )}
                                <button
                                  onClick={(e) => { e.stopPropagation(); setSelectedRecord(record); }}
                                  className="p-2 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors"
                                  title="Expand Full Modal"
                                >
                                  <Activity size={12} />
                                </button>
                              </div>
                            </motion.div>
                          ) : (
                            <p className="text-[9px] font-black text-slate-400 uppercase truncate flex items-center gap-1.5"><MapPin size={10} /> {record.room || 'Remote'}</p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Specialized Group Node */}
            <div className="bg-[#020617] border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group/group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-transparent pointer-events-none" />

              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                    <Layers size={16} />
                  </div>
                  <h3 className="text-[11px] font-bold text-white uppercase tracking-widest">Lab Classes</h3>
                </div>
                <div className="px-2 py-0.5 bg-emerald-500 text-white rounded text-[9px] font-black uppercase shadow-lg shadow-emerald-500/20">{userProfile?.section}{userProfile?.sub_section || '?'}</div>
              </div>

              <div className="space-y-4">
                {groupRecords.length === 0 ? (
                  <div className="py-16 text-center border-2 border-dashed border-slate-800/50 rounded-3xl">
                    <Filter size={32} className="mx-auto text-slate-800 mb-4" />
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No labs today.</p>
                  </div>
                ) : (
                  groupRecords.map(record => {
                    const isExpanded = expandedId === record.id;
                    return (
                      <motion.div
                        layout
                        key={record.id}
                        whileHover={!isExpanded ? { scale: 1.01, y: -2 } : {}}
                        onClick={() => setExpandedId(isExpanded ? null : record.id)}
                        className={`p-5 rounded-[2rem] transition-all cursor-pointer group relative overflow-hidden border ${isExpanded
                          ? 'bg-emerald-600 border-emerald-500 shadow-xl z-20 text-white'
                          : 'bg-slate-900/50 border-slate-800 hover:border-emerald-500/30'
                          }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider ${isExpanded ? 'bg-white/20 text-white' : 'bg-emerald-500 text-white shadow-sm'
                            }`}>LAB REPT</span>
                          <div className={`flex items-center gap-1.5 text-[9px] font-black uppercase ${isExpanded ? 'text-emerald-100' : 'text-emerald-500/80'}`}>
                            <Clock size={12} className={isExpanded ? 'text-white' : ''} /> {record.time || 'TBA'}
                          </div>
                        </div>
                        <h4 className={`text-[13px] font-bold uppercase leading-tight mb-2 transition-colors ${isExpanded ? 'text-white' : 'text-white group-hover:text-emerald-500'
                          }`}>{record.title}</h4>

                        <AnimatePresence>
                          {isExpanded ? (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-4 border-t border-white/10 mt-4 space-y-4"
                            >
                              {record.topics && (
                                <p className="text-[10px] font-medium text-emerald-50 leading-relaxed uppercase">
                                  {record.topics}
                                </p>
                              )}

                              <div className="flex flex-wrap gap-2 text-[9px] font-bold text-white/80 uppercase">
                                <div className="flex items-center gap-1.5"><MapPin size={10} /> {record.room || 'Room TBA'}</div>
                              </div>

                              <div className="flex gap-2 pt-2">
                                {record.link && (
                                  <a href={record.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[8px] font-black uppercase text-center border border-white/10 transition-colors flex items-center justify-center gap-1.5 text-white">
                                    Lectures <ExternalLink size={10} />
                                  </a>
                                )}
                                {record.link_two && (
                                  <a href={record.link_two} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[8px] font-black uppercase text-center border border-white/10 transition-colors flex items-center justify-center gap-1.5 text-white">
                                    Files <ExternalLink size={10} />
                                  </a>
                                )}
                              </div>
                            </motion.div>
                          ) : (
                            <p className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1.5"><MapPin size={10} className="text-slate-400" /> {record.room || 'Room TBA'}</p>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-800 text-center">
                <button onClick={() => onAction('groups')} className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-all flex items-center justify-center gap-2 mx-auto">
                  View full group list <ChevronRight size={12} />
                </button>
              </div>
            </div>

          </div>

          {/* Quick Registry Map */}
          <div className="bg-white dark:bg-[#0b0f1a] border border-slate-200 dark:border-slate-800/60 rounded-[3rem] p-8 shadow-pro">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50 dark:border-slate-800/60">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">My Lab Groups</h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Quick access to your group members</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-slate-900 text-white text-[9px] font-black rounded-lg uppercase">Synced</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {courses.filter(c => c.name.toLowerCase().includes('lab')).map(course => (
                <div key={course.id} className="bg-slate-50 dark:bg-slate-900/30 p-6 rounded-[2rem] border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/60 transition-all group">
                  <h4 className="text-[11px] font-bold text-slate-900 dark:text-white uppercase border-b border-white dark:border-slate-800 pb-3 mb-4 tracking-tight">{course.code} Group</h4>
                  <button
                    onClick={() => onAction('groups')}
                    className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[9px] font-bold uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                  >
                    View Members
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Console: Global Watchlist */}
        <div className="lg:col-span-4 h-full">
          <div className="bg-[#0b0f1a] border border-slate-800 rounded-[3rem] p-10 h-full shadow-2xl sticky top-8 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/10 blur-[80px] rounded-full" />

            <h3 className="text-[11px] font-bold text-white uppercase tracking-widest mb-10 flex items-center gap-3">
              <CalIcon size={18} className="text-indigo-500" /> Upcoming Exams
            </h3>

            <div className="space-y-6">
              {upcomingExams.length === 0 ? (
                <div className="py-24 text-center border border-dashed border-slate-800 rounded-3xl">
                  <CheckCircle2 size={40} className="mx-auto text-slate-800 mb-6" />
                  <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">No upcoming exams</p>
                </div>
              ) : (
                upcomingExams.map(exam => (
                  <div key={exam.id} onClick={() => setSelectedRecord(exam)} className="group cursor-pointer flex gap-5 items-center pb-6 border-b border-slate-800/60 last:border-0 last:pb-0">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all duration-500 shadow-xl group-hover:scale-110">
                      <span className="text-[9px] font-black text-slate-500 group-hover:text-indigo-200 uppercase">{format(parseISO(exam.date), 'MMM')}</span>
                      <span className="text-xl font-black text-white leading-none mt-0.5">{format(parseISO(exam.date), 'dd')}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13px] font-black text-slate-200 group-hover:text-white uppercase truncate tracking-tight mb-2 transition-colors">{exam.title}</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${ENTRY_TYPE_COLORS[exam.type] || 'bg-slate-100 text-slate-500'}`}>
                          {exam.type}
                        </span>
                        {exam.sub_section && <span className="text-[8px] font-black text-white uppercase tracking-widest px-2 py-0.5 bg-emerald-500 rounded shadow-sm shadow-emerald-500/30">{userProfile?.section}{exam.sub_section}</span>}
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-700 group-hover:text-white transition-all group-hover:translate-x-1" />
                  </div>
                ))
              )}
            </div>

            <div className="mt-12">
              <button onClick={() => onAction('calendar')} className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest shadow-xl transition-all hover:bg-indigo-700 active:scale-95">
                Open Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
