import React from 'react';
import { Document, SearchResult } from '../../types';
import { FileText, Calendar, User, Tag, Trash2, Download, DollarSign, Building, Scale, Contact as FileContract, Settings, TrendingUp } from 'lucide-react';

interface DocumentCardProps {
  document: Document;
  onClick: (document: Document) => void;
  onDelete?: (documentId: string) => void;
  searchResult?: SearchResult;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Finance': <DollarSign className="w-5 h-5" />,
  'HR': <User className="w-5 h-5" />,
  'Legal': <Scale className="w-5 h-5" />,
  'Contracts': <FileContract className="w-5 h-5" />,
  'Technical Reports': <Settings className="w-5 h-5" />,
  'Marketing': <TrendingUp className="w-5 h-5" />,
  'Operations': <Building className="w-5 h-5" />,
  'Uncategorized': <FileText className="w-5 h-5" />
};

const categoryColors: Record<string, string> = {
  'Finance': 'bg-green-100 text-green-700 border-green-200',
  'HR': 'bg-blue-100 text-blue-700 border-blue-200',
  'Legal': 'bg-purple-100 text-purple-700 border-purple-200',
  'Contracts': 'bg-orange-100 text-orange-700 border-orange-200',
  'Technical Reports': 'bg-gray-100 text-gray-700 border-gray-200',
  'Marketing': 'bg-pink-100 text-pink-700 border-pink-200',
  'Operations': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Uncategorized': 'bg-gray-100 text-gray-600 border-gray-200'
};

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onClick,
  onDelete,
  searchResult
}) => {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const downloadDocument = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Create a blob with the document content
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

  const deleteDocument = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete && confirm('Are you sure you want to delete this document?')) {
      onDelete(document.id);
    }
  };

  return (
    <div 
      onClick={() => onClick(document)}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg border ${categoryColors[document.category]} mr-3`}>
            {categoryIcons[document.category]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-sm">
              {document.metadata.title}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {document.filename}
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={downloadDocument}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>
          {onDelete && (
            <button
              onClick={deleteDocument}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Badge */}
      <div className="mb-3">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${categoryColors[document.category]}`}>
          {document.category}
        </span>
      </div>

      {/* Summary */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {searchResult ? (
          <span dangerouslySetInnerHTML={{ __html: searchResult.highlightedSummary }} />
        ) : (
          document.summary
        )}
      </p>

      {/* Search Relevance */}
      {searchResult && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Relevance</span>
            <span>{Math.round(searchResult.relevanceScore)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(searchResult.relevanceScore, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-xs text-gray-500">
          <User className="w-3 h-3 mr-2" />
          <span className="truncate">{document.metadata.author}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-2" />
          <span>{formatDate(document.uploadDate)}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <FileText className="w-3 h-3 mr-2" />
          <span>{formatFileSize(document.fileSize)}</span>
        </div>
      </div>

      {/* Tags */}
      {document.tags.length > 0 && (
        <div className="flex items-center space-x-1 flex-wrap">
          <Tag className="w-3 h-3 text-gray-400" />
          {document.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {document.tags.length > 3 && (
            <span className="text-xs text-gray-500">+{document.tags.length - 3}</span>
          )}
        </div>
      )}
    </div>
  );
};