
import React, { useState } from 'react';
import { Course, AcademicRecord, EntryType, Section } from '../types';
import { SECTIONS } from '../constants';
import { Plus, Trash2, CheckCircle2, MapPin, Clock, GraduationCap, BookOpen, AlertCircle, Link, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseService } from '../supabaseService';

interface Props {
  courses: Course[];
  records: AcademicRecord[];
  section: Section;
  batchId: string;
  onAddRecord: (record: Omit<AcademicRecord, 'id'>) => Promise<void>;
  onDeleteRecord: (id: string) => Promise<void>;
  onAddCourse?: (course: Course) => void;
}

const AdminPanel: React.FC<Props> = ({ courses, records, section, batchId, onAddRecord, onDeleteRecord, onAddCourse }) => {
  const [activeTab, setActiveTab] = useState<'RECORD' | 'COURSE'>('RECORD');
  const [isSuccess, setIsSuccess] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<AcademicRecord>>({
    type: EntryType.EXTRA_CLASS,
    date: new Date().toISOString().split('T')[0],
  });

  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    teacher: '',
    credit: 3
  });

  const [groupTargetSub, setGroupTargetSub] = useState<'1' | '2'>('1');
  const [activeCourseGroups, setActiveCourseGroups] = useState<any[]>([]);
  const [selectedGroupCourse, setSelectedGroupCourse] = useState('');

  const handleSubmitRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.course_id || !newRecord.title || !newRecord.date) {
      alert('Please fill in Course, Title, and Date.');
      return;
    }

    try {
      await onAddRecord({ ...newRecord, section, batch_id: batchId } as Omit<AcademicRecord, 'id'>);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      setNewRecord({ type: EntryType.EXTRA_CLASS, date: new Date().toISOString().split('T')[0] });
    } catch (err: any) {
      console.error('Error adding record:', err);
      alert('Failed to add record: ' + (err.message || 'Unknown error'));
    }
  };

  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const added = await supabaseService.addCourse({ ...newCourse, batch_id: batchId });
      onAddCourse?.(added);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
      setNewCourse({ code: '', name: '', teacher: '', credit: 3 });
    } catch (err: any) {
      console.error('Error adding course:', err);
      alert('Failed to add course: ' + (err.message || 'Unknown error'));
    }
  };

  const loadGroups = async (courseId: string) => {
    const groups = await supabaseService.fetchGroups(batchId, courseId, section);
    setActiveCourseGroups(groups);
  };

  const handleUpdateGroups = async () => {
    if (!selectedGroupCourse) return;
    try {
      await supabaseService.updateGroups(batchId, selectedGroupCourse, section, activeCourseGroups);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating groups:', err);
      alert('Failed to update groups: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="space-y-12 pb-20 max-w-6xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
          <div className="flex flex-wrap gap-2 p-1 bg-slate-50 dark:bg-slate-800 rounded-2xl w-fit">
            <button onClick={() => setActiveTab('RECORD')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'RECORD' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>Add Record</button>
            <button onClick={() => setActiveTab('COURSE')} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'COURSE' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>Add Course</button>
            <button onClick={() => { setActiveTab('GROUPS' as any); if (selectedGroupCourse) loadGroups(selectedGroupCourse); }} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === ('GROUPS' as any) ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}>Edit Groups</button>
          </div>
          {isSuccess && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 dark:bg-emerald-950/30 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-800" >
              <CheckCircle2 size={16} /> Saved Successfully
            </motion.div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'RECORD' ? (
            <motion.form key="rec" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onSubmit={handleSubmitRecord} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Course Target</label>
                <select className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 font-bold dark:text-white" value={newRecord.course_id || ''} onChange={e => setNewRecord({ ...newRecord, course_id: e.target.value })} required >
                  <option value="">Select Course</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Category</label>
                <select className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 font-bold dark:text-white" value={newRecord.type} onChange={e => setNewRecord({ ...newRecord, type: e.target.value as EntryType })} >
                  {Object.values(EntryType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Date</label>
                <input type="date" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 font-bold dark:text-white" value={newRecord.date} onChange={e => setNewRecord({ ...newRecord, date: e.target.value })} required />
              </div>
              <div className="md:col-span-3 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Update Title / Topic</label>
                <input type="text" required placeholder="e.g. Recursive Algorithms Implementation" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 font-bold dark:text-white" value={newRecord.title || ''} onChange={e => setNewRecord({ ...newRecord, title: e.target.value })} />
              </div>
              <div className="md:col-span-3 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  {newRecord.type === EntryType.CT || newRecord.type === EntryType.MID || newRecord.type === EntryType.FINAL || newRecord.type === EntryType.PROJECT_REPORT ? 'Covered Topics / Syllabus' : 'Description / Note'}
                </label>
                <textarea
                  rows={2}
                  className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 font-medium dark:text-white resize-none"
                  value={(newRecord.type === EntryType.CT || newRecord.type === EntryType.MID || newRecord.type === EntryType.FINAL || newRecord.type === EntryType.PROJECT_REPORT) ? (newRecord.topics || '') : (newRecord.description || '')}
                  onChange={e => {
                    if (newRecord.type === EntryType.CT || newRecord.type === EntryType.MID || newRecord.type === EntryType.FINAL || newRecord.type === EntryType.PROJECT_REPORT) {
                      setNewRecord({ ...newRecord, topics: e.target.value });
                    } else {
                      setNewRecord({ ...newRecord, description: e.target.value });
                    }
                  }}
                />
              </div>

              {newRecord.type === EntryType.MATERIAL ? (
                <>
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2"><BookOpen size={12} /> Class Note Link</label>
                      <input type="url" placeholder="https://..." className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 font-medium dark:text-white" value={newRecord.link || ''} onChange={e => setNewRecord({ ...newRecord, link: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 flex items-center gap-2"><FileText size={12} /> Lecture Sheet Link</label>
                      <input type="url" placeholder="https://..." className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 font-medium dark:text-white" value={newRecord.link_two || ''} onChange={e => setNewRecord({ ...newRecord, link_two: e.target.value })} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Resource Link</label>
                  <input type="url" placeholder="https://..." className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 font-medium dark:text-white" value={newRecord.link || ''} onChange={e => setNewRecord({ ...newRecord, link: e.target.value })} />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Target Group</label>
                <select className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 font-bold dark:text-white" value={newRecord.sub_section || ''} onChange={e => setNewRecord({ ...newRecord, sub_section: e.target.value || undefined })} >
                  <option value="">Whole Section</option>
                  <option value="1">Group 1 (Lab)</option>
                  <option value="2">Group 2 (Lab)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Room / Venue</label>
                <input type="text" placeholder="Room 602" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 font-medium dark:text-white" value={newRecord.room || ''} onChange={e => setNewRecord({ ...newRecord, room: e.target.value })} />
              </div>

              <div className="md:col-span-3">
                <button type="submit" className="px-12 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all" >Save to Section {section}</button>
              </div>
            </motion.form>
          ) : activeTab === 'COURSE' ? (
            <motion.form key="course" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onSubmit={handleSubmitCourse} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Course Code</label>
                <input type="text" required placeholder="CSE 112" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 font-bold dark:text-white" value={newCourse.code} onChange={e => setNewCourse({ ...newCourse, code: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Course Name</label>
                <input type="text" required placeholder="Computer Fundamentals" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 font-bold dark:text-white" value={newCourse.name} onChange={e => setNewCourse({ ...newCourse, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Teacher Name</label>
                <input type="text" required placeholder="Dr. John Doe" className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 font-bold dark:text-white" value={newCourse.teacher} onChange={e => setNewCourse({ ...newCourse, teacher: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Credits</label>
                <input type="number" step="0.25" required className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 font-bold dark:text-white" value={newCourse.credit} onChange={e => setNewCourse({ ...newCourse, credit: parseFloat(e.target.value) })} />
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="px-12 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all" >Save Course</button>
              </div>
            </motion.form>
          ) : (
            <motion.div key="groups" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Course Registry</label>
                  <select className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 font-bold dark:text-white" value={selectedGroupCourse} onChange={e => { setSelectedGroupCourse(e.target.value); loadGroups(e.target.value); }} >
                    <option value="">Select Course</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Sub-Section Context</label>
                  <div className="flex gap-4">
                    <button onClick={() => setGroupTargetSub('1')} className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${groupTargetSub === '1' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>G1 (Group 1-5)</button>
                    <button onClick={() => setGroupTargetSub('2')} className={`flex-1 py-4 rounded-2xl font-black text-xs transition-all ${groupTargetSub === '2' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>G2 (Group 1-5)</button>
                  </div>
                </div>
              </div>

              {selectedGroupCourse && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  {[1, 2, 3, 4, 5].map(gNum => {
                    const group = activeCourseGroups.find(g => g.sub_section === groupTargetSub && g.group_number === gNum) || { sub_section: groupTargetSub, group_number: gNum, members: [] };
                    return (
                      <div key={gNum} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                          <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Group {gNum}</h4>
                          <span className="text-[8px] font-black text-slate-400">G{groupTargetSub}</span>
                        </div>
                        <div className="space-y-3">
                          {[0, 1, 2, 3, 4].map(mIdx => (
                            <div key={mIdx} className="space-y-1">
                              <input
                                type="text"
                                placeholder="ID"
                                className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-[10px] font-bold dark:text-white outline-none focus:border-indigo-500"
                                value={group.members[mIdx]?.student_id || ''}
                                onChange={e => {
                                  const newGroups = [...activeCourseGroups];
                                  let gIdx = newGroups.findIndex(ng => ng.sub_section === groupTargetSub && ng.group_number === gNum);
                                  if (gIdx === -1) {
                                    newGroups.push({ sub_section: groupTargetSub, group_number: gNum, members: [] });
                                    gIdx = newGroups.length - 1;
                                  }
                                  const members = [...newGroups[gIdx].members];
                                  if (!members[mIdx]) members[mIdx] = { student_id: '', name: '' };
                                  members[mIdx].student_id = e.target.value;
                                  newGroups[gIdx].members = members;
                                  setActiveCourseGroups(newGroups);
                                }}
                              />
                              <input
                                type="text"
                                placeholder="Name"
                                className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-[10px] font-bold dark:text-white outline-none focus:border-indigo-500"
                                value={group.members[mIdx]?.name || ''}
                                onChange={e => {
                                  const newGroups = [...activeCourseGroups];
                                  let gIdx = newGroups.findIndex(ng => ng.sub_section === groupTargetSub && ng.group_number === gNum);
                                  if (gIdx === -1) {
                                    newGroups.push({ sub_section: groupTargetSub, group_number: gNum, members: [] });
                                    gIdx = newGroups.length - 1;
                                  }
                                  const members = [...newGroups[gIdx].members];
                                  if (!members[mIdx]) members[mIdx] = { student_id: '', name: '' };
                                  members[mIdx].name = e.target.value;
                                  newGroups[gIdx].members = members;
                                  setActiveCourseGroups(newGroups);
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedGroupCourse && (
                <div className="flex flex-col md:flex-row gap-4">
                  <button onClick={handleUpdateGroups} className="px-12 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all" >Save Group List</button>
                  <div className="flex gap-2">
                    <button className="px-6 py-4 bg-emerald-600/10 text-emerald-600 border border-emerald-600/20 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all">Excel Import</button>
                    <button className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all">Download Format</button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800 dark:text-white">Recent Records</h3>
          <span className="text-[10px] font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-lg uppercase tracking-widest"> {records.length} Total Records </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Course & Title</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {records.map(r => {
                const course = courses.find(c => c.id === r.course_id);
                return (
                  <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-5">
                      <div className="font-black text-slate-900 dark:text-white">{r.date}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-[9px] font-black rounded-lg text-slate-500 dark:text-slate-400 uppercase">{r.type}</span>
                        {r.sub_section && (
                          <span className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[8px] font-black rounded uppercase">G{r.sub_section}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-sm">{course?.code}: {r.title}</div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button onClick={() => onDeleteRecord(r.id)} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
