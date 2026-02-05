const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
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
