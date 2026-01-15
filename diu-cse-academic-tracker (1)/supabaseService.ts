
import { createClient } from '@supabase/supabase-js';
import { AcademicRecord, Course, UserProfile, Section } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Client with session persistence enabled
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export const supabaseService = {
  signUp: async (email: string, pass: string, section: Section, name: string, subSection?: string) => {
    if (!email.endsWith('@diu.edu.bd')) {
      throw new Error('Please use your DIU institutional email (@diu.edu.bd)');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { full_name: name, section: section, sub_section: subSection },
        emailRedirectTo: 'https://tracker-diu-q6jr.vercel.app/'
      }
    });
    if (error) throw error;
    return data;
  },

  signIn: async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;
    return data;
  },

  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://tracker-diu-q6jr.vercel.app/#reset-password',
    });
    if (error) throw error;
  },

  updatePassword: async (newPass: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPass });
    if (error) throw error;
  },

  signOut: async () => {
    await supabase.auth.signOut();
  },

  getProfile: async (userId: string): Promise<UserProfile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) return null;
    return data;
  },

  fetchCourses: async (): Promise<Course[]> => {
    const { data, error } = await supabase.from('courses').select('*').order('code');
    if (error) return [];
    return data;
  },

  addCourse: async (course: Omit<Course, 'id'>) => {
    const { data, error } = await supabase.from('courses').insert(course).select();
    if (error) throw error;
    return data[0];
  },

  fetchRecords: async (section: Section, subSection?: string): Promise<AcademicRecord[]> => {
    let query = supabase
      .from('academic_records')
      .select('*')
      .eq('section', section);

    if (subSection) {
      // Fetch records for the whole section OR specific sub-section
      query = query.or(`sub_section.is.null,sub_section.eq.${subSection}`);
    } else {
      // Default to theory only (sub_section is null) if not specified
      query = query.is('sub_section', null);
    }

    const { data, error } = await query.order('date', { ascending: false });
    if (error) return [];
    return data;
  },

  addRecord: async (record: Omit<AcademicRecord, 'id'>) => {
    const { data, error } = await supabase.from('academic_records').insert(record).select();
    if (error) throw error;
    return data[0];
  },

  deleteRecord: async (id: string) => {
    const { error } = await supabase.from('academic_records').delete().eq('id', id);
    if (error) throw error;
  },

  fetchGroups: async (courseId: string, section: Section): Promise<any[]> => {
    const { data, error } = await supabase
      .from('course_groups')
      .select('*, group_members(*)')
      .eq('course_id', courseId)
      .eq('section', section)
      .order('sub_section')
      .order('group_number');
    if (error) return [];
    return data;
  },

  updateGroups: async (courseId: string, section: Section, groups: any[]) => {
    // This is a complex operation: clear existing and insert new
    // For simplicity in this demo, we'll implement a basic upsert or replacement logic
    // Clear existing groups for this course/section
    const { error: deleteError } = await supabase
      .from('course_groups')
      .delete()
      .eq('course_id', courseId)
      .eq('section', section);

    if (deleteError) throw deleteError;

    for (const group of groups) {
      const { data: gData, error: gError } = await supabase
        .from('course_groups')
        .insert({
          course_id: courseId,
          section: section,
          sub_section: group.sub_section,
          group_number: group.group_number
        })
        .select()
        .single();

      if (gError) throw gError;

      if (group.members && group.members.length > 0) {
        const membersToInsert = group.members.map((m: any) => ({
          group_id: gData.id,
          student_id: m.student_id,
          name: m.name
        }));
        const { error: mError } = await supabase.from('group_members').insert(membersToInsert);
        if (mError) throw mError;
      }
    }
  }
};
