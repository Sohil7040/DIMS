import React from 'react';
import { UploadProgress } from '../../types';
import { Upload, CheckCircle, XCircle, Loader } from 'lucide-react';

interface UploadProgressCardProps {
  progress: UploadProgress;
}

export const UploadProgressCard: React.FC<UploadProgressCardProps> = ({ progress }) => {
  const getStatusIcon = () => {
    switch (progress.status) {
      case 'uploading':
        return <Upload className="w-5 h-5 text-blue-600" />;
      case 'processing':
        return <Loader className="w-5 h-5 text-orange-600 animate-spin" />;
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Upload className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (progress.status) {
      case 'uploading':
        return 'border-blue-200 bg-blue-50';
      case 'processing':
        return 'border-orange-200 bg-orange-50';
      case 'complete':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getProgressColor = () => {
    switch (progress.status) {
      case 'uploading':
        return 'bg-blue-600';
      case 'processing':
        return 'bg-orange-600';
      case 'complete':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor()}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          {getStatusIcon()}
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 truncate">
              {progress.filename}
            </p>
            <p className="text-xs text-gray-600">
              {progress.stage}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/60 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
          style={{ width: `${progress.progress}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-600">
          {progress.status === 'complete' ? 'Processing complete' : `${Math.round(progress.progress)}%`}
        </span>
        {progress.status === 'error' && (
          <span className="text-xs text-red-600 font-medium">
            Failed to process
          </span>
        )}
      </div>
    </div>
  );
};