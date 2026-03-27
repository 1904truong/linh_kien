'use client';

import React from 'react';
import { Settings, Save, Lock, Globe, Bell, Server, Database, Shield } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Cài đặt hệ thống</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-1">Cấu hình tham số toàn cục và bảo mật hệ thống</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all">
          <Save size={18} />
          Lưu tất cả thay đổi
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] p-8 shadow-2xl space-y-8">
               <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-3">
                     <Globe className="text-blue-400" size={20} />
                     Cấu hình chung
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tên nền tảng</label>
                        <input type="text" defaultValue="XEPARTS PRO" className="w-full bg-[#101922] border border-[#2d3d4d] text-white rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-primary transition-all" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email hệ thống</label>
                        <input type="email" defaultValue="system@xeparts.pro" className="w-full bg-[#101922] border border-[#2d3d4d] text-white rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-primary transition-all" />
                     </div>
                  </div>
               </div>

               <div className="pt-8 border-t border-[#2d3d4d] space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-3">
                     <Shield className="text-emerald-400" size={20} />
                     Bảo mật & Xác thực
                  </h4>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-[#101922] rounded-2xl border border-[#2d3d4d]">
                        <div>
                           <p className="text-xs font-black text-white">Xác thực 2 yếu tố (2FA)</p>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Bắt buộc đối với tài khoản Admin</p>
                        </div>
                        <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                           <div className="absolute right-1 top-1 size-4 bg-white rounded-full"></div>
                        </div>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-[#101922] rounded-2xl border border-[#2d3d4d]">
                        <div>
                           <p className="text-xs font-black text-white">Chế độ bảo trì (Maintenance Mode)</p>
                           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Ngắt truy cập từ người dùng thông thường</p>
                        </div>
                        <div className="w-12 h-6 bg-slate-700 rounded-full relative cursor-pointer">
                           <div className="absolute left-1 top-1 size-4 bg-white rounded-full"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <div className="space-y-6">
            <div className="bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] p-6 shadow-2xl space-y-4">
               <h4 className="text-sm font-black uppercase tracking-widest text-white">Trạng thái hạ tầng</h4>
               <div className="space-y-3">
                  {[
                    { label: 'Database Service', status: 'Online', color: 'bg-emerald-400' },
                    { label: 'S3 Storage', status: 'Healthy', color: 'bg-emerald-400' },
                    { label: 'Redis Cache', status: 'Running', color: 'bg-emerald-400' },
                  ].map((s, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-[#101922] rounded-xl">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                       <div className="flex items-center gap-2">
                          <div className={`size-1.5 rounded-full ${s.color}`}></div>
                          <span className={`text-[10px] font-black uppercase ${s.color.replace('bg-', 'text-')}`}>{s.status}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
