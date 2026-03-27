'use client';

import React, { useState, useEffect } from 'react';
import {
  Zap,
  Ticket,
  ChevronRight,
  Timer,
  Flame,
  Percent,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import ProductCard from '@/features/product/components/ProductCard';

// Mock data for the promotions page
const FLASH_SALE_PRODUCTS = [
  {
    _id: 'fs1',
    name: 'Lốp Michelin Pilot Sport 5 - 225/45R17',
    category: 'Lốp xe',
    price: 2450000,
    oldPrice: 4300000,
    discount: 40,
    image: 'https://images.unsplash.com/photo-1578844541660-3f1ce4ca727a?q=80&w=800&auto=format&fit=crop',
    sold: 75,
    total: 100
  },
  {
    _id: 'fs2',
    name: 'Dầu nhớt Castrol EDGE 5W-30 Full Synthetic',
    category: 'Động cơ',
    price: 890000,
    oldPrice: 1250000,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1635773103241-d21056c8639a?q=80&w=800&auto=format&fit=crop',
    sold: 90,
    total: 100
  },
  {
    _id: 'fs3',
    name: 'Má phanh Brembo Racing Z04',
    category: 'Phanh',
    price: 1150000,
    oldPrice: 2300000,
    discount: 50,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop',
    sold: 30,
    total: 100
  },
  {
    _id: 'fs4',
    name: 'Bugi Iridium NGK Laser - Bộ 4 cái',
    category: 'Đánh lửa',
    price: 420000,
    oldPrice: 500000,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1598501022234-7965b3413cb6?q=80&w=800&auto=format&fit=crop',
    sold: 55,
    total: 100
  }
];

const VOUCHERS = [
  {
    id: 'v1',
    title: 'Miễn phí vận chuyển',
    desc: 'Đơn tối thiểu 500k',
    expiry: 'HSD: 30.11.2023',
    type: 'shipping',
    highlight: 'MIỄN PHÍ'
  },
  {
    id: 'v2',
    title: 'Giảm trực tiếp 100k',
    desc: 'Cho đơn hàng tính kiện động cơ',
    expiry: 'HSD: 15.11.2023',
    type: 'discount',
    highlight: 'GIẢM 100K'
  },
  {
    id: 'v3',
    title: 'Hoàn tiền 5% tối đa 200k',
    desc: 'Dành riêng cho Velocity Pro',
    expiry: 'HSD: Vĩnh viễn',
    type: 'vip',
    highlight: 'VIP CHỈ DÀNH CHO VIP'
  }
];

const CATEGORY_PRODUCTS = [
  {
    _id: 'c1',
    name: 'Lọc gió K&N High-Flow Air Filter',
    category: 'Động cơ',
    price: 1250000,
    oldPrice: 1500000,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1621905252507-b354bc2addcc?q=80&w=800&auto=format&fit=crop',
    isHot: true
  },
  {
    _id: 'c2',
    name: 'Phuộc Ohlins DFV Road & Track',
    category: 'Hệ thống treo',
    price: 42000000,
    oldPrice: 48000000,
    discount: 12,
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=800&auto=format&fit=crop'
  },
  {
    _id: 'c3',
    name: 'Ống xả Akrapovic Slip-On Line',
    category: 'Hệ thống xả',
    price: 18500000,
    oldPrice: 22000000,
    discount: 15,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop'
  },
  {
    _id: 'c4',
    name: 'Bộ vành BBS RI-D Forged',
    category: 'Bánh xe',
    price: 120000000,
    oldPrice: 135000000,
    discount: 11,
    image: 'https://images.unsplash.com/photo-1550156141-1188736a5a04?q=80&w=800&auto=format&fit=crop'
  },
  {
    _id: 'c5',
    name: 'Combo 4 Bugi Denso Iridium',
    category: 'Đánh lửa',
    price: 950000,
    oldPrice: 1200000,
    discount: 20,
    image: 'https://images.unsplash.com/photo-1534091564174-d413669396ba?q=80&w=800&auto=format&fit=crop'
  }
];

export default function PromotionsPage() {
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 12 });
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0F14] pb-20">
      {/* Hero Banner */}
      <section className="relative overflow-hidden pt-10 px-4 max-w-7xl mx-auto">
        <div className="relative h-[450px] md:h-[600px] rounded-[32px] overflow-hidden bg-[#0A0F14] border border-white/5 shadow-2xl flex items-center">

          {/* Background */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=1600&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt="Banner Background"
            />

            {/* Overlay chuẩn */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-black/60" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 via-40% to-transparent" />
            </div>
          </div>

          {/* Content */}
          {/* BƯỚC CHỈNH SỬA: Thay đổi max-w-xl thành max-w-3xl */}
          <div className="relative z-10 px-6 md:px-16 max-w-4xl space-y-5 md:space-y-6">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e6fd9] text-white text-[10px] font-black uppercase tracking-[0.25em]">
              Ưu đãi có hạn
            </div>

            {/* Title */}
            <div className="space-y-1 text-left">
              <h1 className="text-4xl md:text-7xl font-black text-white leading-[1] tracking-tighter uppercase">
                SIÊU SALE LINH KIỆN
              </h1>
              <h2 className="text-4xl md:text-7xl font-black text-[#00A3FF] leading-[1] tracking-tighter uppercase">
                11.11 - GIẢM ĐẾN 50%
              </h2>
            </div>

            {/* Description */}
            {/* BƯỚC CHỈNH SỬA: Xóa max-w-md khỏi đoạn mô tả */}
            <p className="text-sm md:text-lg text-slate-300 font-medium leading-relaxed opacity-90">
              Nâng cấp hiệu suất xe của bạn với những linh kiện chính hãng giá tốt nhất trong năm.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 pt-6">
              <button className="bg-[#1e6fd9] text-white px-8 py-4 rounded-2xl font-bold text-[12px] uppercase tracking-widest hover:bg-[#1e6fd9]/90 hover:scale-[1.02] transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                Săn Deal Ngay <ArrowRight size={20} />
              </button>

              <button className="bg-[#1A2129]/40 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold text-[12px] uppercase tracking-widest hover:bg-[#1A2129]/70 transition-all backdrop-blur-sm">
                Xem Danh Mục
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Flash Sale */}
      <section className="max-w-7xl mx-auto px-4 mt-16 lg:mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
                <Zap size={24} fill="currentColor" />
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">FLASH SALE</h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kết thúc trong:</span>
              <div className="flex items-center gap-2">
                {[timeLeft.h, timeLeft.m, timeLeft.s].map((time, i) => (
                  <React.Fragment key={i}>
                    <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center font-black text-white text-sm">
                      {String(time).padStart(2, '0')}
                    </div>
                    {i < 2 && <span className="font-black text-slate-700">:</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
          <button className="text-[10px] font-black text-[#1173d4] uppercase tracking-widest flex items-center gap-2 group hover:underline underline-offset-8">
            Xem tất cả <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {FLASH_SALE_PRODUCTS.map((prod) => (
            <div key={prod._id} className="bg-[#101922] rounded-3xl border border-slate-800 overflow-hidden group hover:border-rose-500/30 transition-all duration-500">
              <div className="relative aspect-square">
                <div className="absolute top-4 left-4 z-10 bg-rose-500 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg shadow-lg">-{prod.discount}%</div>
                <img src={prod.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={prod.name} />
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-200 line-clamp-2 h-[40px] group-hover:text-white transition-colors">{prod.name}</h3>
                <div className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-black text-rose-500">{prod.price.toLocaleString('vi-VN')}₫</span>
                    <span className="text-xs text-slate-600 line-through font-medium">{prod.oldPrice.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-500">
                      <span>ĐÃ BÁN {prod.sold}</span>
                      <span>CÒN {prod.total - prod.sold}</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-rose-500 to-orange-400 rounded-full transition-all duration-1000"
                        style={{ width: `${(prod.sold / prod.total) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vouchers */}
      <section className="max-w-7xl mx-auto px-4 mt-24 lg:mt-32">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
            <Ticket size={24} fill="currentColor" />
          </div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">KHO MÃ GIẢM GIÁ</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VOUCHERS.map((v) => (
            <div key={v.id} className="relative bg-[#1A2129] border border-slate-800 rounded-3xl p-8 flex items-center gap-8 group hover:border-[#1173d4]/30 transition-all">
              {/* Decorative cutouts for voucher look */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 bg-[#0A0F14] rounded-full border border-slate-800 border-l-transparent z-10" />
              <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 bg-[#0A0F14] rounded-full border border-slate-800 border-r-transparent z-10" />

              <div className={`w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center
                  ${v.type === 'shipping' ? 'bg-sky-500/10 text-sky-500 border-sky-500/20' :
                  v.type === 'discount' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    'bg-rose-500/10 text-rose-500 border-rose-500/20'} border`}>
                {v.type === 'shipping' ? <Zap size={30} /> : v.type === 'discount' ? <Ticket size={30} /> : <Percent size={30} />}
              </div>

              <div className="flex-1 space-y-1">
                <h3 className="font-black text-white text-sm uppercase tracking-tight">{v.title}</h3>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">{v.desc}</p>
                <div className="flex items-center justify-between pt-4">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{v.expiry}</span>
                  <button className="text-[10px] font-black text-[#1173d4] uppercase tracking-[0.1em] hover:underline">Lưu mã</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Categories Section */}
      <section className="max-w-7xl mx-auto px-4 mt-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-slate-800 pb-10">
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">DANH MỤC KHUYẾN MẠI</h2>
            <p className="text-slate-500 text-sm font-bold">Khám phá hàng ngàn linh kiện đang có giá ưu đãi theo từng nhóm hàng.</p>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
            {['Tất cả', 'Lốp xe', 'Động cơ', 'Phanh', 'Phụ kiện'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`text-[10px] font-black uppercase tracking-widest px-8 py-3.5 rounded-2xl transition-all whitespace-nowrap border
                    ${activeTab === tab.toLowerCase() || (tab === 'Tất cả' && activeTab === 'all')
                    ? 'bg-[#1173d4] text-white border-[#1173d4] shadow-xl shadow-[#1173d4]/20'
                    : 'bg-[#1A2129] text-slate-500 border-slate-800 hover:border-slate-600 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {CATEGORY_PRODUCTS.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>

        <div className="mt-20 text-center">
          <button className="bg-slate-900 border border-slate-800 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#1173d4] hover:border-[#1173d4] transition-all flex items-center gap-3 mx-auto shadow-2xl">
            Tải thêm sản phẩm <ChevronDown size={14} />
          </button>
        </div>
      </section>

      {/* Floating Trust Banner */}
      <div className="max-w-4xl mx-auto px-4 mt-40">
        <div className="bg-[#1173d4] p-12 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left relative overflow-hidden group">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
          <div className="relative z-10 space-y-3">
            <h3 className="text-white text-3xl font-black uppercase tracking-tight">Cần tư vấn chọn bộ lọc?</h3>
            <p className="text-white/80 font-bold max-w-sm">Kỹ thuật viên của XeParts luôn sẵn sàng hỗ trợ bạn 24/7 hoàn toàn miễn phí.</p>
          </div>
          <button className="relative z-10 bg-white text-[#1173d4] px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-blue-900/40">
            Nhắn tin ngay
          </button>
        </div>
      </div>
    </div>
  );
}
