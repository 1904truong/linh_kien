'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

const Banner = () => {
  return (
    <section className="relative overflow-hidden w-full" suppressHydrationWarning>
      <div className="aspect-[21/9] md:aspect-[25/8] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#101922] via-[#101922]/70 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=2000&auto=format&fit=crop"
          alt="Professional mechanic working with premium auto parts"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-24 max-w-4xl space-y-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#1173d4] text-white text-[10px] font-bold rounded-full w-fit uppercase tracking-widest shadow-lg shadow-[#1173d4]/20">
            Khuyến mãi tháng 10
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight uppercase">
              Phụ Tùng Chính Hãng
            </h2>
            <h3 className="text-3xl md:text-5xl font-black text-[#1173d4] tracking-tight uppercase">
              Ưu Đãi Đến 30%
            </h3>
          </div>
          <p className="text-slate-300 text-sm md:text-lg max-w-xl font-medium leading-relaxed">
            Bảo dưỡng định kỳ với linh kiện đạt chuẩn từ các hãng <br className="hidden md:block"/>
            Toyota, Mercedes, BMW, Ford.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/search" className="bg-[#1173d4] hover:bg-[#1173d4]/90 text-white font-black py-4 px-10 rounded-xl transition-all text-xs uppercase tracking-widest shadow-xl shadow-[#1173d4]/20 active:scale-95">
              Mua Ngay
            </Link>
            <Link href="/dealer-search" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-black py-4 px-10 rounded-xl border border-white/20 text-xs uppercase tracking-widest active:scale-95">
              Tìm Dealer
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
