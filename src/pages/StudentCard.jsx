import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { Rnd } from 'react-rnd';
import { Download, Upload, RefreshCw, Image as ImageIcon, Type, ArrowLeft, CheckCircle, Palette, CaseSensitive } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// --- DATA TEMPLATE KAMPUS ---
const TEMPLATES = [
  {
    id: 1,
    name: "STMIK PGRI Tangerang",
    file: "/student-card/template_pgri.jpg",
  },
  {
    id: 2,
    name: "Universitas Raharja",
    file: "/student-card/template_ur.jpg",
  },
];

// --- DAFTAR FONT ---
const AVAILABLE_FONTS = [
  { name: "Arial (Sans)", value: "Arial, sans-serif" },
  { name: "Times New Roman (Serif)", value: "'Times New Roman', serif" },
  { name: "Courier New (Mono)", value: "'Courier New', monospace" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { name: "Impact", value: "Impact, sans-serif" },
  { name: "Tahoma", value: "Tahoma, sans-serif" }
];

function StudentCard() {
  const cardRef = useRef(null);
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);

  // State untuk Data Teks
  const [formData, setFormData] = useState({
    fullName: 'FULL NAME',
    studentId: '2512200313',
    program: 'BACHELOR OF INFORMATICS ENGINEERING',
    dob: 'FEBRUARY 14, 2004',
    issuedDate: 'SEPTEMBER 1, 2023',
    expirationDate: 'SEPTEMBER 2027'
  });

  const [photo, setPhoto] = useState(null);

  // State Posisi (Default)
  const [photoState, setPhotoState] = useState({ x: 65, y: 160, width: 200, height: 230 });

  // State Text: Posisi, Scale, Warna, Font
  const [textState, setTextState] = useState({
    x: 340,
    y: 190,
    scale: 1,
    color: '#1e293b',
    fontFamily: "Arial, sans-serif"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleResetLayout = () => {
    setPhotoState({ x: 65, y: 160, width: 200, height: 230 });
    setTextState({ x: 340, y: 190, scale: 1, color: '#1e293b', fontFamily: "Arial, sans-serif" });
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      // Sembunyikan helper saat download
      const helpers = document.querySelectorAll('.resize-handle');
      helpers.forEach(el => el.style.opacity = '0');

      setTimeout(async () => {
        const canvas = await html2canvas(cardRef.current, {
          useCORS: true,
          scale: 2,
          backgroundColor: null
        });

        helpers.forEach(el => el.style.opacity = '1'); // Munculkan lagi

        const link = document.createElement('a');
        link.download = `StudentCard-${formData.studentId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }, 100);
    } catch (error) {
      console.error("Gagal generate gambar:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] relative flex flex-col items-center py-8 px-4 font-sans text-white overflow-hidden">
       {/* --- HELMET CONFIGURATION --- */}
      <Helmet>
        <title>Student Card Generator | Belanjamu Tools</title>
        <meta name="description" content="Buat kartu mahasiswa otomatis dengan fitur kustomisasi lengkap." />
      </Helmet>
      {/* --- BACKGROUND BLOBS ANIMATION --- */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
      `}</style>

      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* --- HEADER --- */}
      <div className="w-full max-w-[1400px] flex items-center justify-between mb-8 z-10">
         <div className="flex items-center gap-4">
            <Link to="/tools" className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition border border-white/10">
                <ArrowLeft size={24} />
            </Link>
            <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Student Card Generator</h1>
                <p className="text-xs text-gray-400">Drag & Drop Element Editor</p>
            </div>
         </div>
      </div>

      <div className="w-full max-w-[1400px] flex flex-col xl:flex-row items-start justify-center gap-8 z-10">

        {/* --- LEFT SIDEBAR (CONTROLS) --- */}
        <div className="w-full xl:w-1/4 bg-[#1e1b36]/80 backdrop-blur-md p-6 rounded-2xl shadow-2xl border border-white/10 h-fit max-h-[85vh] overflow-y-auto custom-scrollbar">

          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
            <h2 className="text-lg font-bold flex items-center gap-2">
                <CheckCircle size={18} className="text-purple-400" /> Konfigurasi
            </h2>
            <button onClick={handleResetLayout} title="Reset Posisi" className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded transition">
              <RefreshCw size={12} /> Reset Layout
            </button>
          </div>

          <div className="space-y-6">

            {/* 1. Pilih Template */}
            <div className="relative group">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Template</label>
              <div className="relative">
                <select
                  className="w-full p-3 pl-4 bg-[#0f0c29] border border-white/10 rounded-xl appearance-none text-sm text-white focus:outline-none focus:border-purple-500 transition shadow-inner"
                  onChange={(e) => setSelectedTemplate(TEMPLATES.find(t => t.id === parseInt(e.target.value)))}
                >
                  {TEMPLATES.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <ImageIcon className="absolute right-4 top-3.5 text-gray-500 w-4 h-4"/>
              </div>
            </div>

            {/* 2. Upload Foto */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Foto Mahasiswa</label>
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/10 rounded-xl hover:border-purple-500/50 hover:bg-white/5 cursor-pointer transition group">
                <Upload size={24} className="text-gray-500 group-hover:text-purple-400 mb-2 transition" />
                <span className="text-xs text-gray-500 group-hover:text-gray-300">Klik untuk upload foto</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              <p className="text-[10px] text-gray-500 mt-2 italic text-center">
                *Tips: Tarik sudut foto di preview kanan untuk resize.
              </p>
            </div>

            {/* 3. Text Styling (Scale, Color, Font) */}
            <div className="bg-[#0f0c29]/50 p-4 rounded-xl border border-white/5 space-y-4">
               {/* Scale */}
               <div>
                 <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider flex justify-between">
                    <span className="flex items-center gap-2"><Type size={14}/> Ukuran Teks</span>
                    <span className="text-purple-400">{Math.round(textState.scale * 100)}%</span>
                 </label>
                 <input
                    type="range" min="0.5" max="1.5" step="0.05"
                    value={textState.scale}
                    onChange={(e) => setTextState(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-[#1e1b36] rounded-lg appearance-none cursor-pointer accent-purple-500"
                 />
               </div>

               {/* Color & Font Family Grid */}
               <div className="grid grid-cols-2 gap-4">

                 {/* Color Picker */}
                 <div>
                   <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider flex items-center gap-2">
                      <Palette size={14}/> Warna
                   </label>
                   <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 hover:border-purple-500 transition shadow-lg shrink-0">
                        <input
                          type="color"
                          value={textState.color}
                          onChange={(e) => setTextState(prev => ({ ...prev, color: e.target.value }))}
                          className="absolute -top-1 -left-1 w-10 h-10 cursor-pointer p-0 border-0"
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono bg-[#1e1b36] px-1.5 py-1 rounded border border-white/10 uppercase truncate w-full">
                        {textState.color}
                      </span>
                   </div>
                 </div>

                 {/* Font Selector */}
                 <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider flex items-center gap-2">
                        <CaseSensitive size={14}/> Font
                    </label>
                    <select
                      className="w-full p-1.5 bg-[#1e1b36] border border-white/10 rounded text-xs text-white focus:outline-none focus:border-purple-500"
                      value={textState.fontFamily}
                      onChange={(e) => setTextState(prev => ({ ...prev, fontFamily: e.target.value }))}
                    >
                      {AVAILABLE_FONTS.map((font) => (
                        <option key={font.name} value={font.value}>{font.name}</option>
                      ))}
                    </select>
                 </div>

               </div>
            </div>

            {/* 4. Form Input */}
            <div className="space-y-4 pt-2">
              {[
                { label: 'Full Name', name: 'fullName' },
                { label: 'Student ID', name: 'studentId' },
                { label: 'Program / Major', name: 'program' },
                { label: 'Date of Birth', name: 'dob' },
                { label: 'Issued Date', name: 'issuedDate' },
                { label: 'Expiration Date', name: 'expirationDate' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">{field.label}</label>
                  <input
                    type="text"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-[#0f0c29] border border-white/10 rounded-lg text-sm text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500 focus:outline-none uppercase transition"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-purple-500/20 group"
            >
              <Download size={20} className="group-hover:-translate-y-1 transition-transform" />
              Download Kartu
            </button>
          </div>
        </div>

        {/* --- RIGHT AREA (PREVIEW CANVAS) --- */}
        <div className="flex-1 flex flex-col items-center justify-start min-h-[600px]">

          <div className="bg-[#1e1b36] p-4 rounded-2xl shadow-2xl border border-white/10">
             <div className="relative shadow-2xl rounded-lg overflow-hidden bg-white">
                {/* Canvas Utama */}
                <div
                  ref={cardRef}
                  className="relative w-[800px] h-[500px] bg-white overflow-hidden select-none"
                >
                  {/* LAYER 1: Background Template */}
                  <img
                    src={selectedTemplate.file}
                    alt="Template"
                    className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none z-0"
                  />

                  {/* LAYER 2: Resizable & Draggable PHOTO */}
                  <Rnd
                    size={{ width: photoState.width, height: photoState.height }}
                    position={{ x: photoState.x, y: photoState.y }}
                    onDragStop={(e, d) => setPhotoState(prev => ({ ...prev, x: d.x, y: d.y }))}
                    onResizeStop={(e, direction, ref, delta, position) => {
                      setPhotoState({
                        width: ref.style.width,
                        height: ref.style.height,
                        ...position,
                      });
                    }}
                    lockAspectRatio={false}
                    bounds="parent"
                    className="z-10 group"
                  >
                    <div className="w-full h-full relative">
                      {/* Visual Helper Border */}
                      <div className="resize-handle absolute -inset-1 border-2 border-dashed border-transparent group-hover:border-purple-500 z-50 pointer-events-none transition-colors rounded-lg opacity-70" />

                      {/* Hexagon Shape */}
                      <div className="w-full h-full clip-hexagon bg-gray-200 overflow-hidden shadow-inner">
                        {photo ? (
                          <img src={photo} alt="Student" className="w-full h-full object-cover pointer-events-none" />
                        ) : (
                          <div className="w-full h-full bg-slate-200 flex flex-col items-center justify-center text-slate-400">
                            <ImageIcon size={32} className="opacity-50 mb-2"/>
                            <span className="text-xs font-bold">No Photo</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Rnd>

                  {/* LAYER 3: Draggable TEXT INFO (With Scale, Color & Font) */}
                  <Rnd
                    position={{ x: textState.x, y: textState.y }}
                    onDragStop={(e, d) => setTextState(prev => ({ ...prev, x: d.x, y: d.y }))}
                    enableResizing={false}
                    bounds="parent"
                    className="z-20 group"
                  >
                    <div
                      className="resize-handle p-2 border-2 border-transparent group-hover:border-dashed group-hover:border-purple-500 rounded cursor-move relative"
                      // Terapkan style dinamis di sini
                      style={{
                        transform: `scale(${textState.scale})`,
                        transformOrigin: 'top left',
                        color: textState.color,
                        fontFamily: textState.fontFamily // Font aktif
                      }}
                    >
                      {/* Drag Handle Indicator */}
                      <div className="absolute -top-3 -right-3 bg-purple-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm">
                          <Type size={10} />
                      </div>

                      <div className="w-[420px] text-[18px] leading-tight font-bold">
                        <div className="grid grid-cols-[140px_20px_1fr] gap-y-[14px]">

                          <div>FULL NAME</div>
                          <div className="text-center">:</div>
                          <div className="uppercase">{formData.fullName}</div>

                          <div>STUDENT ID</div>
                          <div className="text-center">:</div>
                          <div className="uppercase">{formData.studentId}</div>

                          <div>PROGRAM /<br/>MAJOR</div>
                          <div className="text-center pt-2">:</div>
                          <div className="uppercase pt-2 leading-snug">{formData.program}</div>

                          <div className="pt-2">DOB</div>
                          <div className="text-center pt-2">:</div>
                          <div className="uppercase pt-2">{formData.dob}</div>

                          <div>ISSUED DATE</div>
                          <div className="text-center">:</div>
                          <div className="uppercase">{formData.issuedDate}</div>

                          <div>EXPIRATION DATE</div>
                          <div className="text-center">:</div>
                          <div className="uppercase">{formData.expirationDate}</div>

                        </div>
                      </div>
                    </div>
                  </Rnd>

                </div>
             </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-gray-500 text-sm bg-white/5 px-4 py-2 rounded-full border border-white/5">
             <RefreshCw size={14} className="animate-spin-slow" />
             <span>Preview diperbarui secara otomatis (Real-time).</span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default StudentCard;