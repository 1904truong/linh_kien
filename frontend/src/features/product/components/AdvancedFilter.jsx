'use client';

import React, { useState } from 'react';
import { SlidersHorizontal, ChevronDown, Search } from 'lucide-react';

const AdvancedFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    brand: '',
    year: '',
    engines: [],
    oemCode: '',
    minPrice: '',
    maxPrice: '',
    partBrand: ''
  });

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleEngineChange = (engine) => {
    const newEngines = filters.engines.includes(engine)
      ? filters.engines.filter(e => e !== engine)
      : [...filters.engines, engine];
    
    const newFilters = { ...filters, engines: newEngines };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black flex items-center gap-3 text-white uppercase tracking-wider">
          <div className="bg-[#1173d4]/10 p-2 rounded-xl text-[#1173d4]">
            <SlidersHorizontal size={20} />
          </div>
          Bộ lọc nâng cao
        </h3>
      </div>

      <div className="space-y-8">
        {/* Hãng xe */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Hãng xe</label>
          <div className="relative">
            <select 
              name="brand"
              value={filters.brand}
              onChange={handleSelectChange}
              className="w-full bg-[#1A2129] border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-slate-200 focus:ring-2 focus:ring-[#1173d4] focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Tất cả hãng</option>
              <option value="Toyota">Toyota</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="BMW">BMW</option>
              <option value="Ford">Ford</option>
              <option value="Hyundai">Hyundai</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Đời xe */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Đời xe</label>
          <div className="relative">
            <select 
              name="year"
              value={filters.year}
              onChange={handleSelectChange}
              className="w-full bg-[#1A2129] border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-slate-200 focus:ring-2 focus:ring-[#1173d4] focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Chọn năm</option>
              {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Động cơ */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Động cơ</label>
          <div className="space-y-3">
            {['Xăng', 'Dầu (Diesel)', 'Hybrid/EV'].map((engine) => (
              <label key={engine} className="flex items-center gap-3 text-sm font-bold text-slate-300 cursor-pointer group hover:text-white transition-colors">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox"
                    checked={filters.engines.includes(engine)}
                    onChange={() => handleEngineChange(engine)}
                    className="peer hidden"
                  />
                  <div className="w-5 h-5 border-2 border-slate-700 rounded-md peer-checked:bg-[#1173d4] peer-checked:border-[#1173d4] transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center text-white scale-0 peer-checked:scale-100 transition-transform">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                </div>
                {engine}
              </label>
            ))}
          </div>
        </div>

        {/* Mã OEM */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Mã OEM</label>
          <input 
            type="text"
            name="oemCode"
            value={filters.oemCode}
            onChange={handleInputChange}
            placeholder="Nhập mã linh kiện..."
            className="w-full bg-[#1A2129] border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-slate-200 focus:ring-2 focus:ring-[#1173d4] focus:border-transparent outline-none transition-all placeholder:text-slate-600"
          />
        </div>

        {/* Khoảng giá */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Khoảng giá (VNĐ)</label>
          <div className="flex items-center gap-3">
            <input 
              type="text"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleInputChange}
              placeholder="Từ"
              className="w-full bg-[#1A2129] border border-slate-800 rounded-lg py-2 px-3 text-xs font-bold text-slate-200 focus:ring-2 focus:ring-[#1173d4] outline-none placeholder:text-slate-600"
            />
            <span className="text-slate-600">—</span>
            <input 
              type="text"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleInputChange}
              placeholder="Đến"
              className="w-full bg-[#1A2129] border border-slate-800 rounded-lg py-2 px-3 text-xs font-bold text-slate-200 focus:ring-2 focus:ring-[#1173d4] outline-none placeholder:text-slate-600"
            />
          </div>
        </div>

        {/* Thương hiệu */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Thương hiệu phụ tùng</label>
          <div className="relative">
            <select 
              name="partBrand"
              value={filters.partBrand}
              onChange={handleSelectChange}
              className="w-full bg-[#1A2129] border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold text-slate-200 focus:ring-2 focus:ring-[#1173d4] focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Tất cả thương hiệu</option>
              <option value="Bosch">Bosch</option>
              <option value="Denso">Denso</option>
              <option value="Brembo">Brembo</option>
              <option value="Castrol">Castrol</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>

        <button 
          onClick={applyFilters}
          className="w-full py-4 bg-[#1173d4] hover:bg-[#1173d4]/90 text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#1173d4]/20 active:scale-95 flex items-center justify-center gap-2"
        >
          <Search size={18} />
          Áp dụng bộ lọc
        </button>
      </div>
    </aside>
  );
};

export default AdvancedFilter;
