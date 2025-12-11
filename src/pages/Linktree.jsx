import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MessageCircle, Mail, FileText, HelpCircle, Handshake, Wrench, Search, ArrowRight, ExternalLink } from 'lucide-react';

function Linktree() {
  const [searchTerm, setSearchTerm] = useState("");

  // Data Menu
  const allLinks = [
    { id: 1, text: "Order Sekarang (24/7)", icon: <ShoppingBag size={22} />, href: "#", type: "link", badge: "Hot" },
    { id: 2, text: "WhatsApp Admin", icon: <MessageCircle size={22} />, href: "#", type: "link" },
    { id: 3, text: "Tools Generator", icon: <Wrench size={22} />, href: "/tools", type: "route", highlight: true },
    { id: 4, text: "Akses Email", icon: <Mail size={22} />, href: "https://mail.belanjamu.app", type: "link", highlight: true },
    { id: 5, text: "Ketentuan Garansi", icon: <FileText size={22} />, href: "#", type: "link" },
    { id: 6, text: "FAQ / Pertanyaan", icon: <HelpCircle size={22} />, href: "#", type: "link" },
    { id: 7, text: "Gabung Reseller", icon: <Handshake size={22} />, href: "#", type: "link", badge: "Join" },
  ];

  // Logic Search
  const filteredLinks = allLinks.filter(link =>
    link.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0f0c29] relative flex flex-col items-center py-12 px-4 font-sans text-white overflow-hidden">

      {/* --- 1. ANIMATED BACKGROUND BLOBS --- */}
      {/* Style Animation khusus blob */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Blob Ungu */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        {/* Blob Biru */}
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        {/* Blob Pink (Bawah) */}
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* --- CONTENT WRAPPER (Z-Index tinggi agar di atas blob) --- */}
      <div className="w-full max-w-md z-10">

        {/* --- 2. PROFILE SECTION --- */}
        <div className="flex flex-col items-center mb-10 text-center">
          {/* Container Logo dengan Glow */}
          <div className="relative group mb-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative w-28 h-28 rounded-full border-4 border-[#1a1a2e] bg-[#1a1a2e] overflow-hidden shadow-2xl">
              {/* Logo Object Cover */}
              <img
                src="https://www.belanjamu.web.id/1_NEW-LOGO-WHITE.svg"
                alt="Logo Belanjamu"
                className="w-full h-full object-cover p-1"
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-lg">
            Belanjamu Web Id
          </h1>
          <p className="text-sm text-gray-300 mt-2 font-medium bg-white/10 px-4 py-1 rounded-full backdrop-blur-sm border border-white/5">
            ✨ Solusi Produk Digital Terbaik ✨
          </p>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="mb-8 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-gray-400" size={18} />
            </div>
            <input
                type="text"
                placeholder="Cari layanan..."
                className="w-full bg-[#1a1a2e]/60 backdrop-blur-md border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all placeholder-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* --- 3. BUTTON LIST (New Modern Hover) --- */}
        <div className="space-y-4">
          {filteredLinks.length > 0 ? (
            filteredLinks.map((item) => (
              <ModernButton key={item.id} item={item} />
            ))
          ) : (
             <div className="text-center p-8 bg-white/5 rounded-xl border border-white/5 border-dashed">
                <p className="text-gray-400">Layanan tidak ditemukan 😔</p>
             </div>
          )}
        </div>

      </div>

      <footer className="mt-16 text-xs text-gray-500 font-medium z-10">
        © 2025 Belanjamu Web Id.
      </footer>
    </div>
  );
}

// --- KOMPONEN TOMBOL MODERN (Glow & Scale) ---
function ModernButton({ item }) {
  // Konten tombol
  const ButtonContent = () => (
    <>
      <div className="flex items-center gap-4">
        {/* Icon Container */}
        <div className={`p-2 rounded-lg ${item.highlight ? 'bg-purple-500 text-white' : 'bg-white/10 text-gray-200'} group-hover:bg-white group-hover:text-purple-900 transition-colors duration-300`}>
           {item.icon}
        </div>

        {/* Text */}
        <div className="flex flex-col items-start">
            <span className="font-semibold text-lg tracking-wide group-hover:text-white text-gray-100 transition-colors">
                {item.text}
            </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
         {item.badge && (
             <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm">
                 {item.badge}
             </span>
         )}
         {/* Arrow slides in on hover */}
         <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-purple-400">
             {item.type === 'route' ? <ArrowRight size={18} /> : <ExternalLink size={18} />}
         </div>
      </div>
    </>
  );

  const baseClasses = `
    relative w-full flex items-center justify-between p-4 rounded-xl
    border border-white/10 bg-[#1e1b36]/80 backdrop-blur-sm
    transition-all duration-300 ease-out
    hover:scale-[1.02] hover:bg-[#2d2a4a] hover:border-purple-500/50
    hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]
    group cursor-pointer overflow-hidden
  `;

  if (item.type === 'route') {
    return (
      <Link to={item.href} className={baseClasses}>
        {/* Efek Kilat (Sheen) saat hover */}
        <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] group-hover:animate-sheen" />
        <ButtonContent />
      </Link>
    );
  }

  return (
    <a href={item.href} className={baseClasses}>
       <ButtonContent />
    </a>
  );
}

export default Linktree;