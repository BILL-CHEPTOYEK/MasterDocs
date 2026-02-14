import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tools = [
    {
      id: 1,
      title: 'Merge PDF',
      description: 'Combine multiple PDF files into a single document',
      icon: (
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      path: '/merge',
      color: 'from-red-600 to-red-800',
      delay: 0
    },
    {
      id: 2,
      title: 'Split PDF',
      description: 'Extract pages or split PDF into multiple files',
      icon: (
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12M8 12h12m-12 5h12M3 7h.01M3 12h.01M3 17h.01" />
        </svg>
      ),
      path: '/split',
      color: 'from-red-700 to-red-900',
      delay: 0.2
    },
    {
      id: 3,
      title: 'Compress PDF',
      description: 'Reduce PDF file size without losing quality',
      icon: (
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      ),
      path: '/compress',
      color: 'from-gray-700 to-gray-900',
      delay: 0.4
    },
    {
      id: 4,
      title: 'PDF to Image',
      description: 'Convert PDF pages into high-quality images',
      icon: (
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      path: '/pdf-to-image',
      color: 'from-gray-600 to-gray-800',
      delay: 0.6
    },
    {
      id: 5,
      title: 'Image to PDF',
      description: 'Convert images to PDF documents instantly',
      icon: (
        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      path: '/image-to-pdf',
      color: 'from-red-500 to-red-700',
      delay: 0.8
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16 pt-8">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Master Your <span className="text-red-700">Documents</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional PDF tools at your fingertips. Fast, secure, and easy to use.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className={`tool-card group rounded-full flex flex-col items-center justify-center mx-auto ${mounted ? 'bounce-in' : ''}`}
              style={{ animationDelay: `${tool.delay}s` }}
              onClick={() => navigate(tool.path)}
            >
              <div className="tool-card-inner flex flex-col items-center justify-center">
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full`}></div>
                <div className="relative z-10 flex flex-col items-center justify-center p-6">
                  <div className="flex justify-center mb-3 text-red-700 group-hover:text-white transition-colors duration-300 transform group-hover:scale-110">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {tool.icon.props.children}
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1.5 group-hover:text-white transition-colors duration-300 text-center">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-gray-600 mb-3 group-hover:text-gray-100 transition-colors duration-300 text-center leading-tight">
                    {tool.description}
                  </p>
                  <button className="tool-button mt-1">
                    <span className="text-sm">Get Started</span>
                    <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mt-20 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h4>
              <p className="text-gray-600">Process your documents in seconds with our optimized tools</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h4>
              <p className="text-gray-600">Your files are processed securely and never stored</p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Professional Quality</h4>
              <p className="text-gray-600">Industry-standard output with no quality loss</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
