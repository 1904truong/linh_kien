'use client';

import React, { useState } from 'react';
import { Car, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

const QuickFilter = () => {
    const router = useRouter();
    const [filters, setFilters] = useState({
        brand: '',
        model: '',
        year: ''
    });

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (filters.brand) params.append('brand', filters.brand);
        if (filters.model) params.append('model', filters.model);
        if (filters.year) params.append('year', filters.year);
        router.push(`/search?${params.toString()}`);
    };

    return (
        <section className="max-w-7xl mx-auto px-4 w-full -mt-10 md:-mt-16 mb-20 relative z-30">
            <div className="bg-[#101922] p-8 md:p-10 rounded-3xl shadow-2xl shadow-black/40 border border-slate-800">
                <div className="flex items-center gap-3 mb-8">
                    <div className="text-[#1173d4]">
                        <Car size={24} />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-white">Tìm kiếm nhanh theo dòng xe</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 ml-1">Hãng xe</label>
                        <select 
                            value={filters.brand}
                            onChange={(e) => setFilters({...filters, brand: e.target.value})}
                            className="w-full bg-[#1A2129] border-slate-700 text-white rounded-xl h-12 font-medium focus:ring-2 focus:ring-[#1173d4] focus:border-transparent transition-all px-4 outline-none appearance-none"
                        >
                            <option value="">Chọn hãng xe (VD: Toyota)</option>
                            <option value="Toyota">Toyota</option>
                            <option value="Mercedes-Benz">Mercedes-Benz</option>
                            <option value="BMW">BMW</option>
                            <option value="Ford">Ford</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 ml-1">Model</label>
                        <select 
                            value={filters.model}
                            onChange={(e) => setFilters({...filters, model: e.target.value})}
                            className="w-full bg-[#1A2129] border-slate-700 text-white rounded-xl h-12 font-medium focus:ring-2 focus:ring-[#1173d4] focus:border-transparent transition-all px-4 outline-none appearance-none"
                        >
                            <option value="">Chọn dòng xe</option>
                            <option value="Camry">Camry</option>
                            <option value="Vios">Vios</option>
                            <option value="Ranger">Ranger</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-400 ml-1">Năm sản xuất</label>
                        <select 
                            value={filters.year}
                            onChange={(e) => setFilters({...filters, year: e.target.value})}
                            className="w-full bg-[#1A2129] border-slate-700 text-white rounded-xl h-12 font-medium focus:ring-2 focus:ring-[#1173d4] focus:border-transparent transition-all px-4 outline-none appearance-none"
                        >
                            <option value="">Tất cả năm</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                        </select>
                    </div>

                    <button 
                        onClick={handleSearch}
                        className="bg-[#1173d4] hover:bg-[#1173d4]/90 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#1173d4]/20 active:scale-95"
                    >
                        <Search size={18} /> Lọc phụ tùng
                    </button>
                </div>
            </div>
        </section>
    );
};

export default QuickFilter;
