import React, { useState } from 'react';
import { Course, AcademicRecord, EntryType, Section } from '../types';
import {
  BookOpen,
  Calendar,
  FileText,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Search,
  Filter,
  Layers,
  Link as LinkIcon,
  MapPin
} from 'lucide-react';
import { ENTRY_TYPE_COLORS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseService } from '../supabaseService';

interface Props {
  courses: Course[];
  records: AcademicRecord[];
  section: Section;
  batchId: string;
  userSubSection?: string;
}

const CourseView: React.FC<Props> = ({ courses, records, section, batchId, userSubSection }) => {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredCourses = courses.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCourse = courses.find(c => c.id === activeCourseId);
  const courseRecords = records.filter(r => r.course_id === activeCourseId && r.section === section);

  // Split records into Timeline Categories
  const evaluations = courseRecords.filter(r =>
    [EntryType.CT, EntryType.MID, EntryType.FINAL, EntryType.ASSIGNMENT, EntryType.PROJECT_REPORT].includes(r.type as EntryType)
  ).sort((a, b) => b.date.localeCompare(a.date));

  const lectureRegistry = courseRecords.filter(r =>
    [EntryType.EXTRA_CLASS, EntryType.MATERIAL, EntryType.LAB_REPORT].includes(r.type as EntryType)
  ).sort((a, b) => b.date.localeCompare(a.date));

  const [courseGroups, setCourseGroups] = useState<any[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [groupSearchQuery, setGroupSearchQuery] = useState('');

  React.useEffect(() => {
    if (activeCourseId) {
      setIsLoadingGroups(true);
      supabaseService.fetchGroups(batchId, activeCourseId, section).then(data => {
        setCourseGroups(data);
        setIsLoadingGroups(false);
      });
    }
  }, [activeCourseId, section]);

  const filteredGroups = courseGroups.filter(g =>
    g.group_members.some((m: any) =>
      m.name.toLowerCase().includes(groupSearchQuery.toLowerCase()) ||
      m.student_id.toLowerCase().includes(groupSearchQuery.toLowerCase())
    )
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)] overflow-hidden">
      {/* Sidebar: Course Index (Compact & Data Dense) */}
      <div className="w-full lg:w-80 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Course</h3>
            <span className="text-[9px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-lg">{courses.length} TOTAL</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-bold outline-none focus:border-indigo-500 dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {filteredCourses.map(course => (
            <button
              key={course.id}
              onClick={() => setActiveCourseId(course.id)}
              className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3 border ${activeCourseId === course.id
                ? 'bg-indigo-600 border-indigo-600 shadow-lg text-white'
                : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${activeCourseId === course.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'
                }`}>
                {course.code.split(' ')[1] || '000'}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[10px] font-bold uppercase tracking-tight truncate ${activeCourseId === course.id ? 'text-indigo-100' : 'text-slate-400'}`}>{course.code}</p>
                <h4 className="text-xs font-bold truncate leading-tight">{course.name}</h4>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Panel: Detailed Timeline */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm">
        <AnimatePresence mode="wait">
          {!activeCourseId ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 p-12 text-center"
            >
              <div className="w-16 h-16 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center mb-6">
                <Layers size={32} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-widest mb-2">Select a course</h4>
              <p className="text-[10px] font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">Choose a course to view materials and exams.</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeCourseId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h2 className="text-base lg:text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">{activeCourse?.name}</h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{activeCourse?.code} • {activeCourse?.teacher} • {activeCourse?.credit} Credits</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    {courseRecords.length} Records
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                  {/* Left Half: Evaluations */}
                  <div className="p-6 lg:p-8 border-r border-slate-100 dark:border-slate-800 space-y-6">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={14} className="text-indigo-600" /> Exams & Tasks
                    </h3>

                    <div className="space-y-4">
                      {evaluations.length === 0 ? (
                        <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase italic">No tasks indexed</p>
                      ) : (
                        evaluations.map(task => {
                          const isExpanded = expandedId === task.id;
                          return (
                            <motion.div
                              layout
                              key={task.id}
                              onClick={() => setExpandedId(isExpanded ? null : task.id)}
                              className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800 pb-2 cursor-pointer group"
                            >
                              <div className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full transition-colors ${isExpanded ? 'bg-indigo-600 scale-125' : 'bg-slate-300 dark:bg-slate-700'}`} />
                              <div className={`p-4 rounded-2xl border transition-all ${isExpanded
                                ? 'bg-indigo-600 border-indigo-500 shadow-lg text-white'
                                : 'bg-slate-50 dark:bg-slate-800/30 border-transparent hover:border-indigo-100 dark:hover:border-indigo-800'
                                }`}>
                                <div className="flex justify-between items-start mb-2">
                                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${isExpanded ? 'bg-white/20 text-white' : (ENTRY_TYPE_COLORS[task.type as EntryType] || 'bg-slate-100 text-slate-500')
                                    }`}>
                                    {task.type}
                                  </span>
                                  <span className={`text-[9px] font-black uppercase ${isExpanded ? 'text-indigo-100' : 'text-slate-400'}`}>{task.date} {task.sub_section ? `[${section}${task.sub_section}]` : ''}</span>
                                </div>
                                <h4 className={`text-xs font-black uppercase tracking-tight leading-tight ${isExpanded ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{task.title}</h4>

                                <AnimatePresence>
                                  {isExpanded && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="pt-3"
                                    >
                                      {task.topics && (
                                        <p className={`text-[10px] font-medium leading-relaxed mb-4 ${isExpanded ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>{task.topics}</p>
                                      )}

                                      <div className="flex gap-2">
                                        {task.link && (
                                          <a href={task.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[8px] font-black uppercase text-center border border-white/10 transition-colors flex items-center justify-center gap-1.5 text-white">
                                            Resource <ExternalLink size={10} />
                                          </a>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Right Half: Materials & Logs */}
                  <div className="p-6 lg:p-8 space-y-6 bg-slate-50/5">
                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <FileText size={14} className="text-emerald-500" /> Materials & Files
                    </h3>

                    <div className="space-y-4">
                      {lectureRegistry.length === 0 ? (
                        <p className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase italic">Registry empty</p>
                      ) : (
                        lectureRegistry.map(item => {
                          const isExpanded = expandedId === item.id;
                          return (
                            <motion.div
                              layout
                              key={item.id}
                              onClick={() => setExpandedId(isExpanded ? null : item.id)}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col ${isExpanded
                                ? 'bg-emerald-600 border-emerald-500 shadow-lg text-white'
                                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm hover:border-emerald-500/30'
                                }`}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <span className={`text-[8px] font-black uppercase ${isExpanded ? 'text-emerald-100' : 'text-slate-400'}`}>{item.date} {item.sub_section ? `[${section}${item.sub_section}]` : ''}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase ${isExpanded ? 'bg-white/20 text-white' : (ENTRY_TYPE_COLORS[item.type as EntryType] || 'bg-slate-100 text-slate-500')
                                  }`}>
                                  {item.type}
                                </span>
                              </div>
                              <h4 className={`text-xs font-black uppercase leading-tight ${isExpanded ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{item.title}</h4>
                              {item.sub_section && !isExpanded && (
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50" />
                              )}

                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="pt-4 mt-4 border-t border-white/10 space-y-4"
                                  >
                                    {item.topics && (
                                      <p className={`text-[10px] font-medium leading-relaxed ${isExpanded ? 'text-emerald-50' : 'text-slate-400'}`}>{item.topics}</p>
                                    )}

                                    <div className="flex gap-2">
                                      {item.link && (
                                        <a href={item.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[8px] font-black uppercase text-center border border-white/10 transition-colors flex items-center justify-center gap-1.5 text-white">
                                          Materials <ExternalLink size={10} />
                                        </a>
                                      )}
                                      {item.link_two && (
                                        <a href={item.link_two} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[8px] font-black uppercase text-center border border-white/10 transition-colors flex items-center justify-center gap-1.5 text-white">
                                          Archive <ExternalLink size={10} />
                                        </a>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CourseView;
