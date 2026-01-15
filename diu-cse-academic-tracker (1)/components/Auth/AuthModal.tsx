
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabaseService, supabase } from '../../supabaseService';
import { Section } from '../../types';
import { SECTIONS } from '../../constants';
import { X, Mail, Lock, User, ShieldCheck, Loader2, AlertCircle, CheckCircle2, KeyRound, Eye, EyeOff, UserCircle, Layers, Users, LogIn, UserPlus, Send, RefreshCw, ArrowRight, Activity } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type AuthState = 'LOGIN' | 'SIGNUP' | 'FORGOT' | 'VERIFY_SENT' | 'PENDING_APPROVAL' | 'RESET_PASS';

const AuthModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [authState, setAuthState] = useState<AuthState>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingID, setIsCheckingID] = useState(false);
  const [idExists, setIdExists] = useState<boolean | null>(null);

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    section: 'A' as Section,
    student_id: ''
  });

  const checkID = async (id: string) => {
    if (id.length < 5) { setIdExists(null); return; }
    setIsCheckingID(true);
    try {
      const { data } = await supabase.from('profiles').select('id').eq('student_id', id).single();
      setIdExists(!!data);
    } catch {
      setIdExists(false);
    } finally {
      setIsCheckingID(false);
    }
  };

  useEffect(() => {
    if (authState === 'SIGNUP' && form.student_id) {
      const timer = setTimeout(() => checkID(form.student_id), 500);
      return () => clearTimeout(timer);
    }
  }, [form.student_id, authState]);

  useEffect(() => {
    if (window.location.hash === '#reset-password') {
      setAuthState('RESET_PASS');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authState === 'SIGNUP' && idExists) {
      setError("This student ID is already registered as a CR!");
      return;
    }
    setIsLoading(true);
    setError(null);
    // ... rest of submit logic

    try {
      if (authState === 'LOGIN') {
        const { user } = await supabaseService.signIn(form.email, form.password);
        if (user) {
          const profile = await supabaseService.getProfile(user.id);
          if (profile && !profile.is_approved) {
            setAuthState('PENDING_APPROVAL');
            setIsLoading(false);
            return;
          }
          onSuccess();
          onClose();
        }
      } else if (authState === 'SIGNUP') {
        await supabaseService.signUp(form.email, form.password, form.section, form.name, (form as any).sub_section);
        setAuthState('VERIFY_SENT');
      } else if (authState === 'FORGOT') {
        await supabaseService.resetPassword(form.email);
        alert('Password reset link sent to your DIU mail!');
        setAuthState('LOGIN');
      } else if (authState === 'RESET_PASS') {
        await supabaseService.updatePassword(form.password);
        alert('Password updated successfully. Please login.');
        window.location.hash = '';
        setAuthState('LOGIN');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020617] overflow-hidden"
        >
          {/* Animated Mesh Background */}
          <div className="absolute inset-0 opacity-30">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 90, 0],
                x: [0, 100, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px]"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                rotate: [90, 0, 90],
                x: [0, -100, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-emerald-600/20 rounded-full blur-[120px]"
            />
          </div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full h-full lg:h-[90vh] lg:max-w-7xl lg:rounded-[3rem] bg-white dark:bg-slate-900 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] flex flex-col lg:flex-row overflow-hidden relative z-10"
          >
            {/* Left Column: Cinematic Visuals */}
            <div className="hidden lg:flex w-1/2 bg-[#020617] p-16 flex-col justify-between relative overflow-hidden text-white">
              <div className="absolute inset-0 opacity-40">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              </div>

              <div className="relative z-10">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl mb-12"
                >
                  <ShieldCheck size={32} />
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-6xl font-black tracking-tighter mb-6 leading-[0.9]"
                >
                  DIU CSE <br />
                  <span className="text-indigo-500">TRACKER</span> <br />
                  SYSTEM
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500"
                >
                  <div className="w-12 h-px bg-slate-800" />
                  ACADEMIC RESOURCES
                </motion.div>
              </div>

              <div className="relative z-10 max-w-sm">
                <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                  A simple and secure platform for DIU CSE students to track classes, materials, and routines.
                </p>
                <div className="flex gap-12">
                  <div>
                    <p className="text-2xl font-black text-white">2.5k+</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Users</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">100%</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Sync</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 p-8 lg:p-20 overflow-y-auto relative custom-scrollbar">
              <div className="flex justify-end absolute top-8 right-8 z-50">
                <button
                  onClick={onClose}
                  className="p-4 bg-slate-50 dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-12"
                >
                  <motion.div variants={itemVariants} className="lg:hidden w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8">
                    <ShieldCheck size={24} />
                  </motion.div>

                  <motion.h3
                    variants={itemVariants}
                    className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter"
                  >
                    {authState === 'LOGIN' && 'Sign In'}
                    {authState === 'SIGNUP' && 'Create Account'}
                    {authState === 'FORGOT' && 'Reset Password'}
                    {authState === 'RESET_PASS' && 'New Password'}
                    {authState === 'VERIFY_SENT' && 'Check Email'}
                    {authState === 'PENDING_APPROVAL' && 'Pending Approval'}
                  </motion.h3>

                  <motion.p variants={itemVariants} className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                    {authState === 'LOGIN' ? 'Sign in with your university account.' :
                      authState === 'SIGNUP' ? 'Join the DIU CSE tracking system.' :
                        'Follow the steps to recover your account.'}
                  </motion.p>
                </motion.div>

                <AnimatePresence mode="wait">
                  {authState === 'VERIFY_SENT' ? (
                    <motion.div key="verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="py-10">
                      <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-3xl flex items-center justify-center mb-6">
                        <CheckCircle2 size={40} />
                      </div>
                      <h4 className="text-xl font-black mb-3">EMAIL SENT</h4>
                      <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">A verification link is on its way to your DIU email. Check your inbox to proceed.</p>
                      <button onClick={() => setAuthState('LOGIN')} className="premium-btn w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] text-xs">Return to Login</button>
                    </motion.div>
                  ) : authState === 'PENDING_APPROVAL' ? (
                    <motion.div key="pending" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="py-10">
                      <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mb-6">
                        <AlertCircle size={40} className="animate-pulse" />
                      </div>
                      <h4 className="text-xl font-black mb-3">PENDING APPROVAL</h4>
                      <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                        Your account is waiting for approval from a CR or Admin.
                      </p>
                      <div className="space-y-3">
                        <a href="https://wa.me/8801969507606" target="_blank" className="premium-btn block text-center py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs">Contact Admin (WhatsApp)</a>
                        <button onClick={() => setAuthState('LOGIN')} className="w-full text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-4">Cancel</button>
                      </div>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <AnimatePresence mode="popLayout">
                        {authState === 'SIGNUP' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-6 overflow-hidden"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Full Name</label>
                                <div className="relative group">
                                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={18} />
                                  <input type="text" required className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold dark:text-white" placeholder="Enter your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Student ID</label>
                                <div className="relative group">
                                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={18} />
                                  <input type="text" required className={`w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold dark:text-white ${idExists === true ? 'border-rose-500 ring-4 ring-rose-500/10' : idExists === false ? 'border-emerald-500 ring-4 ring-emerald-500/10' : ''}`} placeholder="221-35-XXX" value={form.student_id} onChange={e => setForm({ ...form, student_id: e.target.value })} />
                                  {isCheckingID && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-indigo-500" size={18} />}
                                  {!isCheckingID && idExists !== null && <div className="absolute right-4 top-1/2 -translate-y-1/2">{idExists ? <AlertCircle className="text-rose-500" size={18} /> : <CheckCircle2 className="text-emerald-500" size={18} />}</div>}
                                </div>
                                {idExists && <p className="text-[10px] font-bold text-rose-500 uppercase mt-1 px-1">ID already in use</p>}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Section</label>
                                <div className="relative group">
                                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-10" size={18} />
                                  <select className="w-full pl-12 pr-10 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black dark:text-white appearance-none cursor-pointer" value={form.section} onChange={e => setForm({ ...form, section: e.target.value as Section })} >
                                    {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
                                  </select>
                                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-focus-within:text-indigo-500"><Activity size={12} /></div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Group</label>
                                <div className="relative group">
                                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none z-10" size={18} />
                                  <select className="w-full pl-12 pr-10 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black dark:text-white appearance-none cursor-pointer" value={(form as any).sub_section || ''} onChange={e => setForm({ ...form, sub_section: e.target.value })} name="sub_section" >
                                    <option value="">WHOLE SECTION</option>
                                    <option value="1">GROUP 01</option>
                                    <option value="2">GROUP 02</option>
                                  </select>
                                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-focus-within:text-indigo-500"><Activity size={12} /></div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {authState !== 'RESET_PASS' && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 px-1">Email Address</label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={18} />
                            <input type="email" required className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold dark:text-white" placeholder="id@diu.edu.bd" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                          </div>
                        </div>
                      )}

                      {(authState === 'LOGIN' || authState === 'SIGNUP' || authState === 'RESET_PASS') && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Password</label>
                            {authState === 'LOGIN' && (
                              <button type="button" onClick={() => setAuthState('FORGOT')} className="text-[9px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-colors">Forgot?</button>
                            )}
                          </div>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={18} />
                            <input type={showPassword ? 'text' : 'password'} required className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold dark:text-white" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors">
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>
                      )}

                      {error && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                          <AlertCircle size={16} /> {error}
                        </motion.div>
                      )}

                      <div className="pt-4 space-y-8">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="premium-btn w-full py-5 bg-indigo-600 text-white font-black rounded-[1.5rem] shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                          {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                              <span className="uppercase tracking-[0.3em] text-xs">
                                {authState === 'LOGIN' ? 'Sign In Now' :
                                  authState === 'SIGNUP' ? 'Join Now' :
                                    authState === 'FORGOT' ? 'Send Reset Link' : 'Update Password'}
                              </span>
                              <ArrowRight size={18} />
                            </>
                          )}
                        </button>

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => setAuthState(authState === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
                            className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 hover:text-indigo-600 transition-colors"
                          >
                            {authState === 'LOGIN' ? "No account? Create one" : "Already have an account? Sign In"}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </AnimatePresence>

                <div className="mt-20 flex items-center justify-center gap-4 py-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 overflow-hidden" />)}
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Secure academic tracking</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
