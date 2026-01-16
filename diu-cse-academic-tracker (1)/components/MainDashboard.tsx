import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Calendar as CalendarIcon,
    BookMarked,
    Users,
    ShieldCheck,
    UserCircle,
    Moon,
    Sun,
    LogOut,
    Bell,
    Inbox,
    CogIcon,
    Zap,
    ArrowLeftRight
} from 'lucide-react';
import { Section, AcademicRecord, Theme, AppNotification, Course } from '../types';
import Dashboard from './Dashboard';
import CalendarView from './CalendarView';
import CourseView from './CourseView';
import GroupRegisterView from './GroupRegisterView';
import AdminPanel from './AdminPanel';
import SettingsOverlay from './SettingsOverlay';
import { SECTIONS } from '../constants';
import { supabaseService, supabase } from '../supabaseService';
import { useAuth } from '../AuthContext';

interface Props {
    selectedBatch: string | null;
    setSelectedBatch: (b: string | null) => void;
    selectedSection: Section | null;
    setSelectedSection: (s: Section | null) => void;
    selectedSubSection: string | null;
    setSelectedSubSection: (s: string | null) => void;
    courses: Course[];
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
    records: AcademicRecord[];
    setRecords: (r: AcademicRecord[]) => void;
    theme: Theme;
    toggleTheme: () => void;
    handleLogout: () => void;
    notifications: AppNotification[];
    initialTab?: 'dashboard' | 'calendar' | 'courses' | 'groups' | 'admin';
}

const MainDashboard: React.FC<Props> = ({
    selectedBatch,
    setSelectedBatch,
    selectedSection,
    setSelectedSection,
    selectedSubSection,
    setSelectedSubSection,
    courses,
    setCourses,
    records,
    setRecords,
    theme,
    toggleTheme,
    handleLogout,
    notifications,
    initialTab = 'dashboard'
}) => {
    const { profile: userProfile } = useAuth();
    const [activeTab, setActiveTab] = useState(initialTab);
    const [showNotifications, setShowNotifications] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSectionSwitcherOpen, setIsSectionSwitcherOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    // Sync tab to localStorage
    const handleTabChange = (tab: any) => {
        setActiveTab(tab);
        if (tab !== 'admin') {
            localStorage.setItem('activeTab', tab);
        }
    };

    const navItems = [
        { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'Overview' },
        { id: 'calendar', icon: <CalendarIcon size={20} />, label: 'Schedule' },
        { id: 'courses', icon: <BookMarked size={20} />, label: 'Materials' },
        { id: 'groups', icon: <Users size={20} />, label: 'Groups' },
    ];

    const canAccessAdmin = userProfile?.role === 'CR' && userProfile?.is_approved;

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-[#020617] transition-colors duration-500 relative">
            <SettingsOverlay
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                onAdminClick={() => { setIsSettingsOpen(false); handleTabChange('admin'); }}
            />

            {/* Desktop Navigation */}
            <aside className="hidden lg:flex w-80 flex-col bg-white dark:bg-[#0b0f1a] border-r border-slate-200 dark:border-slate-800/60 sticky top-0 h-screen py-10 px-8 z-50 shadow-pro">
                <div className="flex items-center gap-4 px-2 mb-16">
                    <div className="w-12 h-12 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl active-glow">
                        <Zap size={24} fill="white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white leading-none capitalize">CSE <span className="text-indigo-600">Tracker</span></h1>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1.5">DIU CSE Edition</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-3">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 px-4">Menu</p>
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id as any)}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-300 group relative ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white'}`}
                        >
                            <span className={`transition-transform duration-300 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                            <span className="font-bold text-sm tracking-wide">{item.label}</span>
                            {activeTab === item.id && (
                                <motion.div layoutId="activeNav" className="absolute -right-2 w-1.5 h-8 bg-indigo-600 rounded-l-full" />
                            )}
                        </button>
                    ))}

                    <AnimatePresence>
                        {canAccessAdmin && (
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => handleTabChange('admin')}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-500 group relative mt-8 ${activeTab === 'admin' ? 'bg-emerald-600 text-white shadow-2xl active-glow' : 'text-slate-500 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'}`}
                            >
                                <ShieldCheck size={20} />
                                <span className="font-black text-xs tracking-widest uppercase">Admin Panel</span>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </nav>

                <div className="mt-auto space-y-4 pt-8 border-t border-slate-100 dark:border-slate-800/60">
                    {userProfile && (
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-4 flex items-center gap-3 mb-4 border border-slate-100 dark:border-slate-800">
                            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-700 shadow-sm">
                                <UserCircle size={22} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[10px] font-black text-slate-900 dark:text-white truncate uppercase">{userProfile.full_name || 'Guest User'}</p>
                                <p className="text-[8px] font-black text-slate-400 truncate uppercase mt-0.5">
                                    Section {userProfile.section} • {
                                        (userProfile as any).batches?.name ||
                                        localStorage.getItem('selectedBatchName') ||
                                        'Academic Sync'
                                    }
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={toggleTheme} className="flex flex-col items-center justify-center gap-2 py-4 rounded-[1.5rem] bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all border border-slate-100 dark:border-slate-800">
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                            <span className="text-[10px] font-bold uppercase tracking-widest">{theme === 'light' ? 'Dark' : 'Light'}</span>
                        </button>
                        {userProfile ? (
                            <button onClick={handleLogout} className="flex flex-col items-center justify-center gap-2 py-4 rounded-[1.5rem] text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all">
                                <LogOut size={18} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Logout</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsSettingsOpen(true)}
                                className="flex flex-col items-center justify-center gap-2 py-4 rounded-[1.5rem] text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-all"
                            >
                                <ShieldCheck size={18} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Admin</span>
                            </button>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Surface */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto custom-scrollbar pb-24 lg:pb-0">
                <header className="px-6 lg:px-8 py-4 lg:py-6 flex items-center justify-between glass sticky top-0 z-[40]">
                    <div className="flex flex-col">
                        <h2 className="text-lg lg:text-xl font-black text-slate-900 dark:text-white tracking-tight capitalize leading-none mb-1">
                            {activeTab === 'admin' ? 'Admin Control' : 'Schedule & Overview'}
                        </h2>
                        <div
                            onClick={() => setIsSectionSwitcherOpen(!isSectionSwitcherOpen)}
                            className={`flex items-center gap-1 text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em] px-2 py-1 -ml-2 rounded-lg transition-all cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-950/30`}
                        >
                            Section {selectedSection}{selectedSubSection ? ` - Group ${selectedSubSection}` : ''} <ArrowLeftRight size={10} className="ml-1" />
                        </div>
                    </div>

                    <AnimatePresence>
                        {isSectionSwitcherOpen && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute left-6 lg:left-8 top-16 bg-white dark:bg-slate-900 shadow-2xl rounded-2xl border border-slate-100 dark:border-slate-800 p-2 flex gap-1 z-50 overflow-x-auto max-w-[calc(100vw-48px)] custom-scrollbar" >
                                {SECTIONS.map(s => (
                                    <button key={s} onClick={() => { setSelectedSection(s); setIsSectionSwitcherOpen(false); }} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${selectedSection === s ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`} > {s} </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex items-center gap-2 lg:gap-4">
                        <div className="relative">
                            <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="p-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all relative group" >
                                <Bell size={20} className="group-hover:animate-swing" />
                                {notifications.length > 0 && (
                                    <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-[#020617] shadow-lg animate-pulse" />
                                )}
                            </button>
                            <AnimatePresence>
                                {isNotificationsOpen && (
                                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-4 w-72 lg:w-80 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-700 p-2 z-50 overflow-hidden" >
                                        <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                            <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Live Feed</h4>
                                            <Inbox size={14} className="text-slate-300" />
                                        </div>
                                        <div className="max-h-80 overflow-y-auto custom-scrollbar p-2">
                                            {notifications.map(n => (
                                                <div key={n.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-2xl transition-all mb-1">
                                                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate mb-1">{n.title}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase font-black">{n.timestamp}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <button onClick={() => setIsSettingsOpen(true)} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all" >
                            <CogIcon size={18} />
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
                    <AnimatePresence mode="wait">
                        <motion.div key={`${activeTab}_${selectedSection}`} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} >
                            {activeTab === 'dashboard' && (
                                <Dashboard
                                    records={records}
                                    courses={courses}
                                    onAction={handleTabChange}
                                    userProfile={userProfile || (selectedSection ? { section: selectedSection, sub_section: selectedSubSection || undefined, id: 'guest', email: '', is_approved: false, role: 'student', batch_id: selectedBatch! } : undefined)}
                                />
                            )}
                            {activeTab === 'calendar' && <CalendarView records={records} courses={courses} onDateClick={() => { }} userSubSection={selectedSubSection || undefined} section={selectedSection!} batchId={selectedBatch!} />}
                            {activeTab === 'courses' && <CourseView courses={courses} records={records} section={selectedSection} userSubSection={selectedSubSection || undefined} />}
                            {activeTab === 'groups' && <GroupRegisterView courses={courses} section={selectedSection} userSubSection={selectedSubSection || undefined} batchId={selectedBatch!} />}
                            {activeTab === 'admin' && (
                                canAccessAdmin ? (
                                    <AdminPanel
                                        courses={courses} records={records} section={selectedSection!} batchId={selectedBatch!}
                                        onAddRecord={async (r) => { const n = await supabaseService.addRecord(r); setRecords(prev => [n, ...prev]); }}
                                        onDeleteRecord={async (id) => { await supabaseService.deleteRecord(id); setRecords(prev => prev.filter(r => r.id !== id)); }}
                                        onAddCourse={(c) => { setCourses(prev => [...prev, c]); }}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-[3rem]">
                                        <ShieldCheck size={48} className="text-slate-300 mb-6" />
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Access Restricted</h3>
                                        <p className="text-slate-500 text-sm mb-8">This panel is only available to verified Class Representatives.</p>
                                        <button onClick={() => handleTabChange('dashboard')} className="px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/20 active-glow">Return to Dashboard</button>
                                    </div>
                                )
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/80 dark:bg-slate-950/80 backdrop-blur-3xl border-t border-slate-200 dark:border-slate-800/60 px-6 py-5 flex items-center justify-around shadow-pro">
                {[...navItems].map(item => (
                    <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id as any)}
                        className={`p-4 rounded-2xl transition-all duration-500 relative flex flex-col items-center gap-1 ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-2xl active-glow' : 'text-slate-400 dark:text-slate-500'}`}
                    >
                        {item.icon}
                        <span className="text-[7px] font-black uppercase tracking-widest">{item.label}</span>
                        {activeTab === item.id && (
                            <motion.div layoutId="mobileActive" className="absolute -top-1 w-1 h-1 bg-white rounded-full" />
                        )}
                    </button>
                ))}
                {canAccessAdmin ? (
                    <button
                        onClick={() => handleTabChange('admin')}
                        className={`p-4 rounded-2xl transition-all duration-500 relative flex flex-col items-center gap-1 ${activeTab === 'admin' ? 'bg-emerald-600 text-white shadow-2xl active-glow' : 'text-slate-400 dark:text-slate-500'}`}
                    >
                        <ShieldCheck size={20} />
                        <span className="text-[7px] font-black uppercase tracking-widest">Admin</span>
                    </button>
                ) : (
                    <button onClick={toggleTheme} className="p-4 rounded-2xl text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all flex flex-col items-center gap-1" >
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        <span className="text-[7px] font-black uppercase tracking-widest">Theme</span>
                    </button>
                )}
            </nav>
        </div>
    );
};

export default MainDashboard;
