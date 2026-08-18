import React, { useState, useRef } from 'react';
import { Upload, FileText, ImageIcon, File, X, Download, ExternalLink } from 'lucide-react';

export default function AttachmentSection({ attachments, onAdd, onRemove }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const simulateUpload = (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file)
        });
      }, 1500);
    });
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      const uploaded = await Promise.all(newFiles.map(simulateUpload));
      onAdd(uploaded);
    }
  };

  const handleFileSelect = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const uploaded = await Promise.all(newFiles.map(simulateUpload));
      onAdd(uploaded);
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.includes('image')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    if (type.includes('pdf')) return <FileText className="w-5 h-5 text-red-500" />;
    return <File className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
          isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 text-slate-400 mb-2" />
        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">Drop files here or click to upload</p>
        <input 
          type="file" 
          multiple 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileSelect} 
        />
      </div>

      {attachments.length > 0 && (
        <div className="mt-4 space-y-2">
          {attachments.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
              <div className="flex items-center gap-3 overflow-hidden">
                {getFileIcon(file.type)}
                <div className="truncate">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{file.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatSize(file.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md transition-colors" title="Open">
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md transition-colors" title="Download">
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={() => onRemove(index)} className="p-1.5 text-red-500 hover:text-red-700 bg-red-50 dark:bg-red-900/20 rounded-md transition-colors" title="Remove">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
