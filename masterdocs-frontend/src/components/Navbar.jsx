import { useState } from 'react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg
                className="h-8 w-8 text-red-700"
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
              <span className="ml-2 text-xl font-semibold text-gray-900">
                MasterDocs
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <a
              href="#"
              className="text-gray-900 hover:text-red-700 px-3 py-2 text-sm font-medium transition-colors"
            >
              PDF Merge
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-red-700 px-3 py-2 text-sm font-medium transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-red-700 px-3 py-2 text-sm font-medium transition-colors"
            >
              Help
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-sm text-gray-600 hover:text-red-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-700 transition-colors"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a
              href="#"
              className="block text-gray-900 hover:text-red-700 hover:bg-gray-50 px-3 py-2 text-base font-medium rounded-sm transition-colors"
            >
              PDF Merge
            </a>
            <a
              href="#"
              className="block text-gray-600 hover:text-red-700 hover:bg-gray-50 px-3 py-2 text-base font-medium rounded-sm transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="block text-gray-600 hover:text-red-700 hover:bg-gray-50 px-3 py-2 text-base font-medium rounded-sm transition-colors"
            >
              Help
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
