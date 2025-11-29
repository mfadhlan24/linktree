import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ArrowLeft, CreditCard, Search, Wrench, Lock, File } from 'lucide-react';

function ToolsMenu() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const toolsData = [
    {
      id: 1,
      name: "Student Card Generator",
      desc: "Buat kartu mahasiswa otomatis dengan foto hexagon dan layout custom.",
      icon: <CreditCard size={32} />,
      path: "/tools/student-card",
      category: "Generators",
      status: "active",
      color: "bg-blue-600"
    },
    {
      id: 2,
      name: "Refund Calculator",
      desc: "Hitung estimasi nilai refund produk digital berdasarkan masa pakai.",
      icon: <Calculator size={32} />,
      path: "/tools/refund-calculator", // UPDATED: Path sudah aktif
      category: "Calculators",
      status: "active", // UPDATED: Status Active
      color: "bg-purple-600"
    },
       {
      id: 3,
      name: "KRS Generator",
      desc: "Membantu membuat KRS digital dengan mudah dan cepat.",
      icon: <File size={32} />,
      path: "/tools/krs-generator", // UPDATED: Path sudah aktif
      category: "Generators",
      status: "active", // UPDATED: Status Active
      color: "bg-yellow-600"
    },
    // Bisa tambah tool lain di sini...
  ];

  const filteredTools = toolsData.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "All" || tool.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#0f0c29] relative font-sans text-white overflow-hidden p-6">

      {/* CSS KHUSUS UNTUK 8 HOVER ZONES */}
      <style>{`
        /* Container Setup */
        .hover-3d-wrapper {
          position: relative;
          perspective: 1000px;
        }

        /* Content Card */
        .hover-3d-content {
          transition: transform 0.3s ease-out;
          transform-style: preserve-3d;
          will-change: transform;
        }

        /* Setup Grid Zone (Invisible) */
        .hover-zone {
          position: absolute;
          z-index: 50;
          /* background: rgba(255,0,0,0.2); Uncomment untuk debug melihat posisi zone */
        }

        /* --- DEFINISI 8 ZONA & TRANSFORMASINYA --- */

        .z-tl { top: 0; left: 0; width: 33.33%; height: 33.33%; }
        .z-tl:hover ~ .hover-3d-content { transform: rotateX(10deg) rotateY(-10deg) scale(1.02); }

        .z-tc { top: 0; left: 33.33%; width: 33.33%; height: 33.33%; }
        .z-tc:hover ~ .hover-3d-content { transform: rotateX(10deg) scale(1.02); }

        .z-tr { top: 0; right: 0; width: 33.33%; height: 33.33%; }
        .z-tr:hover ~ .hover-3d-content { transform: rotateX(10deg) rotateY(10deg) scale(1.02); }

        .z-ml { top: 33.33%; left: 0; width: 33.33%; height: 33.33%; }
        .z-ml:hover ~ .hover-3d-content { transform: rotateY(-10deg) scale(1.02); }

        .z-mr { top: 33.33%; right: 0; width: 33.33%; height: 33.33%; }
        .z-mr:hover ~ .hover-3d-content { transform: rotateY(10deg) scale(1.02); }

        .z-bl { bottom: 0; left: 0; width: 33.33%; height: 33.33%; }
        .z-bl:hover ~ .hover-3d-content { transform: rotateX(-10deg) rotateY(-10deg) scale(1.02); }

        .z-bc { bottom: 0; left: 33.33%; width: 33.33%; height: 33.33%; }
        .z-bc:hover ~ .hover-3d-content { transform: rotateX(-10deg) scale(1.02); }

        .z-br { bottom: 0; right: 0; width: 33.33%; height: 33.33%; }
        .z-br:hover ~ .hover-3d-content { transform: rotateX(-10deg) rotateY(10deg) scale(1.02); }

        /* Animations Blob */
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>

      {/* Background Blobs */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 mt-4">
            <Link to="/linktree" className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition backdrop-blur-sm border border-white/10">
                <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Belanjamu Tools
              </h1>
              <p className="text-gray-400 mt-1">Kumpulan alat bantu produktivitas untuk Anda.</p>
            </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8 justify-between items-center bg-[#1a1a2e]/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md">
            <div className="relative w-full lg:w-96">
                <Search className="absolute left-3 top-3 text-gray-500" size={20} />
                <input
                    type="text"
                    placeholder="Cari tools..."
                    className="w-full bg-[#0f0c29] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-2 w-full lg:w-auto overflow-x-auto">
                {["All", "Generators", "Calculators"].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap border ${
                            activeTab === tab
                            ? "bg-purple-600 border-purple-500 text-white"
                            : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>

        {/* Grid Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTools.map((tool) => (
                <TiltCard key={tool.id} tool={tool} />
            ))}
        </div>

      </div>
    </div>
  );
}

// --- KOMPONEN KARTU TILT 3D (8 ZONES) ---
function TiltCard({ tool }) {
  const isActive = tool.status === "active";
  const Wrapper = isActive ? Link : 'div';

  return (
    <Wrapper
      to={tool.path}
      className={`hover-3d-wrapper block h-full ${!isActive ? 'cursor-not-allowed opacity-70 grayscale' : ''}`}
    >

      {/* 8 INVISIBLE HOVER ZONES */}
      <div className="hover-zone z-tl"></div>
      <div className="hover-zone z-tc"></div>
      <div className="hover-zone z-tr"></div>
      <div className="hover-zone z-ml"></div>
      <div className="hover-zone z-mr"></div>
      <div className="hover-zone z-bl"></div>
      <div className="hover-zone z-bc"></div>
      <div className="hover-zone z-br"></div>

      {/* CARD CONTENT */}
      <div className="hover-3d-content relative h-full p-6 bg-[#1e1b36] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">

          <div className={`absolute top-0 right-0 w-32 h-32 ${tool.color} blur-[60px] opacity-20 rounded-full pointer-events-none`}></div>

          <div className="flex justify-between items-start mb-4 pointer-events-none">
              <div className={`p-3 rounded-xl ${isActive ? 'bg-white/10 text-white' : 'bg-white/5 text-gray-500'}`}>
                  {tool.icon}
              </div>
              {!isActive && (
                  <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] uppercase tracking-wider text-gray-400 flex items-center gap-1">
                      <Lock size={10} /> Soon
                  </span>
              )}
          </div>

          <div className="pointer-events-none">
            <h3 className="text-xl font-bold mb-2 text-white">
                {tool.name}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
                {tool.desc}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-gray-500 pointer-events-none">
              <span>{tool.category}</span>
              {isActive && <span className="text-purple-400">Buka Tools →</span>}
          </div>
      </div>
    </Wrapper>
  );
}

export default ToolsMenu;