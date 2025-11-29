import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { ArrowLeft, Calculator, Download, RefreshCw, Calendar, User, Tag, Clock } from 'lucide-react';

function RefundCalculator() {
  const resultRef = useRef(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  // --- STATE FORM INPUT ---
  const [formData, setFormData] = useState({
    productName: '',
    customerName: '',
    price: '',
    purchaseDate: '',
    issueDate: '', // Tanggal Kendala
    activePeriod: 30 // Default 30 hari
  });

  // --- STATE HASIL ---
  const [calculation, setCalculation] = useState({
    daysUsed: 0,
    usageCost: 0,
    refundAmount: 0,
    refundId: ''
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- LOGIKA PERHITUNGAN ---
  const handleCalculate = () => {
    setLoading(true);

    // Simulasi loading sebentar biar keren
    setTimeout(() => {
      const { price, purchaseDate, issueDate, activePeriod } = formData;

      // 1. Validasi
      if (!price || !purchaseDate || !issueDate) {
        alert("Harap lengkapi semua data!");
        setLoading(false);
        return;
      }

      // 2. Hitung Selisih Hari
      const start = new Date(purchaseDate);
      const end = new Date(issueDate);
      const diffTime = Math.abs(end - start);
      let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Jika tanggal kendala sama dengan beli, hitung 1 hari atau 0 hari
      if (diffDays < 0) diffDays = 0;
      if (diffDays > activePeriod) diffDays = activePeriod; // Tidak mungkin pakai lebih dari masa aktif

      // 3. Hitung Nominal
      const priceNum = parseFloat(price);
      const periodNum = parseInt(activePeriod);

      const costPerDay = priceNum / periodNum;
      const usageCost = Math.floor(costPerDay * diffDays);
      const refundAmount = Math.floor(priceNum - usageCost);

      // 4. Set Hasil
      setCalculation({
        daysUsed: diffDays,
        usageCost: usageCost,
        refundAmount: refundAmount > 0 ? refundAmount : 0,
        refundId: `#REF-${Math.floor(100000 + Math.random() * 900000)}` // Generate ID Random
      });

      setShowResult(true);
      setLoading(false);
    }, 800);
  };

  // --- LOGIKA EXPORT PDF ---
  const handleDownloadPDF = async () => {
    if (!resultRef.current) return;

    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2, // Resolusi tinggi
        backgroundColor: '#1e1b36', // Warna background PDF (HEX agar aman)
        useCORS: true,
        logging: true,
        onclone: (clonedDoc) => {
            // Fix tambahan jika elemen tertentu masih bermasalah saat dikloning
            const element = clonedDoc.querySelector('.pdf-container');
            if(element) {
                element.style.color = '#ffffff'; // Force text color putih
            }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Hitung rasio agar pas di A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Refund_${formData.customerName || 'Customer'}.pdf`);
    } catch (error) {
      console.error("Gagal export PDF", error);
      alert("Gagal membuat PDF. Coba gunakan browser Chrome/Firefox terbaru.");
    }
  };

  // Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  // Format Tanggal Indo
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white p-6 font-sans relative overflow-hidden">

      {/* Background Blobs */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
            <Link to="/tools" className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition border border-white/10">
                <ArrowLeft size={24} />
            </Link>
            <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Kalkulator Refund
                </h1>
                <p className="text-gray-400 text-sm">Hitung nilai pengembalian dana prorata otomatis.</p>
            </div>
        </div>

        {!showResult ? (
          /* --- FORM INPUT VIEW --- */
          <div className="bg-[#1e1b36] p-8 rounded-3xl border border-white/10 shadow-2xl animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Kolom Kiri */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Nama Produk</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3 text-gray-500" size={18}/>
                    <input
                      type="text"
                      name="productName"
                      placeholder="Contoh: Capcut Pro"
                      value={formData.productName}
                      onChange={handleChange}
                      className="w-full bg-[#0f0c29] border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:border-purple-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Username Customer</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-500" size={18}/>
                    <input
                      type="text"
                      name="customerName"
                      placeholder="Contoh: belanjamu"
                      value={formData.customerName}
                      onChange={handleChange}
                      className="w-full bg-[#0f0c29] border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:border-purple-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Harga Produk (Rp)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500 font-bold text-sm">Rp</span>
                    <input
                      type="number"
                      name="price"
                      placeholder="0"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full bg-[#0f0c29] border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:border-purple-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Tanggal Pembelian</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-500" size={18}/>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={formData.purchaseDate}
                      onChange={handleChange}
                      className="w-full bg-[#0f0c29] border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:border-purple-500 focus:outline-none transition text-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Tanggal Kendala</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-500" size={18}/>
                    <input
                      type="date"
                      name="issueDate"
                      value={formData.issueDate}
                      onChange={handleChange}
                      className="w-full bg-[#0f0c29] border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:border-purple-500 focus:outline-none transition text-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Total Masa Aktif (Hari)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 text-gray-500" size={18}/>
                    <input
                      type="number"
                      name="activePeriod"
                      value={formData.activePeriod}
                      onChange={handleChange}
                      className="w-full bg-[#0f0c29] border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:border-purple-500 focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

            </div>

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition shadow-lg shadow-purple-500/20"
            >
              {loading ? (
                <>Menghitung...</>
              ) : (
                <> <Calculator size={20} /> Hitung Refund </>
              )}
            </button>
          </div>
        ) : (
          /* --- RESULT VIEW (Siap Print) --- */
          <div className="animate-fade-in-up">
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Hasil Perhitungan</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResult(false)}
                  className="px-4 py-2 border border-white/20 rounded-lg text-sm hover:bg-white/5 transition flex items-center gap-2"
                >
                  <RefreshCw size={16} /> Hitung Ulang
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-bold transition flex items-center gap-2 shadow-lg shadow-green-500/20"
                >
                  <Download size={16} /> Download PDF
                </button>
              </div>
            </div>

            {/* PREVIEW CARD (Target PDF) */}
            {/* NOTE: Gunakan class warna manual (HEX/RGBA) disini untuk menghindari error OKLCH pada html2canvas */}
            <div
              ref={resultRef}
              className="pdf-container bg-[#1e1b36] p-8 rounded-3xl border border-[rgba(255,255,255,0.1)] shadow-2xl max-w-3xl mx-auto relative overflow-hidden"
            >
              {/* Header Card */}
              <div className="flex justify-between items-start border-b border-[rgba(255,255,255,0.1)] pb-6 mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Kalkulasi Refund Produk</h3>
                  <p className="text-[#c084fc] text-sm font-medium">Official Receipt</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-xs uppercase tracking-wider">No. Refund</p>
                  <p className="text-lg font-mono font-bold text-white">{calculation.refundId}</p>
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-2 gap-8 mb-8">

                {/* Informasi Produk */}
                <div className="bg-[rgba(15,12,41,0.5)] p-5 rounded-xl border border-[rgba(255,255,255,0.05)]">
                  <h4 className="text-[#c084fc] text-sm font-bold mb-4 uppercase flex items-center gap-2">
                    <Tag size={14}/> Informasi Produk
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nama Produk:</span>
                      <span className="font-bold text-white uppercase">{formData.productName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Customer:</span>
                      <span className="font-bold text-white uppercase">{formData.customerName}</span>
                    </div>
                    <div className="flex justify-between border-t border-[rgba(255,255,255,0.05)] pt-2 mt-2">
                      <span className="text-gray-400">Harga Awal:</span>
                      <span className="font-bold text-[#4ade80]">{formatRupiah(formData.price)}</span>
                    </div>
                  </div>
                </div>

                {/* Informasi Waktu */}
                <div className="bg-[rgba(15,12,41,0.5)] p-5 rounded-xl border border-[rgba(255,255,255,0.05)]">
                  <h4 className="text-[#60a5fa] text-sm font-bold mb-4 uppercase flex items-center gap-2">
                    <Clock size={14}/> Informasi Waktu
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tgl Order:</span>
                      <span className="text-white">{formatDate(formData.purchaseDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tgl Kendala:</span>
                      <span className="text-white">{formatDate(formData.issueDate)}</span>
                    </div>
                    <div className="flex justify-between border-t border-[rgba(255,255,255,0.05)] pt-2 mt-2">
                      <span className="text-gray-400">Masa Aktif:</span>
                      <span className="font-bold text-white">{formData.activePeriod} Hari</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kalkulasi Akhir */}
              {/* Gunakan style inline untuk gradient agar aman */}
              <div
                className="p-6 rounded-xl border border-[rgba(255,255,255,0.1)]"
                style={{ background: 'linear-gradient(to right, rgba(88,28,135,0.3), rgba(30,58,138,0.3))' }}
              >
                <h4 className="text-white text-sm font-bold mb-4 uppercase border-b border-[rgba(255,255,255,0.1)] pb-2">Kalkulasi Penggunaan</h4>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Durasi Pemakaian:</span>
                    <span className="text-white font-mono">{calculation.daysUsed} Hari</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">Biaya Pemakaian (Prorata):</span>
                    <span className="text-[#f87171] font-mono">- {formatRupiah(calculation.usageCost)}</span>
                  </div>

                  <div className="flex justify-between items-center pt-4 mt-2 border-t border-[rgba(255,255,255,0.1)]">
                    <span className="text-lg font-bold text-white">Total Refund Customer</span>
                    <span className="text-2xl font-bold text-[#4ade80]">{formatRupiah(calculation.refundAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Watermark Footer */}
              <div className="mt-8 text-center">
                <p className="text-[10px] text-gray-500">Made With 💜 Belanjamu Tools.</p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default RefundCalculator;