import { useState, useRef } from 'react';
import apiService from '../services/apiService';

const ImageToPdf = () => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
    const imageFiles = newFiles.filter((file) =>
      file.type.startsWith('image/')
    );

    if (imageFiles.length !== newFiles.length) {
      setError('Only image files are allowed');
    }

    if (imageFiles.length === 0) {
      setError('Please select at least one image file');
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...imageFiles]);
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

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select at least one image file');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const blob = await apiService.imagesToPdf(files);
      apiService.downloadBlob(blob, 'images_to_pdf.pdf');
      setIsProcessing(false);
      clearAll();
    } catch (err) {
      setError('Failed to convert images to PDF. Please try again.');
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-red-800 mb-2">
            Images to <span className="text-white bg-red-700 px-2 py-1 rounded-sm">PDF</span>
          </h1>
          <p className="text-gray-700 text-sm sm:text-base">
            Convert JPG, PNG, and other images to PDF document
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
            accept="image/*"
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>

          <label
            htmlFor="file-input"
            className="cursor-pointer text-red-700 hover:text-red-800 font-medium"
          >
            Choose image files
          </label>
          <span className="text-gray-700"> or drag and drop</span>
          <p className="text-xs text-gray-500 mt-2">JPG, PNG, GIF, BMP, etc.</p>
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
                Selected Images ({files.length})
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
                      className="h-8 w-8 text-green-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
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

            {/* Convert Button */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <button
                onClick={handleConvert}
                disabled={files.length === 0 || isProcessing}
                className={`w-full py-3 px-4 rounded-sm font-medium transition-colors ${
                  files.length === 0 || isProcessing
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-700 text-white hover:bg-red-800'
                }`}
              >
                {isProcessing ? (
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
                    Converting...
                  </span>
                ) : (
                  `Convert ${files.length} Image${files.length > 1 ? 's' : ''} to PDF`
                )}
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-white border border-gray-200 rounded-sm p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Uses</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-sm bg-red-100 text-red-700 flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <p className="ml-3 text-sm text-gray-600">
                Convert scanned documents to PDF format
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-sm bg-red-100 text-red-700 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <p className="ml-3 text-sm text-gray-600">
                Create PDF from photos for professional submissions
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-sm bg-red-100 text-red-700 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <p className="ml-3 text-sm text-gray-600">
                Combine multiple screenshots into a single PDF document
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageToPdf;
