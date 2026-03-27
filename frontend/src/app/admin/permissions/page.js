'use client';

import React from 'react';
import { ShieldAlert, ShieldCheck, UserPlus, Search, Edit2, Trash2, Key } from 'lucide-react';

export default function AdminPermissions() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Phân quyền Admin</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-1">Quản lý các tài khoản quản trị và cấp quyền truy cập hệ thống</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
          <Key size={18} />
          Thêm Role mới
        </button>
      </div>
      <div className="bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] overflow-hidden shadow-2xl">
         <div className="p-8 space-y-4">
            {[
              { role: 'Super Admin', desc: 'Toàn quyền điều hành hệ thống', count: 1 },
              { role: 'Moderator', desc: 'Duyệt sản phẩm và KYC', count: 3 },
              { role: 'Finance Admin', desc: 'Đối soát và thanh toán', count: 2 },
            ].map((role, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-[#101922] border border-[#2d3d4d] rounded-3xl group hover:border-[#1173d4] transition-all">
                 <div className="flex items-center gap-5">
                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                       <ShieldCheck size={24} />
                    </div>
                    <div>
                       <p className="text-base font-black text-white">{role.role}</p>
                       <p className="text-xs font-medium text-slate-500 uppercase tracking-tight">{role.desc}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{role.count} Nhân sự</span>
                    <button className="p-2 hover:bg-white/10 text-slate-500 hover:text-white rounded-xl">
                       <Edit2 size={16} />
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
