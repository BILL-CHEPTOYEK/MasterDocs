import { useState, useRef } from 'react';
import apiService from '../services/apiService';

const PdfMerge = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    setError('');
    const pdfFiles = newFiles.filter((file) => file.type === 'application/pdf');

    if (pdfFiles.length !== newFiles.length) {
      setError('Only PDF files are allowed');
    }

    if (pdfFiles.length === 0) {
      setError('Please select at least one PDF file');
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setError('');
  };

  const moveFile = (index, direction) => {
    const newFiles = [...files];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= files.length) return;

    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const clearAll = () => {
    setFiles([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const blob = await apiService.mergePdfs(files);
      apiService.downloadBlob(blob, 'merged.pdf');
      setIsUploading(false);
      clearAll();
    } catch (err) {
      setError('Failed to merge PDFs. Please try again.');
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-red-800 mb-2">
            Merge <span className="text-white bg-red-700 px-2 py-1 rounded-sm">PDFs</span> <span className="text-gray-400 text-base font-normal">by</span> <span className="text-gray-800 font-semibold">MasterDocs</span>
          </h1>
          <p className="text-gray-700 text-sm sm:text-base">
            Combine multiple PDF files into a single document
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-sm p-4 sm:p-8 text-center transition-colors ${
            isDragging
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300 bg-white hover:border-red-300'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf"
            onChange={handleFileInput}
            className="hidden"
            id="file-input"
          />
          
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>

          <label
            htmlFor="file-input"
            className="cursor-pointer text-red-700 hover:text-red-800 font-medium"
          >
            Choose PDF files
          </label>
          <span className="text-gray-700"> or drag and drop</span>
          <p className="text-xs text-gray-500 mt-2">PDF files only</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-sm">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6 bg-white rounded-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Selected Files ({files.length})
              </h3>
              <button
                onClick={clearAll}
                className="text-sm text-gray-600 hover:text-red-700 font-medium transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="divide-y divide-gray-200">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <svg
                      className="h-8 w-8 text-red-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => moveFile(index, 'up')}
                      disabled={index === 0}
                      className={`p-1 rounded-sm transition-colors ${
                        index === 0
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:text-red-700 hover:bg-gray-100'
                      }`}
                      title="Move up"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => moveFile(index, 'down')}
                      disabled={index === files.length - 1}
                      className={`p-1 rounded-sm transition-colors ${
                        index === files.length - 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-600 hover:text-red-700 hover:bg-gray-100'
                      }`}
                      title="Move down"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-sm transition-colors"
                      title="Remove"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Merge Button */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleMerge}
                disabled={files.length < 2 || isUploading}
                className={`w-full py-3 px-4 rounded-sm font-medium transition-colors ${
                  files.length < 2 || isUploading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-700 text-white hover:bg-red-800'
                }`}
              >
                {isUploading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Merging PDFs...
                  </span>
                ) : (
                  `Merge ${files.length} PDF${files.length > 1 ? 's' : ''}`
                )}
              </button>
              {files.length < 2 && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  Add at least 2 PDF files to merge
                </p>
              )}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            How it works
          </h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-sm bg-red-100 text-red-700 border border-red-700 flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <p className="ml-3 text-sm text-gray-600">
                Upload or drag and drop your PDF files
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-sm bg-red-100 text-red-700 border border-red-700 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <p className="ml-3 text-sm text-gray-600">
                Arrange files in your desired order using the arrow buttons
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-sm bg-red-100 text-red-700 border border-red-700 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <p className="ml-3 text-sm text-gray-600">
                Click merge and download your combined PDF file
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfMerge;
