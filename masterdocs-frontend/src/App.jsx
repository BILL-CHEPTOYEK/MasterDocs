import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PdfMerge from './components/PdfMerge';
import PdfSplit from './components/PdfSplit';
import PdfCompress from './components/PdfCompress';
import PdfToImage from './components/PdfToImage';
import ImageToPdf from './components/ImageToPdf';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<PdfMerge />} />
          <Route path="/merge" element={<PdfMerge />} />
          <Route path="/split" element={<PdfSplit />} />
          <Route path="/compress" element={<PdfCompress />} />
          <Route path="/pdf-to-image" element={<PdfToImage />} />
          <Route path="/image-to-pdf" element={<ImageToPdf />} />
        </Routes>
      </div>
    </Router>
  );
}