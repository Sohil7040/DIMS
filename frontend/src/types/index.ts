export interface Document {
  id: string;
  filename: string;
  originalName: string;
  category: DocumentCategory;
  uploadDate: string;
  uploader: string;
  metadata: DocumentMetadata;
  summary: string;
  content: string;
  fileSize: number;
  fileType: string;
  tags: string[];
  accessLevel: AccessLevel[];
}

export interface DocumentMetadata {
  title: string;
  author: string;
  extractedDate?: string;
  entities: ExtractedEntity[];
  confidence: number;
}

export interface ExtractedEntity {
  text: string;
  type: EntityType;
  confidence: number;
}

export type EntityType = 'PERSON' | 'ORGANIZATION' | 'MONEY' | 'DATE' | 'LOCATION';

export type DocumentCategory = 
  | 'Finance' 
  | 'HR' 
  | 'Legal' 
  | 'Contracts' 
  | 'Technical Reports' 
  | 'Marketing' 
  | 'Operations' 
  | 'Uncategorized';

export type AccessLevel = 'HR' | 'Finance' | 'Legal' | 'Admin' | 'All';

export interface User {
  id: string;
  username: string;
  role: AccessLevel;
  fullName: string;
  email: string;
  lastLogin: string;
}

export interface SearchResult {
  document: Document;
  relevanceScore: number;
  matchedContent: string[];
  highlightedSummary: string;
}

export interface UploadProgress {
  filename: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  stage: string;
}

export interface AccessLog {
  id: string;
  userId: string;
  documentId: string;
  action: 'upload' | 'view' | 'search' | 'download';
  timestamp: string;
  metadata?: Record<string, any>;
}