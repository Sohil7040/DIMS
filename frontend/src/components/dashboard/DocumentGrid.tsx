import React from 'react';
import { Document, SearchResult, UploadProgress } from '../../types';
import { DocumentCard } from './DocumentCard';
import { UploadProgressCard } from './UploadProgressCard';
import { FileText } from 'lucide-react';

interface DocumentGridProps {
  documents: Document[];
  searchResults: SearchResult[];
  loading: boolean;
  uploadProgress: UploadProgress[];
  onDocumentClick: (document: Document) => void;
  onDeleteDocument: (documentId: string) => void;
  userRole: string;
}

export const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  searchResults,
  loading,
  uploadProgress,
  onDocumentClick,
  onDeleteDocument,
  userRole
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }

  const hasDocuments = documents.length > 0;
  const hasUploadProgress = uploadProgress.length > 0;
  const hasSearchResults = searchResults.length > 0;

  return (
    <div className="space-y-6">
      {/* Upload Progress */}
      {hasUploadProgress && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Processing Files</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {uploadProgress.map((progress) => (
              <UploadProgressCard key={progress.filename} progress={progress} />
            ))}
          </div>
        </div>
      )}

      {/* Search Results Info */}
      {hasSearchResults && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            Found {searchResults.length} document{searchResults.length !== 1 ? 's' : ''} matching your search
          </p>
        </div>
      )}

      {/* Documents Grid */}
      {hasDocuments ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onClick={onDocumentClick}
              onDelete={userRole === 'Admin' ? onDeleteDocument : undefined}
              searchResult={searchResults.find(r => r.document.id === document.id)}
            />
          ))}
        </div>
      ) : !hasUploadProgress ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600 mb-6">
            {hasSearchResults 
              ? "No documents match your search criteria. Try a different search term."
              : "Upload your first document to get started with AI-powered classification and search."
            }
          </p>
        </div>
      ) : null}
    </div>
  );
};