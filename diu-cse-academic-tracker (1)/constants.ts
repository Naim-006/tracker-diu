
import { Course, Section, EntryType } from './types';

export const SECTIONS: Section[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const INITIAL_COURSES: Course[] = [
  { id: '1', code: 'CSE 112', name: 'Computer Fundamentals', teacher: 'Dr. John Doe', credit: 3 },
  { id: '2', code: 'CSE 121', name: 'Structured Programming', teacher: 'Mrs. Jane Smith', credit: 3 },
  { id: '3', code: 'CSE 122', name: 'Structured Programming Lab', teacher: 'Mrs. Jane Smith', credit: 1 },
  { id: '4', code: 'CSE 211', name: 'Object Oriented Programming', teacher: 'Dr. Alan Turing', credit: 3 },
  { id: '5', code: 'CSE 212', name: 'OOP Lab', teacher: 'Dr. Alan Turing', credit: 1 },
  { id: '6', code: 'MAT 121', name: 'Mathematics II', teacher: 'Dr. Newton', credit: 3 },
];

export const ENTRY_TYPE_COLORS: Record<any, string> = {
  [EntryType.EXTRA_CLASS]: 'bg-blue-100 text-blue-700 border-blue-200',
  [EntryType.MATERIAL]: 'bg-green-100 text-green-700 border-green-200',
  [EntryType.CT]: 'bg-amber-100 text-amber-700 border-amber-200',
  [EntryType.MID]: 'bg-purple-100 text-purple-700 border-purple-200',
  [EntryType.FINAL]: 'bg-red-100 text-red-700 border-red-200',
  [EntryType.ASSIGNMENT]: 'bg-orange-100 text-orange-700 border-orange-200',
  [EntryType.LAB_REPORT]: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  [EntryType.PROJECT_REPORT]: 'bg-rose-100 text-rose-700 border-rose-200',
};
