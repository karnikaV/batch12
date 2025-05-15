export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedBy: User;
  sharedWith: User[];
  uploadedAt: string;
  lastModified: string;
  status: 'pending' | 'reviewed' | 'approved' | 'rejected';
  comments?: DocumentComment[];
  url?: string;
}

export interface DocumentComment {
  id: string;
  documentId: string;
  user: User;
  content: string;
  timestamp: string;
} 