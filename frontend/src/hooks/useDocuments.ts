import { useState, useEffect } from 'react';
import { Document, DocumentCategory, SearchResult, UploadProgress } from '../types';
import { documentProcessor } from '../services/documentProcessor';
import { searchService } from '../services/searchService';

export const useDocuments = (userRole: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

  useEffect(() => {
    loadDocuments();
  }, [userRole]);

  const loadDocuments = () => {
    setLoading(true);
    const stored = localStorage.getItem('docai_documents');
    const allDocuments = stored ? JSON.parse(stored) : [];
    
    // Filter documents based on user role
    const filteredDocs = allDocuments.filter((doc: Document) => 
      userRole === 'Admin' || doc.accessLevel.includes(userRole) || doc.accessLevel.includes('All')
    );
    
    setDocuments(filteredDocs);
    setLoading(false);
  };

  const uploadDocument = async (file: File, uploader: string): Promise<string> => {
    const uploadId = Date.now().toString();
    const progress: UploadProgress = {
      filename: file.name,
      progress: 0,
      status: 'uploading',
      stage: 'Uploading file...'
    };

    setUploadProgress(prev => [...prev, progress]);

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(prev => prev.map(p => 
          p.filename === file.name ? { ...p, progress: i } : p
        ));
      }

      // Switch to processing
      setUploadProgress(prev => prev.map(p => 
        p.filename === file.name 
          ? { ...p, status: 'processing', stage: 'Processing document...', progress: 0 }
          : p
      ));

      // Process document
      const document = await documentProcessor.processDocument(file, uploader);
      
      // Save to storage
      const stored = localStorage.getItem('docai_documents');
      const allDocuments = stored ? JSON.parse(stored) : [];
      allDocuments.push(document);
      localStorage.setItem('docai_documents', JSON.stringify(allDocuments));

      // Update local state
      setDocuments(prev => [...prev, document]);

      // Complete upload
      setUploadProgress(prev => prev.map(p => 
        p.filename === file.name 
          ? { ...p, status: 'complete', stage: 'Complete!', progress: 100 }
          : p
      ));

      // Remove from progress after delay
      setTimeout(() => {
        setUploadProgress(prev => prev.filter(p => p.filename !== file.name));
      }, 2000);

      return document.id;
    } catch (error) {
      setUploadProgress(prev => prev.map(p => 
        p.filename === file.name 
          ? { ...p, status: 'error', stage: 'Error occurred' }
          : p
      ));
      throw error;
    }
  };

  const searchDocuments = async (query: string, category?: DocumentCategory): Promise<SearchResult[]> => {
    return searchService.search(documents, query, category);
  };

  const deleteDocument = (documentId: string) => {
    const stored = localStorage.getItem('docai_documents');
    const allDocuments = stored ? JSON.parse(stored) : [];
    const filtered = allDocuments.filter((doc: Document) => doc.id !== documentId);
    localStorage.setItem('docai_documents', JSON.stringify(filtered));
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
  };

  return {
    documents,
    loading,
    uploadProgress,
    uploadDocument,
    searchDocuments,
    deleteDocument,
    refreshDocuments: loadDocuments
  };
};