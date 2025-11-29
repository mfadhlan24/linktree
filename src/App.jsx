import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Linktree from './pages/Linktree';
import ToolsMenu from './pages/ToolsMenu';
import StudentCard from './pages/StudentCard';
import RefundCalculator from './pages/RefundCalculator'; // Import halaman baru
import KRSgenerator from './pages/KRSGenerator';

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Utama Default langsung ke Linktree */}
        <Route path="/" element={<Navigate to="/linktree" replace />} />

        {/* Halaman Linktree */}
        <Route path="/linktree" element={<Linktree />} />

        {/* Halaman Menu Tools */}
        <Route path="/tools" element={<ToolsMenu />} />

        {/* Tools: Student Card */}
        <Route path="/tools/student-card" element={<StudentCard />} />

        {/* Tools: Refund Calculator (NEW) */}
        <Route path="/tools/refund-calculator" element={<RefundCalculator />} />
        
        {/* Tools: KRS Generator (NEW) */}
        <Route path="/tools/krs-generator" element={<KRSgenerator />} />
      </Routes>
    </Router>
  );
}

export default App;