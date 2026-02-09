import { useState, useRef } from 'react';
import apiService from '../services/apiService';

const PdfSplit = () => {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [splitMode, setSplitMode] = useState('ranges'); // 'ranges', 'every-page', 'extract'
  const [ranges, setRanges] = useState('');
  const [selectedPages, setSelectedPages] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file');
      return;
    }

    setFile(selectedFile);
    setError('');

    try {
      const count = await apiService.getPageCount(selectedFile);
      setPageCount(count);
    } catch (err) {
      setError('Failed to read PDF file');
      setFile(null);
    }
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    handleFileSelect(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPageCount(0);
    setRanges('');
    setSelectedPages('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateRanges = () => {
    if (!ranges.trim()) {
      setError('Please enter page ranges (e.g., 1-3, 5, 7-9)');
      return false;
    }

    const rangePattern = /^(\d+(-\d+)?)(,\s*\d+(-\d+)?)*$/;
    if (!rangePattern.test(ranges.trim())) {
      setError('Invalid format. Use: 1-3, 5, 7-9');
      return false;
    }

    return true;
  };

  const validateSelectedPages = () => {
    if (!selectedPages.trim()) {
      setError('Please enter page numbers (e.g., 1, 3, 5)');
      return false;
    }

    const pagesPattern = /^\d+(,\s*\d+)*$/;
    if (!pagesPattern.test(selectedPages.trim())) {
      setError('Invalid format. Use: 1, 3, 5');
      return false;
    }

    return true;
  };

  const handleSplit = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      let blob;
      let filename;

      if (splitMode === 'ranges') {
        if (!validateRanges()) {
          setIsProcessing(false);
          return;
        }
        blob = await apiService.splitPdfByRanges(file, ranges);
        filename = 'split_pdfs.zip';
      } else if (splitMode === 'every-page') {
        blob = await apiService.splitPdfEveryPage(file);
        filename = 'split_pages.zip';
      } else if (splitMode === 'extract') {
        if (!validateSelectedPages()) {
          setIsProcessing(false);
          return;
        }
        blob = await apiService.extractPages(file, selectedPages);
        filename = 'extracted_pages.pdf';
      }

      apiService.downloadBlob(blob, filename);
      setIsProcessing(false);
    } catch (err) {
      setError('Failed to split PDF. Please check your input and try again.');
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
            Split <span className="text-white bg-red-700 px-2 py-1 rounded-sm">PDF</span> Files
          </h1>
          <p className="text-gray-700 text-sm sm:text-base">
            Extract pages or split PDF into multiple documents
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
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

        {/* File Info & Split Options */}
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
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)} • {pageCount} pages
                  </p>
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

            {/* Split Mode Selection */}
            <div className="p-4 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Split Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="ranges"
                    checked={splitMode === 'ranges'}
                    onChange={(e) => setSplitMode(e.target.value)}
                    className="h-4 w-4 text-red-700 focus:ring-red-700"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Split by page ranges (creates multiple PDFs in a ZIP)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="every-page"
                    checked={splitMode === 'every-page'}
                    onChange={(e) => setSplitMode(e.target.value)}
                    className="h-4 w-4 text-red-700 focus:ring-red-700"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Split every page (creates one PDF per page in a ZIP)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="extract"
                    checked={splitMode === 'extract'}
                    onChange={(e) => setSplitMode(e.target.value)}
                    className="h-4 w-4 text-red-700 focus:ring-red-700"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Extract specific pages (creates one PDF with selected pages)
                  </span>
                </label>
              </div>
            </div>

            {/* Input Fields */}
            <div className="p-4 border-b border-gray-200">
              {splitMode === 'ranges' && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Page Ranges
                  </label>
                  <input
                    type="text"
                    value={ranges}
                    onChange={(e) => setRanges(e.target.value)}
                    placeholder="e.g., 1-3, 5, 7-9"
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter page ranges separated by commas. Example: 1-3, 5, 7-9
                  </p>
                </div>
              )}

              {splitMode === 'extract' && (
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Page Numbers
                  </label>
                  <input
                    type="text"
                    value={selectedPages}
                    onChange={(e) => setSelectedPages(e.target.value)}
                    placeholder="e.g., 1, 3, 5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter page numbers separated by commas. Example: 1, 3, 5
                  </p>
                </div>
              )}

              {splitMode === 'every-page' && (
                <p className="text-sm text-gray-600">
                  This will create {pageCount} separate PDF files, one for each page.
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border-b border-red-200">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Split Button */}
            <div className="p-4 bg-gray-50">
              <button
                onClick={handleSplit}
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
                    Processing...
                  </span>
                ) : (
                  'Split PDF'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-white border border-gray-200 rounded-sm p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Split Options</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-sm bg-red-100 text-red-700 flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <p className="ml-3 text-sm text-gray-600">
                <strong>By Ranges:</strong> Split into multiple sections (e.g., 1-3, 5, 7-9)
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-sm bg-red-100 text-red-700 flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <p className="ml-3 text-sm text-gray-600">
                <strong>Every Page:</strong> Create separate PDF for each page
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-sm bg-red-100 text-red-700 flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <p className="ml-3 text-sm text-gray-600">
                <strong>Extract Pages:</strong> Create one PDF with selected pages only
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfSplit;
