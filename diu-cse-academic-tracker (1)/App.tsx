import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Section, AcademicRecord, Theme, Course, Batch } from './types';
import { supabaseService, supabase } from './supabaseService';
import { useAuth } from './AuthContext';
import SplashScreen from './components/SplashScreen';
import ProtectedRoute from './components/ProtectedRoute';
import MainDashboard from './components/MainDashboard';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import PendingApprovalPage from './pages/PendingApprovalPage';
import SectionSelector from './components/SectionSelector';

const App: React.FC = () => {
  const { user, profile, isLoading: isAuthLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<string | null>(() => {
    return localStorage.getItem('selectedBatch') || null;
  });
  const [selectedSection, setSelectedSection] = useState<Section | null>(() => {
    return (localStorage.getItem('selectedSection') as Section) || null;
  });
  const [selectedSubSection, setSelectedSubSection] = useState<string | null>(() => {
    return localStorage.getItem('selectedSubSection') || null;
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [records, setRecords] = useState<AcademicRecord[]>([]);
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'light';
  });
  const navigate = useNavigate();

  // Load Initial Data (Batches)
  useEffect(() => {
    supabaseService.fetchBatches().then(setBatches);
  }, []);

  // Sync with Profile when it changes
  useEffect(() => {
    if (profile && profile.role === 'CR' && profile.is_approved) {
      setSelectedBatch(profile.batch_id);
      setSelectedSection(profile.section);
      setSelectedSubSection(profile.sub_section || null);
      localStorage.setItem('selectedBatch', profile.batch_id);
      localStorage.setItem('selectedBatchName', (profile as any).batches?.name || '');
      localStorage.setItem('selectedSection', profile.section);
      if (profile.sub_section) localStorage.setItem('selectedSubSection', profile.sub_section);
    }
  }, [profile]);

  // Theme Management
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Records & Courses Sync
  useEffect(() => {
    if (selectedSection && selectedBatch) {
      const load = async () => {
        const data = await supabaseService.fetchRecords(selectedBatch, selectedSection, selectedSubSection || undefined);
        setRecords(data);
      };
      load();

      const channel = supabase
        .channel(`records_${selectedBatch}_${selectedSection}`)
        .on('postgres_changes', {
          event: '*', schema: 'public', table: 'academic_records', filter: `batch_id=eq.${selectedBatch}`
        }, load)
        .subscribe();

      return () => { channel.unsubscribe(); };
    }
  }, [selectedBatch, selectedSection, selectedSubSection]);

  useEffect(() => {
    if (selectedBatch) {
      supabaseService.fetchCourses(selectedBatch).then(setCourses);
    }
  }, [selectedBatch]);

  const notifications = useMemo(() => {
    return records.slice(0, 5).map(r => ({
      id: r.id,
      title: `${r.type}: ${r.title}`,
      message: `New update published for Section ${selectedSection}.`,
      type: r.type === 'CT' || r.type === 'MID' ? 'urgent' : 'info',
      timestamp: r.date,
      isRead: false
    }));
  }, [records, selectedSection]);

  const handleLogout = async () => {
    await supabaseService.signOut();
    navigate('/dashboard');
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Loading state for auth
  if (isAuthLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#020617]">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Public Routes */}
      <Route path="/login" element={profile?.is_approved ? <Navigate to="/admin" /> : <LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/pending-approval" element={profile?.is_approved ? <Navigate to="/admin" /> : <PendingApprovalPage />} />

      {/* Main App Routes */}
      <Route path="/dashboard" element={
        (!selectedSection || !selectedBatch) ? (
          <SectionSelector
            batches={batches}
            onSelect={(bId, s, sub) => {
              const bName = batches.find(batch => batch.id === bId)?.name || '';
              setSelectedBatch(bId);
              localStorage.setItem('selectedBatch', bId);
              localStorage.setItem('selectedBatchName', bName);
              setSelectedSection(s);
              localStorage.setItem('selectedSection', s);
              if (sub) {
                setSelectedSubSection(sub);
                localStorage.setItem('selectedSubSection', sub);
              }
            }}
          />
        ) : (
          <MainDashboard
            userProfile={profile}
            selectedBatch={selectedBatch}
            setSelectedBatch={(b) => { setSelectedBatch(b); if (b) localStorage.setItem('selectedBatch', b); }}
            selectedSection={selectedSection}
            setSelectedSection={(s) => { setSelectedSection(s); if (s) localStorage.setItem('selectedSection', s); }}
            selectedSubSection={selectedSubSection}
            setSelectedSubSection={(s) => { setSelectedSubSection(s); if (s) localStorage.setItem('selectedSubSection', s); else localStorage.removeItem('selectedSubSection'); }}
            courses={courses}
            setCourses={setCourses}
            records={records}
            setRecords={setRecords}
            theme={theme}
            toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            handleLogout={handleLogout}
            notifications={notifications as any}
          />
        )
      } />

      {/* Private Admin Route */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={
          <MainDashboard
            userProfile={profile}
            selectedBatch={selectedBatch}
            setSelectedBatch={(b) => { setSelectedBatch(b); if (b) localStorage.setItem('selectedBatch', b); }}
            selectedSection={selectedSection}
            setSelectedSection={(s) => { setSelectedSection(s); if (s) localStorage.setItem('selectedSection', s); }}
            selectedSubSection={selectedSubSection}
            setSelectedSubSection={(s) => { setSelectedSubSection(s); if (s) localStorage.setItem('selectedSubSection', s); else localStorage.removeItem('selectedSubSection'); }}
            courses={courses}
            setCourses={setCourses}
            records={records}
            setRecords={setRecords}
            theme={theme}
            toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            handleLogout={handleLogout}
            notifications={notifications as any}
            initialTab="admin"
          />
        } />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
