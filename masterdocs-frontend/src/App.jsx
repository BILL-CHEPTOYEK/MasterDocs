import Navbar from './components/Navbar';
import PdfMerge from './components/PdfMerge';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PdfMerge />
    </div>
  );
}