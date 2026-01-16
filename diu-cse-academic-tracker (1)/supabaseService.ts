import { createClient } from '@supabase/supabase-js';
import { AcademicRecord, Course, UserProfile, Section, Batch } from './types';

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

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, name: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Query Timeout: ${name} after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

export const supabaseService = {
  signUp: async (email: string, pass: string, section: Section, name: string, role: string, batchId: string, subSection?: string) => {
    if (!email.endsWith('@diu.edu.bd')) {
      throw new Error('Please use your DIU institutional email (@diu.edu.bd)');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { full_name: name, section: section, role: role, batch_id: batchId, sub_section: subSection },
        emailRedirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  },

  signIn: async (email: string, pass: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) throw error;

    if (data.user && !data.user.email_confirmed_at) {
      // Supabase might let them in if "Enable email cnfirmation" is off, 
      // but if it is ON, signInWithPassword usually returns error or session is null.
      // This is an extra safety check if needed.
      throw new Error('Please verify your email address first.');
    }
    return data;
  },

  resetPassword: async (email: string) => {
    // Check if user exists in profiles first to give a specific error
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (fetchError || !data) {
      throw new Error('This email is not registered in our system.');
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#reset-password`,
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

  getProfile: async (userId: string, retries = 2): Promise<UserProfile | null> => {
    console.log('[SupabaseService] getProfile started for:', userId);
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`[SupabaseService] Fetch attempt ${i + 1}/${retries}...`);

        // Wrap query in timeout
        const { data, error } = await withTimeout(
          supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .maybeSingle(),
          5000,
          'getProfile'
        );

        if (error) {
          console.error('[SupabaseService] Query error:', error);
          throw error;
        }

        if (data) {
          console.log('[SupabaseService] Profile found:', data);
          // Optionally fetch batch if needed, but let's keep it simple for now
          if (data.batch_id) {
            try {
              const { data: batchData } = await withTimeout(
                supabase.from('batches').select('*').eq('id', data.batch_id).maybeSingle(),
                3000,
                'getBatch'
              );
              data.batches = batchData;
            } catch (e) {
              console.warn('[SupabaseService] Batch fetch timed out but continuing...');
            }
          }
          return data;
        }

        console.log('[SupabaseService] No profile matching ID yet');
      } catch (err: any) {
        console.error('[SupabaseService] Exception in getProfile:', err.message || err);
        if (err.message && err.message.includes('Timeout')) {
          // If it's a timeout, we might want to fail faster or log specifically
        }
      }

      if (i < retries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    console.warn('[SupabaseService] Profile not found or timed out.');
    return null;
  },

  fetchBatches: async (): Promise<Batch[]> => {
    try {
      const { data, error } = await withTimeout(
        supabase.from('batches').select('*').order('name'),
        5000,
        'fetchBatches'
      );
      if (error) throw error;
      return data || [];
    } catch (e) {
      console.error('[SupabaseService] fetchBatches failed:', e);
      return [];
    }
  },

  fetchCourses: async (batchId?: string): Promise<Course[]> => {
    let query = supabase.from('courses').select('*').order('code');
    if (batchId) {
      query = query.eq('batch_id', batchId);
    }
    const { data, error } = await query;
    if (error) return [];
    return data;
  },

  addCourse: async (course: Omit<Course, 'id'>) => {
    const { data, error } = await supabase.from('courses').insert(course).select();
    if (error) throw error;
    return data[0];
  },

  fetchRecords: async (batchId: string, section: Section, subSection?: string): Promise<AcademicRecord[]> => {
    let query = supabase
      .from('academic_records')
      .select('*')
      .eq('batch_id', batchId)
      .eq('section', section);

    if (subSection) {
      // Fetch records for the whole section OR specific sub-section
      query = query.or(`sub_section.is.null,sub_section.eq.${subSection}`);
    }
    // If no subSection is provided, we fetch everything for this section/batch
    // (no additional filtering needed)

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

  fetchGroups: async (batchId: string, courseId: string, section: Section): Promise<any[]> => {
    const { data, error } = await supabase
      .from('course_groups')
      .select('*, group_members(*)')
      .eq('batch_id', batchId)
      .eq('course_id', courseId)
      .eq('section', section)
      .order('sub_section')
      .order('group_number');
    if (error) return [];
    return data;
  },

  updateGroups: async (batchId: string, courseId: string, section: Section, groups: any[]) => {
    // This is a complex operation: clear existing and insert new
    // For simplicity in this demo, we'll implement a basic upsert or replacement logic
    // Clear existing groups for this course/section
    const { error: deleteError } = await supabase
      .from('course_groups')
      .delete()
      .eq('batch_id', batchId)
      .eq('course_id', courseId)
      .eq('section', section);

    if (deleteError) throw deleteError;

    for (const group of groups) {
      const { data: gData, error: gError } = await supabase
        .from('course_groups')
        .insert({
          batch_id: batchId,
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
