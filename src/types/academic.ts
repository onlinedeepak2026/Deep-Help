export type AcademicResourceType = 'pyq' | 'practical' | 'assignment' | 'notes';

export interface AcademicResource {
  id: string;
  type: AcademicResourceType;
  title: string;
  subjectId: string;
  subjectName: string;
  semester: string; // e.g. "Semester 5", "Semester 3", "Diploma 2nd Year", "Competitive"
  academicYear?: string; // e.g. "2024", "2023", "2022"
  examName?: string; // For PYQ: "SSC JE", "GATE", "State PSC", "University Final"
  experimentNumber?: string; // For Practical: "Exp #04"
  aim?: string; // For Practical
  apparatus?: string[]; // For Practical
  dueDate?: string; // For Assignment
  status?: 'pending' | 'completed' | 'verified'; // For Assignment
  description?: string;
  solutionText?: string; // Answer key or Viva Q&A
  hasSolution?: boolean;
  tags: string[];
  fileAttachment?: {
    name: string;
    size: number;
    mimeType: string;
    dataUrl?: string; // Base64 data URL or Blob storage URL
    blobKey?: string; // Key in IndexedDB blob store
  };
  authorName?: string;
  createdAt: number;
  isPreloaded?: boolean;
}

export interface AcademicStorageStats {
  totalCount: number;
  pyqCount: number;
  practicalCount: number;
  assignmentCount: number;
  notesCount: number;
  totalBytes: number;
  storageQuotaMB?: number;
}
