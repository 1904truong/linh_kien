'use client';

import React, { useState } from 'react';
import { Search, Car, Calendar, SlidersHorizontal, ChevronDown } from 'lucide-react';

const FilterBar = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    year: '',
    oemCode: '',
    category: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white dark:bg-[#1A2129] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 mb-12 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-[#1173d4]/10 p-2.5 rounded-xl text-[#1173d4]">
          <SlidersHorizontal size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-tight">Bộ lọc thông minh</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Tìm kiếm linh kiện tương thích chính xác</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* Brand */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Hãng xe</label>
          <div className="relative group">
            <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1173d4] transition-colors" size={16} />
            <select 
              name="brand"
              value={filters.brand}
              onChange={handleChange}
              className="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#1173d4]/10 focus:border-[#1173d4] outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Tất cả hãng xe</option>
              <option value="Toyota">Toyota</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="BMW">BMW</option>
              <option value="Ford">Ford</option>
              <option value="Hyundai">Hyundai</option>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Model */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Dòng xe</label>
          <div className="relative group">
            <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1173d4] transition-colors" size={16} />
            <input 
              type="text"
              name="model"
              placeholder="VD: Vios, Camry..."
              value={filters.model}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#1173d4]/10 focus:border-[#1173d4] outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Year */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Năm sản xuất</label>
          <div className="relative group">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1173d4] transition-colors" size={16} />
            <select 
              name="year"
              value={filters.year}
              onChange={handleChange}
              className="w-full pl-12 pr-10 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#1173d4]/10 focus:border-[#1173d4] outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="">Chọn năm</option>
              {[2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* OEM Code */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Mã linh kiện / OEM</label>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1173d4] transition-colors" size={16} />
            <input 
              type="text"
              name="oemCode"
              placeholder="Nhập mã OEM..."
              value={filters.oemCode}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-[#1173d4]/10 focus:border-[#1173d4] outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Search Action */}
        <div className="flex items-end">
          <button 
            onClick={() => onFilterChange(filters)}
            className="w-full bg-[#1173d4] text-white py-4 rounded-2xl font-bold hover:bg-[#1173d4]/90 transition-all shadow-lg shadow-[#1173d4]/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <Search size={18} />
            <span>Tìm kiếm</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
