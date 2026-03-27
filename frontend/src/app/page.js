'use client';

import React, { useEffect, useState } from 'react';
import Banner from '@/features/product/components/Banner';
import QuickFilter from '@/features/product/components/QuickFilter';
import ProductCard from '@/features/product/components/ProductCard';
import { productService } from '@/features/product/services/productService';
import { ChevronRight, Cog, Search, ShieldCheck, Truck, RotateCcw, Headphones, Zap, Shield, Layout, Armchair } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([
    {
      _id: '1',
      name: 'Bộ đĩa phanh trước Brembo - Mercedes C-Class 2018+',
      category: 'HỆ THỐNG PHANH',
      price: 2450000,
      oldPrice: 2940000,
      discount: 15,
      image: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=800&auto=format&fit=crop'
    },
    {
      _id: '2',
      name: 'Dầu nhớt tổng hợp Mobil 1 5W-30 - Can 5 Lít',
      category: 'DẦU NHỚT',
      price: 1150000,
      oldPrice: 1380000,
      image: 'https://images.unsplash.com/photo-1635773103241-d21056c8639a?q=80&w=800&auto=format&fit=crop'
    },
    {
      _id: '3',
      name: 'Lọc gió động cơ K&N High-Flow - Toyota Fortuner/Hilux',
      category: 'LỌC GIÓ',
      price: 1850000,
      oldPrice: 2220000,
      image: 'https://images.unsplash.com/photo-1598501022234-7965b3413cb6?q=80&w=800&auto=format&fit=crop'
    },
    {
      _id: '4',
      name: 'Đèn pha LED Full-Matrix - Phù hợp Ford Ranger Wildtrak',
      category: 'HỆ THỐNG CHIẾU SÁNG',
      price: 15200000,
      oldPrice: 18240000,
      isHot: true,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop'
    }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getProducts({ limit: 4 });
        if (data.products && data.products.length > 0) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col pb-20 bg-[#0A0F14] min-h-screen" suppressHydrationWarning>
      <Banner />
      <QuickFilter />

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-20" suppressHydrationWarning>
        <div className="flex items-center justify-between mb-8" suppressHydrationWarning>
          <h2 className="text-xl font-bold tracking-tight text-white uppercase">Danh mục linh kiện</h2>
          <Link href="/search" className="text-[#1173d4] font-bold text-xs flex items-center gap-1 hover:underline uppercase tracking-widest">
            Xem tất cả <ChevronRight size={14} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Gầm & Máy', count: '1,240 sản phẩm', icon: <Cog size={32} /> },
            { name: 'Hệ thống Điện', count: '850 sản phẩm', icon: <Zap size={32} /> },
            { name: 'Thân vỏ & Gương', count: '2,100 sản phẩm', icon: <Layout size={32} /> },
            { name: 'Nội thất', count: '640 sản phẩm', icon: <Armchair size={32} /> }
          ].map((cat) => (
            <Link 
              key={cat.name} 
              href={`/search?category=${cat.name}`}
              className="group bg-[#101922] border border-slate-800 p-8 rounded-2xl hover:border-[#1173d4]/50 transition-all flex flex-col items-center justify-center text-center gap-5 min-h-[200px] relative overflow-hidden active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#1173d4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-[#1173d4] group-hover:scale-110 transition-transform duration-700 relative z-10 p-4 bg-[#1173d4]/5 rounded-full">
                {cat.icon}
              </div>
              <div className="space-y-1 relative z-10">
                <h4 className="font-bold text-base text-white group-hover:text-[#1173d4] transition-colors tracking-tight">{cat.name}</h4>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em]">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Suggested Products Section */}
      <section className="max-w-7xl mx-auto px-4 w-full mb-32" suppressHydrationWarning>
        <div className="flex items-center gap-2.5 mb-10" suppressHydrationWarning>
          <div className="text-[#1173d4]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <h2 className="text-xl font-black tracking-[0.05em] text-white uppercase">Gợi ý dành cho bạn</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-slate-800 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
