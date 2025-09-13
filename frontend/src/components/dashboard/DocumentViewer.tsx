import React from 'react';
import { Document } from '../../types';
import { 
  X, 
  Download, 
  Calendar, 
  User, 
  Tag, 
  FileText, 
  Brain,
  DollarSign,
  MapPin,
  Building,
  Clock
} from 'lucide-react';

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onClose }) => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const downloadDocument = () => {
    const blob = new Blob([document.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = document.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'MONEY':
        return <DollarSign className="w-4 h-4 text-green-600" />;
      case 'LOCATION':
        return <MapPin className="w-4 h-4 text-red-600" />;
      case 'ORGANIZATION':
        return <Building className="w-4 h-4 text-blue-600" />;
      case 'DATE':
        return <Clock className="w-4 h-4 text-orange-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{document.metadata.title}</h2>
                <p className="text-gray-600">{document.filename}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={downloadDocument}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Document Summary */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-600" />
                  AI-Generated Summary
                </h3>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed">{document.summary}</p>
                </div>
              </div>

              {/* Full Content */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Document Content</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {document.content}
                  </pre>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Document Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Document Details</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Author</p>
                      <p className="text-sm text-gray-900">{document.metadata.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Uploaded</p>
                      <p className="text-sm text-gray-900">{formatDate(document.uploadDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-gray-400 mr-3" />
                    <div>
                      <p className="text-xs text-gray-500">Size</p>
                      <p className="text-sm text-gray-900">{formatFileSize(document.fileSize)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Classification</h4>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {document.category}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Confidence</p>
                    <p className="text-sm font-medium text-gray-900">
                      {Math.round(document.metadata.confidence * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Extracted Entities */}
              {document.metadata.entities.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Extracted Entities</h4>
                  <div className="space-y-2">
                    {document.metadata.entities.slice(0, 5).map((entity, index) => (
                      <div key={index} className="flex items-center">
                        {getEntityIcon(entity.type)}
                        <div className="ml-3 flex-1">
                          <p className="text-sm text-gray-900">{entity.text}</p>
                          <p className="text-xs text-gray-500">{entity.type}</p>
                        </div>
                        <span className="text-xs text-gray-400">
                          {Math.round(entity.confidence * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {document.tags.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    Keywords
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {document.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Access Control */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Access Control</h4>
                <div className="space-y-2">
                  {document.accessLevel.map((level, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-sm mr-2"
                    >
                      {level}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};