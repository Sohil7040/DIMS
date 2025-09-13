import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDocuments } from '../../hooks/useDocuments';
import { Sidebar } from './Sidebar';
import { DocumentGrid } from './DocumentGrid';
import { SearchBar } from './SearchBar';
import { UploadModal } from './UploadModal';
import { DocumentViewer } from './DocumentViewer';
import { Analytics } from './Analytics';
import { Document, SearchResult } from '../../types';
import { Menu, X } from 'lucide-react';

type ViewMode = 'documents' | 'analytics' | 'settings';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { documents, loading, uploadProgress, uploadDocument, searchDocuments, deleteDocument } = useDocuments(user?.role || 'All');
  
  const [viewMode, setViewMode] = useState<ViewMode>('documents');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const results = await searchDocuments(query);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUpload = async (files: File[]) => {
    for (const file of files) {
      try {
        await uploadDocument(file, user?.fullName || 'Unknown');
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
    setShowUpload(false);
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white p-2 rounded-lg shadow-md border border-gray-200"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar
        user={user}
        currentView={viewMode}
        onViewChange={setViewMode}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="md:ml-0 ml-12">
              <h1 className="text-2xl font-bold text-gray-900">
                {viewMode === 'documents' && 'Document Library'}
                {viewMode === 'analytics' && 'Analytics Dashboard'}
                {viewMode === 'settings' && 'Settings'}
              </h1>
              <p className="text-gray-600 mt-1">
                {viewMode === 'documents' && `Manage and search your ${documents.length} documents`}
                {viewMode === 'analytics' && 'Insights and performance metrics'}
                {viewMode === 'settings' && 'Configure your preferences'}
              </p>
            </div>
            
            {viewMode === 'documents' && (
              <div className="flex items-center gap-3">
                <SearchBar onSearch={handleSearch} isLoading={isSearching} />
                <button
                  onClick={() => setShowUpload(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
                >
                  Upload
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6">
          {viewMode === 'documents' && (
            <DocumentGrid
              documents={searchResults.length > 0 ? searchResults.map(r => r.document) : documents}
              searchResults={searchResults}
              loading={loading}
              uploadProgress={uploadProgress}
              onDocumentClick={setSelectedDocument}
              onDeleteDocument={deleteDocument}
              userRole={user.role}
            />
          )}
          
          {viewMode === 'analytics' && (
            <Analytics documents={documents} userRole={user.role} />
          )}
          
          {viewMode === 'settings' && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onUpload={handleUpload}
        />
      )}

      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
};