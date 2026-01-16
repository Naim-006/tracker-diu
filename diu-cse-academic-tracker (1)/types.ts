export type Section = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
export type Theme = 'light' | 'dark';

export interface Batch {
  id: string;
  name: string;
  created_at?: string;
}

export enum EntryType {
  EXTRA_CLASS = 'EXTRA CLASS',
  MATERIAL = 'MATERIAL',
  CT = 'CT',
  MID = 'MID',
  FINAL = 'FINAL',
  ASSIGNMENT = 'ASSIGNMENT',
  LAB_REPORT = 'LAB REPORT',
  PROJECT_REPORT = 'PROJECT REPORT'
}

export interface GroupMember {
  id: string;
  student_id: string;
  name: string;
}

export interface CourseGroup {
  id: string;
  course_id: string;
  section: Section;
  sub_section: string; // '1' or '2'
  group_number: number; // 1-5
  members: GroupMember[];
}

export interface UserProfile {
  id: string;
  email: string;
  is_approved: boolean;
  batch_id: string;
  section: Section;
  sub_section?: string;
  full_name?: string;
  role?: 'student' | 'CR';
}

export interface Course {
  id: string;
  batch_id: string;
  code: string;
  name: string;
  teacher: string;
  credit: number;
}

export interface AcademicRecord {
  id: string;
  batch_id: string;
  course_id: string;
  section: Section;
  sub_section?: string;
  date: string;
  type: EntryType;
  title: string;
  description?: string;
  link?: string;
  link_two?: string;
  topics?: string;
  time?: string;
  room?: string;
  created_by?: string;
  created_at?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  timestamp: string;
  isRead: boolean;
}

export interface AppState {
  batches: Batch[];
  courses: Course[];
  records: AcademicRecord[];
  selectedBatch: string | null;
  selectedSection: Section | null;
  user: UserProfile | null;
  isLoading: boolean;
  theme: Theme;
}
