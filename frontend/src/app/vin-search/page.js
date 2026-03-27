'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Settings2, 
  ShieldCheck, 
  Car, 
  Wrench, 
  Calendar, 
  Fuel, 
  Zap,
  CheckCircle2,
  ArrowRight,
  Save,
  Fingerprint,
  BarChart3
} from 'lucide-react';

export default function VINSearchPage() {
  const [vin, setVin] = useState('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleDecode = () => {
    if (vin.length < 5) return;
    
    setIsDecoding(true);
    // Simulate API call
    setTimeout(() => {
      setIsDecoding(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0F14] pb-20">
      {/* Hero Header Section */}
      <section className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-32 max-w-7xl mx-auto">
        <div className="relative z-10 space-y-4">
          <span className="text-[#1173d4] text-[10px] font-black uppercase tracking-[0.25em]">Kỹ thuật chính xác</span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase tracking-tight">
            Tra cứu mã VIN
          </h1>
          <p className="text-slate-400 font-medium max-w-2xl leading-relaxed text-sm md:text-base">
            Giải mã thông số kỹ thuật tức thì để tìm kiếm linh kiện, phụ tùng chính xác 100% cho dòng xe của bạn. Giảm thiểu rủi ro sai sót trong bảo trì.
          </p>
        </div>
        
        {/* Background decorative accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1173d4]/5 rounded-full blur-[120px] -z-10" />
      </section>

      {/* Search Input Section */}
      <section className="max-w-7xl mx-auto px-6 -mt-12">
        <div className="bg-[#101922] border border-white/5 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1173d4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 space-y-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nhập mã định danh xe (VIN)</h3>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#1173d4]">
                  <Fingerprint size={24} />
                </div>
                <input 
                  type="text" 
                  value={vin}
                  onChange={(e) => setVin(e.target.value.toUpperCase())}
                  placeholder="Nhập 17 ký tự mã VIN..."
                  className="w-full bg-[#0A0F14] border border-slate-800 rounded-2xl py-5 pl-16 pr-6 text-white text-lg font-bold placeholder:text-slate-700 focus:ring-2 focus:ring-[#1173d4] focus:outline-none transition-all tracking-widest uppercase"
                  maxLength={17}
                />
              </div>
              <button 
                onClick={handleDecode}
                disabled={isDecoding || vin.length < 5}
                className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all
                  ${isDecoding || vin.length < 5 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-[#1173d4] text-white hover:bg-[#1173d4]/90 shadow-xl shadow-blue-500/20 active:scale-95 text-xs'}`}
              >
                {isDecoding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Đang giải mã...
                  </>
                ) : (
                  <>
                    Giải mã ngay <BarChart3 size={18} />
                  </>
                )}
              </button>
            </div>
            <p className="text-[10px] items-center italic text-slate-600 font-medium">Ví dụ: WBA8E1C52LFXXXXXX (BMW 3 Series)</p>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {showResults && (
        <section className="max-w-7xl mx-auto px-6 mt-16 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Detailed Info Card */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-[#101922] border border-white/5 rounded-[32px] overflow-hidden">
                <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-[#1173d4]" />
                    <h2 className="font-black text-white text-xs uppercase tracking-widest">Kết quả giải mã chi tiết</h2>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-500 text-[9px] font-black px-3 py-1 rounded-full border border-emerald-500/20 uppercase">Hợp lệ</span>
                </div>
                
                <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-12">
                  <DetailItem label="Hãng xe" value="BMW" />
                  <DetailItem label="Dòng xe" value="3 Series 320i" />
                  <DetailItem label="Năm sản xuất" value="2021" />
                  <DetailItem label="Động cơ" value="2.0L B48 I4" />
                  <DetailItem label="Nhiên liệu" value="Xăng (Petrol)" />
                  <DetailItem label="Hệ dẫn động" value="RWD / AT" />
                </div>

                <div className="px-10 pb-10 flex gap-4">
                  <button className="bg-[#1173d4] text-white px-8 py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-[#1173d4]/90 transition-all flex items-center gap-2">
                    Xem linh kiện tương thích <ArrowRight size={16} />
                  </button>
                  <button className="bg-[#1A2129] border border-white/5 text-slate-300 px-8 py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest hover:bg-white/5 transition-all flex items-center gap-2">
                    <Save size={16} /> Lưu vào Gara của tôi
                  </button>
                </div>
              </div>
            </div>

            {/* Car Summary Card */}
            <div className="space-y-6">
              <div className="bg-[#101922] border border-white/5 rounded-[32px] overflow-hidden group">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]" 
                    alt="BMW 3 Series" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101922] to-transparent" />
                  <span className="absolute bottom-4 left-6 text-[10px] font-black text-white/60 uppercase tracking-widest">Hình ảnh minh họa</span>
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="text-2xl font-black text-white tracking-tight">BMW 3 Series G20</h3>
                  <p className="text-xs text-slate-500 font-bold leading-relaxed">
                    Thế hệ sedan hạng sang thế hệ mới nhất với mã động cơ B48 hiệu suất cao. Phụ tùng chính hãng được tối ưu cho khung gầm G20.
                  </p>
                </div>
              </div>

              {/* Trust Badge Card */}
              <div className="bg-[#1173d4]/5 border border-[#1173d4]/20 p-6 rounded-[24px] flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-[#1173d4]/20 flex items-center justify-center text-[#1173d4]">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h4 className="text-white text-xs font-black uppercase tracking-tight">Dữ liệu tin cậy</h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-1">Thông tin được xác thực trực tiếp từ cơ sở dữ liệu OEM chuẩn quốc tế.</p>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      <p className="text-xl font-black text-white tracking-tight">{value}</p>
    </div>
  );
}
