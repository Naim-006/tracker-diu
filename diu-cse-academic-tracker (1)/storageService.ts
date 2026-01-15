
import { Course, AcademicRecord, Section, AppState } from './types';
import { INITIAL_COURSES } from './constants';

const STORAGE_KEY = 'diu_cse_tracker_v1';

export const storageService = {
  saveData: (state: AppState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },
  
  loadData: (): AppState => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Fix: Added missing 'theme' property to match AppState interface
      return {
        courses: parsed.courses || INITIAL_COURSES,
        records: parsed.records || [],
        selectedSection: parsed.selectedSection || null,
        user: parsed.user || null,
        isLoading: false,
        theme: parsed.theme || 'light'
      };
    }
    // Fix: Added missing 'theme' property for default AppState initialization
    return {
      courses: INITIAL_COURSES,
      records: [],
      selectedSection: null,
      user: null,
      isLoading: false,
      theme: 'light'
    };
  }
};