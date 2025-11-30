import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator, Tag, Percent, ArrowRight, Save, RotateCcw } from 'lucide-react';

function DiscountCalculator() {
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [mode, setMode] = useState('percent'); // 'percent' atau 'nominal'
  const [result, setResult] = useState(null);

  // --- LOGIKA PERHITUNGAN ---
  const handleCalculate = () => {
    const priceNum = parseFloat(price);
    const discountNum = parseFloat(discount);

    if (!priceNum || !discountNum) {
      alert("Harap isi harga awal dan nominal/persen diskon!");
      return;
    }

    let finalPrice = 0;
    let savedAmount = 0;
    let percentValue = 0;

    if (mode === 'percent') {
      // Rumus: Harga Awal - (Harga Awal * Persen / 100)
      savedAmount = (priceNum * discountNum) / 100;
      finalPrice = priceNum - savedAmount;
      percentValue = discountNum;
    } else {
      // Rumus User: (Harga Potongan / Harga Awal) * 100
      // Mode Nominal: Input adalah jumlah potongan (Rp)
      savedAmount = discountNum;
      finalPrice = priceNum - savedAmount;
      percentValue = (savedAmount / priceNum) * 100;
    }

    setResult({
      original: priceNum,
      final: finalPrice < 0 ? 0 : finalPrice,
      saved: savedAmount,
      percent: percentValue.toFixed(2) // Ambil 2 desimal
    });
  };

  const handleReset = () => {
    setPrice('');
    setDiscount('');
    setResult(null);
  };

  // Format Rupiah
  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] text-white p-6 font-sans relative overflow-hidden">

      {/* Background Ambience */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 -left-10 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
        <div className="absolute bottom-20 -right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
      </div>

      <div className="max-w-md mx-auto relative z-10 mt-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <Link to="/tools" className="p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition border border-white/10">
                <ArrowLeft size={24} />
            </Link>
            <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                  Hitung Diskon
                </h1>
                <p className="text-gray-400 text-xs">Kalkulator potongan harga otomatis.</p>
            </div>
        </div>

        {/* --- INPUT CARD --- */}
        <div className="bg-[#1e1b36] p-6 rounded-3xl border border-white/10 shadow-2xl mb-6">

          {/* Input Harga Awal */}
          <div className="mb-5">
            <label className="text-sm text-gray-400 font-medium mb-2 block ml-1">Harga Awal</label>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-gray-500 font-bold text-sm">Rp</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="w-full bg-[#0f0c29] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-lg font-bold text-white focus:outline-none focus:border-green-500 transition"
              />
            </div>
          </div>

          {/* Toggle Mode Diskon */}
          <div className="flex bg-[#0f0c29] p-1 rounded-xl mb-4 border border-white/5">
            <button
              onClick={() => setMode('percent')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'percent' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Percent size={14} /> Persen (%)
            </button>
            <button
              onClick={() => setMode('nominal')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${mode === 'nominal' ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <Tag size={14} /> Nominal (Rp)
            </button>
          </div>

          {/* Input Diskon */}
          <div className="mb-6">
            <label className="text-sm text-gray-400 font-medium mb-2 block ml-1">
              {mode === 'percent' ? 'Besaran Persen' : 'Besaran Potongan'}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-3.5 text-gray-500">
                {mode === 'percent' ? <Percent size={18}/> : <span className="font-bold text-sm">Rp</span>}
              </div>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder={mode === 'percent' ? "Contoh: 20" : "Contoh: 50000"}
                className="w-full bg-[#0f0c29] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-lg font-bold text-white focus:outline-none focus:border-green-500 transition"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
             {result && (
               <button
                 onClick={handleReset}
                 className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition text-gray-400"
               >
                 <RotateCcw size={20} />
               </button>
             )}
             <button
               onClick={handleCalculate}
               className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-900/20 transition-all flex items-center justify-center gap-2"
             >
               <Calculator size={18} /> Hitung Sekarang
             </button>
          </div>
        </div>

        {/* --- RESULT CARD --- */}
        {result && (
          <div className="animate-fade-in-up">
            <div className="bg-gradient-to-br from-[#1e1b36] to-[#16132b] p-6 rounded-3xl border border-green-500/30 relative overflow-hidden">

              {/* Decorative Circle */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 rounded-full blur-2xl"></div>

              <div className="relative z-10">
                <p className="text-center text-gray-400 text-sm mb-1 uppercase tracking-wider">Harga Akhir</p>
                <h2 className="text-4xl font-extrabold text-center text-white mb-6">
                  {formatRupiah(result.final)}
                </h2>

                <div className="bg-[#0f0c29]/50 rounded-xl p-4 border border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">Harga Awal</span>
                    <span className="text-white font-medium line-through decoration-red-500 decoration-2">{formatRupiah(result.original)}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Percent size={12} className="text-green-400"/> Diskon
                    </span>
                    <span className="text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded">
                      {result.percent}%
                    </span>
                  </div>

                  <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                     <span className="text-gray-300 font-medium flex items-center gap-2">
                       <Save size={16} className="text-blue-400"/> Kamu Hemat
                     </span>
                     <span className="text-xl font-bold text-blue-400">
                       {formatRupiah(result.saved)}
                     </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default DiscountCalculator;