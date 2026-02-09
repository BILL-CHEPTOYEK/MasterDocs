import { useState, useRef } from 'react';
import apiService from '../services/apiService';

const PdfCompress = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(0.7);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelect(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCompress = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      const blob = await apiService.compressPdf(file, quality);
      apiService.downloadBlob(blob, 'compressed.pdf');
      setIsProcessing(false);
    } catch (err) {
      setError('Failed to compress PDF. Please try again.');
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

  const getQualityLabel = () => {
    if (quality >= 0.8) return 'High Quality (Larger size)';
    if (quality >= 0.5) return 'Medium Quality (Balanced)';
    return 'Low Quality (Smaller size)';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-red-800 mb-2">
            Compress <span className="text-white bg-red-700 px-2 py-1 rounded-sm">PDF</span> Files
          </h1>
          <p className="text-gray-700 text-sm sm:text-base">
            Reduce PDF file size for email, WhatsApp, and web uploads
          </p>
        </div>

        {/* File Upload */}
        {!file && (
          <div className="bg-white border border-gray-300 rounded-sm p-4 sm:p-8 text-center">
            <input
              ref={fileInputRef}
              type="file"
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>

            <label
              htmlFor="file-input"
              className="cursor-pointer text-red-700 hover:text-red-800 font-medium"
            >
              Choose PDF file
            </label>
            <p className="text-xs text-gray-500 mt-2">PDF files only</p>
          </div>
        )}

        {/* File Info & Compress Options */}
        {file && (
          <div className="bg-white border border-gray-200 rounded-sm">
            {/* File Info */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
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
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="ml-4 text-gray-600 hover:text-red-600 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Quality Slider */}
            <div className="p-4 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Compression Level
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-sm appearance-none cursor-pointer accent-red-700"
                />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Max Compression</span>
                  <span className="font-medium text-gray-900">{getQualityLabel()}</span>
                  <span>Best Quality</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-b border-red-200">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Compress Button */}
            <div className="p-4 bg-gray-50">
              <button
                onClick={handleCompress}
                disabled={isProcessing}
                className={`w-full py-3 px-4 rounded-sm font-medium transition-colors ${
                  isProcessing
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
                    Compressing...
                  </span>
                ) : (
                  'Compress PDF'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-white border border-gray-200 rounded-sm p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">When to Compress</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-sm bg-red-100 text-red-700 flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <p className="ml-3 text-sm text-gray-600">
                <strong>Email:</strong> Most email providers limit attachments to 25MB
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-sm bg-red-100 text-red-700 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <p className="ml-3 text-sm text-gray-600">
                <strong>WhatsApp:</strong> 16MB limit for document sharing
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-sm bg-red-100 text-red-700 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <p className="ml-3 text-sm text-gray-600">
                <strong>Portals:</strong> Many online forms have 10-15MB upload limits
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfCompress;
