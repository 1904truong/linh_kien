'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AdvancedFilter from '@/features/product/components/AdvancedFilter';
import ProductCard from '@/features/product/components/ProductCard';
import { productService } from '@/features/product/services/productService';
import { SearchX, ChevronLeft, ChevronRight, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

function SearchResults() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const fetchProducts = async (filters) => {
    setLoading(true);
    try {
      const data = await productService.getProducts(filters);
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to fetch filtered products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    fetchProducts(params);
  }, [searchParams]);

  const handleFilterChange = (newFilters) => {
    fetchProducts(newFilters);
  };

  return (
    <div className="pb-24 bg-[#0A0F14] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-10">
          <Link href="/" className="hover:text-[#1173d4] transition-colors">Trang chủ</Link>
          <ChevronRightIcon size={12} className="text-slate-700" />
          <Link href="/product" className="hover:text-[#1173d4] transition-colors">Phụ tùng xe</Link>
          <ChevronRightIcon size={12} className="text-slate-700" />
          <span className="text-white">Kết quả tìm kiếm</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <AdvancedFilter onFilterChange={handleFilterChange} />

          {/* Main Results */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 bg-[#101922] p-5 rounded-2xl border border-slate-800">
              <div className="text-sm font-medium text-slate-400">
                Hiển thị <span className="text-[#1173d4] font-black">{total}</span> kết quả linh kiện
              </div>
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 sm:pb-0 w-full sm:w-auto">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">Sắp xếp:</span>
                {['Phổ biến nhất', 'Giá: Thấp đến Cao', 'Mới nhất'].map((sort, idx) => (
                  <button 
                    key={sort} 
                    className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all whitespace-nowrap border ${idx === 0 ? 'bg-[#1173d4] text-white border-[#1173d4] shadow-md shadow-[#1173d4]/20' : 'bg-[#1A2129] text-slate-400 border-slate-700 hover:border-[#1173d4] hover:text-[#1173d4]'}`}
                  >
                    {sort}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-[#101922] rounded-2xl animate-pulse border border-slate-800" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                
                {/* Pagination */}
                <div className="mt-20 flex justify-center items-center gap-2">
                  <button className="w-10 h-10 rounded-xl border border-slate-800 flex items-center justify-center text-slate-600 hover:bg-[#1A2129] transition-colors disabled:opacity-20" disabled>
                    <ChevronLeft size={18} />
                  </button>
                  {[1, 2, 3, '...', 12].map((p, i) => (
                    <button key={i} className={`w-10 h-10 rounded-xl font-black text-xs transition-all flex items-center justify-center ${p === 1 ? 'bg-[#1173d4] text-white shadow-lg shadow-[#1173d4]/20' : 'text-slate-500 hover:bg-[#1A2129] border border-transparent hover:border-slate-800'}`}>
                      {p}
                    </button>
                  ))}
                  <button className="w-10 h-10 rounded-xl border border-slate-800 flex items-center justify-center text-slate-600 hover:bg-[#1A2129] transition-colors">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center bg-[#101922] rounded-3xl border border-slate-800">
                <div className="w-24 h-24 bg-[#1A2129] rounded-full flex items-center justify-center mb-8 text-slate-700 border border-slate-800">
                  <SearchX size={48} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Không tìm thấy linh kiện nào</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-10 font-bold px-6 leading-relaxed">Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại của bạn.</p>
                <button 
                  onClick={() => handleFilterChange({})}
                  className="bg-[#1173d4] text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#1173d4]/90 transition-all shadow-xl shadow-[#1173d4]/20 active:scale-95"
                >
                  Thiết lập lại bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-24 text-center bg-[#0A0F14] text-slate-500 font-bold min-screen">Đang tải kết quả...</div>}>
      <SearchResults />
    </Suspense>
  );
}
