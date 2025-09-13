import React from 'react';
import { Document } from '../../types';
import { 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Users, 
  Calendar,
  PieChart,
  Activity
} from 'lucide-react';

interface AnalyticsProps {
  documents: Document[];
  userRole: string;
}

export const Analytics: React.FC<AnalyticsProps> = ({ documents, userRole }) => {
  // Calculate analytics
  const totalDocuments = documents.length;
  const categoryCounts = documents.reduce((acc, doc) => {
    acc[doc.category] = (acc[doc.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const uploaderCounts = documents.reduce((acc, doc) => {
    acc[doc.uploader] = (acc[doc.uploader] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentDocuments = documents
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, 7);

  const avgConfidence = documents.length > 0 
    ? documents.reduce((sum, doc) => sum + doc.metadata.confidence, 0) / documents.length 
    : 0;

  const totalSize = documents.reduce((sum, doc) => sum + doc.fileSize, 0);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getCategoryColor = (category: string, index: number): string => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-red-500',
      'bg-yellow-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{totalDocuments}</p>
              <p className="text-gray-600">Total Documents</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(avgConfidence * 100)}%
              </p>
              <p className="text-gray-600">Avg Confidence</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">
                {Object.keys(categoryCounts).length}
              </p>
              <p className="text-gray-600">Categories</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{formatFileSize(totalSize)}</p>
              <p className="text-gray-600">Total Size</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-blue-600" />
            Category Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(categoryCounts)
              .sort(([,a], [,b]) => b - a)
              .map(([category, count], index) => (
                <div key={category} className="flex items-center">
                  <div className="flex items-center flex-1">
                    <div className={`w-4 h-4 rounded ${getCategoryColor(category, index)} mr-3`} />
                    <span className="text-sm text-gray-700">{category}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 mr-2">{count}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getCategoryColor(category, index)}`}
                        style={{ width: `${(count / totalDocuments) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Top Contributors */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-600" />
            Top Contributors
          </h3>
          <div className="space-y-3">
            {Object.entries(uploaderCounts)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([uploader, count], index) => (
                <div key={uploader} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-gray-600">
                        {uploader.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700">{uploader}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-purple-600" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentDocuments.map((document, index) => (
            <div key={document.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded mr-3">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {document.metadata.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    by {document.uploader} • {document.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600">
                  {new Date(document.uploadDate).toLocaleDateString()}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryColor(document.category, index)}`}>
                  {Math.round(document.metadata.confidence * 100)}% confident
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Performance Metrics */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
          AI Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{Math.round(avgConfidence * 100)}%</p>
            <p className="text-sm text-gray-600">Average Classification Confidence</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {documents.filter(d => d.metadata.entities.length > 0).length}
            </p>
            <p className="text-sm text-gray-600">Documents with Extracted Entities</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">
              {documents.reduce((sum, d) => sum + d.tags.length, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Keywords Extracted</p>
          </div>
        </div>
      </div>
    </div>
  );
};