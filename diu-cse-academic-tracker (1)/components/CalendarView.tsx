import React, { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isFuture,
  isToday
} from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalIcon,
  MapPin,
  Clock,
  ExternalLink,
  Target,
  Hash,
  Search,
  Users
} from 'lucide-react';
import { AcademicRecord, EntryType, Course, Section } from '../types';
import { ENTRY_TYPE_COLORS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseService } from '../supabaseService';
import QuickPreviewModal from './QuickPreviewModal';

interface Props {
  records: AcademicRecord[];
  courses: Course[];
  section: Section;
  onDateClick: (date: Date) => void;
  userSubSection?: string;
}

const CalendarView: React.FC<Props> = ({ records, courses, section, onDateClick, userSubSection }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeSideTab, setActiveSideTab] = useState<'AGENDA' | 'GROUPS'>('AGENDA');
  const [selectedCourse, setSelectedCourse] = useState(courses[0]?.id || '');
  const [groupSync, setGroupSync] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [previewRecord, setPreviewRecord] = useState<AcademicRecord | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getDayRecords = (date: Date) => {
    return records.filter(r => isSameDay(parseISO(r.date), date));
  };

  const loadGroups = async (courseId: string) => {
    setIsLoadingGroups(true);
    try {
      const data = await supabaseService.fetchGroups(courseId, section);
      setGroupSync(data);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const filteredGroups = groupSync.filter(g =>
    g.group_members?.some((m: any) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.student_id.includes(searchQuery)
    )
  );

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden flex flex-col lg:flex-row shadow-2xl h-[calc(100vh-180px)]">
      {/* Precision Grid Overlay */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-5 lg:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <CalIcon size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">
                {format(currentDate, 'MMMM')} <span className="text-indigo-600">{format(currentDate, 'yyyy')}</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={goToToday} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Today</button>
            <div className="flex border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500"><ChevronLeft size={16} /></button>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 border-l border-slate-200 dark:border-slate-700"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/10">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-7 h-full">
            {calendarDays.map((day, idx) => {
              const dayRecords = getDayRecords(day);
              const isSelectedMonth = isSameMonth(day, monthStart);
              const isTodayDate = isToday(day);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[100px] lg:min-h-[140px] p-2 lg:p-4 border-r border-b border-slate-100 dark:border-slate-800 transition-all cursor-pointer flex flex-col group ${!isSelectedMonth ? 'bg-slate-50/10 dark:bg-slate-900/10 opacity-30 text-slate-400' : 'bg-white dark:bg-slate-900 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20'
                    } ${isSameDay(day, selectedDate) ? 'bg-indigo-50/50 dark:bg-indigo-900/30 ring-2 ring-inset ring-indigo-500/20' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-black w-8 h-8 flex items-center justify-center rounded-lg transition-all ${isSameDay(day, selectedDate)
                      ? 'bg-indigo-600 text-white shadow-indigo-200 shadow-lg'
                      : isTodayDate
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'text-slate-800 dark:text-slate-200 group-hover:text-indigo-600'
                      }`}>
                      {format(day, 'd')}
                    </span>
                    {dayRecords.length > 0 && (
                      <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.5 rounded uppercase">
                        {dayRecords.length} Signal
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-1 overflow-hidden">
                    {dayRecords.map(r => (
                      <div key={r.id} className={`px-2 py-1 rounded-md text-[8px] font-black uppercase truncate border border-transparent flex items-center gap-1.5 ${ENTRY_TYPE_COLORS[r.type] || 'bg-slate-100 text-slate-500'}`}>
                        <div className={`w-1 h-1 rounded-full ${(ENTRY_TYPE_COLORS[r.type] || 'bg-slate-400').split(' ')[0]}`} />
                        {r.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="w-full lg:w-[400px] border-l border-slate-200 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50 flex flex-col h-full">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button onClick={() => setActiveSideTab('AGENDA')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeSideTab === 'AGENDA' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Agenda</button>
            <button onClick={() => { setActiveSideTab('GROUPS'); if (selectedCourse) loadGroups(selectedCourse); }} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeSideTab === 'GROUPS' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-sm' : 'text-slate-400'}`}>Groups</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeSideTab === 'AGENDA' ? (
              <motion.div key="agenda" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <Target size={14} className="text-indigo-600" /> {isSameDay(selectedDate, new Date()) ? 'Upcoming Schedule' : format(selectedDate, 'MMMM dd, yyyy')}
                  </h3>
                  {selectedDate && !isSameDay(selectedDate, new Date()) && (
                    <button onClick={() => setSelectedDate(new Date())} className="text-[9px] font-bold text-indigo-600 uppercase border-b border-indigo-600/30">Reset to Today</button>
                  )}
                </div>

                <div className="space-y-4">
                  {(isSameDay(selectedDate, new Date())
                    ? records.filter(r => isFuture(parseISO(r.date)) || isToday(parseISO(r.date))).sort((a, b) => a.date.localeCompare(b.date))
                    : records.filter(r => isSameDay(parseISO(r.date), selectedDate))
                  ).length === 0 ? (
                    <div className="py-12 text-center opacity-50">
                      <p className="text-[10px] font-black uppercase tracking-widest">Nothing scheduled</p>
                    </div>
                  ) : (
                    (isSameDay(selectedDate, new Date())
                      ? records.filter(r => isFuture(parseISO(r.date)) || isToday(parseISO(r.date))).sort((a, b) => a.date.localeCompare(b.date))
                      : records.filter(r => isSameDay(parseISO(r.date), selectedDate))
                    ).map((record) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={record.id}
                        className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-600/30 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black ${ENTRY_TYPE_COLORS[record.type] || 'bg-slate-100 text-slate-500'}`}>
                            {record.type}
                          </span>
                          <span className="text-[8px] font-black text-slate-400 uppercase">{format(parseISO(record.date), 'MMM dd')}</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase leading-tight mb-3">{record.title}</h4>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
                            <Clock size={12} className="text-indigo-500/50" /> {record.time || 'TBA'}
                          </div>
                          <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400">
                            <MapPin size={12} className="text-rose-500/50" /> {record.room || 'Remote'}
                          </div>
                        </div>

                        {record.topics && (
                          <p className="text-[9px] font-medium text-slate-500 dark:text-slate-400 uppercase leading-relaxed border-t border-slate-50 dark:border-slate-700 pt-3 mb-4">
                            {record.topics}
                          </p>
                        )}

                        <div className="flex gap-2">
                          {(record.link || record.link_two) ? (
                            <>
                              {record.link && (
                                <a href={record.link} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 rounded-xl text-[8px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest text-center transition-all flex items-center justify-center gap-1.5 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800">
                                  Material <ExternalLink size={10} />
                                </a>
                              )}
                              {record.link_two && (
                                <a href={record.link_two} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 rounded-xl text-[8px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest text-center transition-all flex items-center justify-center gap-1.5 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800">
                                  Archive <ExternalLink size={10} />
                                </a>
                              )}
                            </>
                          ) : (
                            <button onClick={() => setPreviewRecord(record)} className="w-full py-2 bg-slate-50 dark:bg-slate-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 rounded-xl text-[8px] font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest text-center transition-all">Quick View</button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="groups" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-6 space-y-6">
                <div className="space-y-4">
                  <select
                    value={selectedCourse}
                    onChange={e => { setSelectedCourse(e.target.value); loadGroups(e.target.value); }}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-bold uppercase outline-none focus:border-indigo-500"
                  >
                    <option value="">Select Course...</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                  </select>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-bold uppercase outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {isLoadingGroups ? (
                    <p className="text-[10px] font-bold text-slate-400 uppercase italic animate-pulse">Loading...</p>
                  ) : filteredGroups.length === 0 ? (
                    <p className="text-[10px] font-bold text-slate-400 uppercase italic">No groups found.</p>
                  ) : (
                    filteredGroups.map(group => (
                      <div key={group.id} className="bg-white dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-50 dark:border-slate-700">
                          <span className="text-[10px] font-black text-indigo-600 uppercase">Group {group.group_number}</span>
                          <span className="text-[8px] font-black text-slate-400">SUB {group.sub_section}</span>
                        </div>
                        <div className="space-y-2">
                          {group.group_members?.map((m: any) => (
                            <div key={m.id} className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-slate-700 dark:text-slate-200 uppercase truncate max-w-[140px]">{m.name}</span>
                              <span className="text-[8px] font-black text-slate-400">{m.student_id}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
