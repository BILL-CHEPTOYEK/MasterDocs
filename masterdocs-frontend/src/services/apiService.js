const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  // PDF Merge
  async mergePdfs(files) {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/pdfmerge/merge`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to merge PDFs');
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error merging PDFs:', error);
      throw error;
    }
  }

  // PDF Split - By Ranges
  async splitPdfByRanges(file, ranges) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('ranges', ranges);

    try {
      const response = await fetch(`${API_BASE_URL}/pdfsplit/split-by-ranges`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to split PDF');
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error splitting PDF:', error);
      throw error;
    }
  }

  // PDF Split - Every Page
  async splitPdfEveryPage(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/pdfsplit/split-every-page`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to split PDF');
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error splitting PDF:', error);
      throw error;
    }
  }

  // PDF Split - Extract Pages
  async extractPages(file, pages) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pages', pages);

    try {
      const response = await fetch(`${API_BASE_URL}/pdfsplit/extract-pages`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract pages');
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error extracting pages:', error);
      throw error;
    }
  }

  // Get PDF Page Count
  async getPageCount(file) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/pdfsplit/page-count`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to get page count');
      }

      const count = await response.json();
      return count;
    } catch (error) {
      console.error('Error getting page count:', error);
      throw error;
    }
  }

  // PDF Compression
  async compressPdf(file, quality) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('quality', quality);

    try {
      const response = await fetch(`${API_BASE_URL}/pdfcompress/compress`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to compress PDF');
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error compressing PDF:', error);
      throw error;
    }
  }

  // PDF to Images
  async pdfToImages(file, format, dpi) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);
    formData.append('dpi', dpi);

    try {
      const response = await fetch(`${API_BASE_URL}/pdftoimage/convert`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to convert PDF to images');
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error converting PDF to images:', error);
      throw error;
    }
  }

  // Images to PDF
  async imagesToPdf(files) {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/imagetopdf/convert`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to convert images to PDF');
      }

      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error converting images to PDF:', error);
      throw error;
    }
  }

  // Download Blob Helper
  downloadBlob(blob, filename = 'merged.pdf') {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export default new ApiService();
