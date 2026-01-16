import React, { useState, useEffect } from 'react';
import { Course, Section } from '../types';
import { Users, Search, Filter, Layers, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseService } from '../supabaseService';

interface Props {
    courses: Course[];
    section: Section;
    batchId: string;
    userSubSection?: string;
}

const GroupRegisterView: React.FC<Props> = ({ courses, section, batchId, userSubSection }) => {
    const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || '');
    const [searchQuery, setSearchQuery] = useState('');
    const [groups, setGroups] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        if (selectedCourseId) {
            loadGroups(selectedCourseId);
        }
    }, [selectedCourseId, section]);

    const loadGroups = async (courseId: string) => {
        setIsLoading(true);
        try {
            const data = await supabaseService.fetchGroups(batchId, courseId, section);
            setGroups(data);
        } finally {
            setIsLoading(false);
        }
    };

    const activeCourse = courses.find(c => c.id === selectedCourseId);

    const filteredGroups = groups.filter(group =>
        group.group_members?.some((m: any) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.student_id.includes(searchQuery)
        )
    );

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 lg:p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-800/20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                        <Users size={24} />
                    </div>
                    <div>
                        <h2 className="text-base lg:text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Group Register</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">View classmates and lab groups</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[11px] font-bold uppercase outline-none focus:border-indigo-500 transition-all"
                        />
                    </div>
                    <select
                        value={selectedCourseId}
                        onChange={e => setSelectedCourseId(e.target.value)}
                        className="px-5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[11px] font-bold uppercase outline-none focus:border-indigo-500 cursor-pointer"
                    >
                        {courses.map(c => (
                            <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-8">
                <div className="max-w-6xl mx-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Loading student list...</p>
                        </div>
                    ) : filteredGroups.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-300 mb-4">
                                <Filter size={32} />
                            </div>
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching groups found</h3>
                            <p className="text-[9px] font-medium text-slate-400 mt-1 uppercase italic">Try adjusting your search query or selected course</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGroups.map((group) => {
                                const isExpanded = expandedId === group.id;
                                return (
                                    <motion.div
                                        layout
                                        key={group.id}
                                        onClick={() => setExpandedId(isExpanded ? null : group.id)}
                                        className={`p-6 rounded-[2rem] transition-all cursor-pointer group border-b-4 ${isExpanded
                                            ? 'bg-indigo-600 border-indigo-500 shadow-2xl text-white'
                                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl border-b-transparent hover:border-b-indigo-500'
                                            }`}
                                    >
                                        <div className={`flex items-center justify-between mb-4 pb-3 border-b ${isExpanded ? 'border-white/10' : 'border-slate-50 dark:border-slate-800'}`}>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isExpanded ? 'bg-white/20 text-white' : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600'}`}>
                                                    <Layers size={14} />
                                                </div>
                                                <span className={`text-sm font-bold uppercase tracking-tight ${isExpanded ? 'text-white' : 'text-slate-800 dark:text-white'}`}>Group {group.group_number}</span>
                                            </div>
                                            <span className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest ${isExpanded ? 'bg-white/10 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>SUB {group.sub_section}</span>
                                        </div>

                                        <div className="space-y-3">
                                            {group.group_members?.map((member: any) => (
                                                <div key={member.id} className={`flex items-center justify-between gap-4 p-2 rounded-xl transition-colors ${isExpanded ? 'hover:bg-white/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className={`w-2 h-2 rounded-full transition-colors flex-shrink-0 ${isExpanded ? 'bg-indigo-300' : 'bg-slate-200 dark:bg-slate-700 group-hover:bg-indigo-400'}`} />
                                                        <span className={`text-[11px] font-black uppercase truncate ${isExpanded ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                                                            {member.name}
                                                        </span>
                                                    </div>
                                                    <span className={`text-[9px] font-bold font-mono tracking-tighter flex-shrink-0 ${isExpanded ? 'text-indigo-200' : 'text-slate-400'}`}>
                                                        {member.student_id}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-6 pt-4 border-t border-white/10"
                                                >
                                                    <p className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest leading-loose">
                                                        This group is assigned to Section {group.sub_section[0]} - Sub Group {group.sub_section}. All members are authenticated for collaborative labs.
                                                    </p>
                                                    {userSubSection && group.sub_section === userSubSection && (
                                                        <div className="mt-4 flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">My Identified Lab Group</span>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {!isExpanded && userSubSection && group.sub_section === userSubSection && (
                                            <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">My Lab Group</span>
                                            </div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Info */}
            <div className="p-6 bg-slate-50/50 dark:bg-slate-800/10 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <GraduationCap size={14} className="text-slate-400" />
                        <span className="text-[9px] font-black text-slate-400 uppercase">{activeCourse?.code} • {activeCourse?.credit} CREDITS</span>
                    </div>
                </div>
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Student List • DIU Academic Hub</p>
            </div>
        </div>
    );
};

export default GroupRegisterView;
