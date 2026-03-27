'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail, MapPin, Send, Settings2 } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#101922] border-t border-slate-800 pt-20 pb-12 transition-colors" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4" suppressHydrationWarning>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-[#1173d4] p-1.5 rounded-lg">
                <Settings2 size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white uppercase">XeParts</h2>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Chuyên cung cấp linh kiện ô tô chính hãng, giao hàng toàn quốc và hỗ trợ lắp đặt tại hệ thống gara liên kết.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-[#1A2129] flex items-center justify-center text-slate-400 hover:bg-[#1173d4] hover:text-white transition-all shadow-lg">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-[#1A2129] flex items-center justify-center text-slate-400 hover:bg-[#1173d4] hover:text-white transition-all shadow-lg">
                <Instagram size={18} />
              </Link>
            </div>
          </div>

          {/* Customer Support */}
          <div className="space-y-6">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Hỗ trợ khách hàng</h4>
            <ul className="space-y-3 text-sm text-slate-500 font-medium">
              <li><Link href="/help" className="hover:text-white transition-colors">Hướng dẫn mua hàng</Link></li>
              <li><Link href="/help" className="hover:text-white transition-colors">Chính sách bảo hành</Link></li>
              <li><Link href="/help" className="hover:text-white transition-colors">Quy định đổi trả</Link></li>
              <li><Link href="/orders" className="hover:text-white transition-colors">Tra cứu đơn hàng</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Danh mục phổ biến</h4>
            <ul className="space-y-3 text-sm text-slate-500 font-medium">
              <li><Link href="#" className="hover:text-white transition-colors">Phụ tùng Toyota</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Phụ tùng Mercedes</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Dầu nhớt & Phụ gia</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Đồ chơi xe hơi</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Liên hệ</h4>
            <div className="space-y-3 text-sm text-slate-500 font-medium">
              <p className="flex items-center gap-3"><Phone size={14} className="text-[#1173d4]" /> 1900 6789</p>
              <p className="flex items-center gap-3"><Mail size={14} className="text-[#1173d4]" /> support@xeparts.vn</p>
              <p className="flex items-center gap-3"><MapPin size={14} className="text-[#1173d4]" /> 123 Đường Láng, Đống Đa, Hà Nội</p>
            </div>
            <div className="pt-4">
              <p className="text-[10px] font-black mb-3 uppercase tracking-[0.2em] text-white">Đăng ký nhận tin ưu đãi</p>
              <div className="flex bg-[#1A2129] rounded-xl p-1 border border-slate-800">
                <input
                  type="email"
                  className="w-full bg-transparent text-white text-xs py-2 px-4 focus:outline-none placeholder:text-slate-600"
                  placeholder="Email của bạn"
                />
                <button className="bg-[#1173d4] text-white px-6 py-2 rounded-lg font-bold text-xs hover:bg-[#1173d4]/90 transition-colors uppercase tracking-widest">
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Copyright */}
        <div className="border-t border-slate-800 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center opacity-30">
             <div className="flex justify-center md:justify-start items-center gap-12">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-20 grayscale brightness-200" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-24 grayscale brightness-200" />
             </div>
          </div>
          <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            <p>© 2024 XeParts. All rights reserved. Phát triển bởi Design Team.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
