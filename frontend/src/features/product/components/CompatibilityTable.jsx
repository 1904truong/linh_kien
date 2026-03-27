'use client';

import React, { useState } from 'react';
import { Search, Car, Info } from 'lucide-react';

const CompatibilityTable = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const compatibilityData = [
    { brand: 'Honda', models: 'Civic, City, CR-V', years: '2016 - 2024', engine: '1.5L Turbo, 1.8L, 2.0L' },
    { brand: 'Toyota', models: 'Vios, Camry, Corolla Altis', years: '2014 - 2023', engine: '1.5L, 2.0L, 2.5L' },
    { brand: 'Mazda', models: 'Mazda 3, Mazda 6, CX-5', years: '2015 - 2024', engine: 'SkyActiv-G 1.5, 2.0, 2.5' },
    { brand: 'Hyundai', models: 'Accent, Elantra, Tucson', years: '2017 - 2024', engine: '1.4L, 1.6L, 2.0L' },
    { brand: 'Kia', models: 'Cerato, K3, Seltos', years: '2018 - 2024', engine: '1.4L Turbo, 1.6L, 2.0L' }
  ];

  const filteredData = compatibilityData.filter(item => 
    item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.models.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <h2 className="text-2xl font-black flex items-center gap-3 text-white uppercase tracking-tight">
          <div className="bg-[#1173d4]/10 p-2 rounded-xl text-[#1173d4]">
            <Car size={24} />
          </div>
          Tương thích dòng xe
        </h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text"
            placeholder="Lọc theo hãng hoặc dòng xe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1A2129] border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-200 focus:ring-2 focus:ring-[#1173d4] outline-none transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#101922]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1A2129] text-slate-500 uppercase text-[10px] font-black tracking-[0.1em]">
            <tr>
              <th className="px-6 py-5">Hãng xe</th>
              <th className="px-6 py-5">Dòng xe (Model)</th>
              <th className="px-6 py-5">Đời xe (Year)</th>
              <th className="px-6 py-5">Động cơ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredData.map((item, idx) => (
              <tr key={idx} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-5 font-black text-white group-hover:text-[#1173d4] transition-colors">{item.brand}</td>
                <td className="px-6 py-5 text-slate-400 font-bold">{item.models}</td>
                <td className="px-6 py-5 text-slate-400 font-bold">{item.years}</td>
                <td className="px-6 py-5 text-slate-500 text-xs font-semibold italic">{item.engine}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-start gap-2 text-xs text-slate-500 bg-[#1173d4]/5 p-4 rounded-xl border border-[#1173d4]/20 italic">
        <Info size={16} className="shrink-0 text-[#1173d4] mt-0.5" />
        <p>
          Lưu ý: Danh sách này chỉ mang tính chất tham khảo. Vui lòng nhắn tin cho shop kèm số khung (VIN) để được tư vấn chính xác nhất trước khi đặt hàng.
        </p>
      </div>
    </div>
  );
};

export default CompatibilityTable;
