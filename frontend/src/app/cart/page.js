'use client';

import React, { useState, useEffect } from 'react';
import useCartStore from '@/store/useCartStore';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Truck, 
  Tag, 
  ArrowRight, 
  Store, 
  Check, 
  ChevronRight,
  Info
} from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart, hydrated, fetchCart, loading } = useCartStore();
  const [selectedItems, setSelectedItems] = useState([]);

  // Mock recommendations
  const recommendations = [
    { id: '101', name: 'Nước làm mát động cơ pha sẵn - 4L', price: 250000, img: 'https://images.unsplash.com/photo-1635773103241-d21056c8639a?q=80&w=400&auto=format&fit=crop' },
    { id: '102', name: 'Bugi bạch kim NGK Laser Iridium', price: 180000, img: 'https://images.unsplash.com/photo-1598501022234-7965b3413cb6?q=80&w=400&auto=format&fit=crop' },
    { id: '103', name: 'Má phanh trước Ceramic cao cấp', price: 850000, img: 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=400&auto=format&fit=crop' },
    { id: '104', name: 'Gạt mưa Silicon thân mềm Hybrid', price: 120000, img: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400&auto=format&fit=crop' },
  ];

  // Initialize selected items when hydrated
  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (hydrated && items.length > 0) {
      setSelectedItems(items.map(item => item.productId));
    }
  }, [hydrated, items]);

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(i => i.productId));
    }
  };

  if (!hydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col gap-8">
        <div className="h-10 w-64 bg-slate-800 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-40 w-full bg-slate-800 animate-pulse rounded-3xl" />
            <div className="h-40 w-full bg-slate-800 animate-pulse rounded-3xl" />
          </div>
          <div className="lg:col-span-4 h-80 bg-slate-800 animate-pulse rounded-3xl" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center text-center text-white">
        <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-8">
          <ShoppingBag size={48} className="text-slate-500" />
        </div>
        <h1 className="text-3xl font-black mb-4">Giỏ hàng của bạn đang trống</h1>
        <p className="text-slate-500 mb-10 max-w-md mx-auto font-medium">
          Có vẻ như bạn chưa chọn được linh kiện nào ưng ý. Hãy khám phá kho hàng của chúng tôi ngay nhé!
        </p>
        <Link 
          href="/" 
          className="bg-[#1173d4] text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#1173d4]/90 transition-all shadow-xl shadow-[#1173d4]/20 active:scale-95"
        >
          TIẾP TỤC MUA SẮM
        </Link>
      </div>
    );
  }

  const selectedTotalPrice = items
    .filter(i => selectedItems.includes(i.productId))
    .reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-[#101922] text-slate-100 pb-24">
      <div className="max-w-7xl mx-auto px-4 pt-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-4">
             <div className="bg-[#1173d4] p-2 rounded-xl">
               <ShoppingBag size={28} className="text-white" />
             </div>
             <div>
                <h1 className="text-3xl font-black tracking-tight mb-1">Giỏ hàng</h1>
                <p className="text-xs text-slate-500 font-black uppercase tracking-widest">
                  Bạn đang có <span className="text-[#1173d4]">{items.length}</span> món đồ
                </p>
             </div>
          </div>
          <button 
            onClick={clearCart}
            className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500 hover:text-white transition-all flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 active:scale-95"
          >
            <Trash2 size={16} /> Làm trống giỏ hàng
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main List */}
          <div className="lg:col-span-8 space-y-8">
            {/* Shop/Supplier Card */}
            <div className="bg-[#1A2129] rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/20">
                <div className="flex items-center gap-4">
                  <div 
                    onClick={toggleSelectAll}
                    className="w-5 h-5 rounded-md border-2 border-slate-700 flex items-center justify-center cursor-pointer transition-all"
                  >
                    {selectedItems.length === items.length && <div className="w-2.5 h-2.5 bg-[#1173d4] rounded-[2px]" />}
                  </div>
                  <div className="flex items-center gap-2 text-[#1173d4]">
                    <Store size={18} />
                    <h2 className="font-black text-xs uppercase tracking-widest">Hệ thống XeParts Việt Nam</h2>
                  </div>
                </div>
                <button className="text-[10px] font-black uppercase tracking-widest text-[#1173d4] hover:underline">Chi tiết</button>
              </div>

              <div className="divide-y divide-slate-800">
                {items.map((item) => (
                  <div key={item.productId} className="p-8 flex flex-col md:flex-row items-center gap-8 group relative transition-all hover:bg-white/[0.02]">
                    <div className="flex items-center gap-6">
                      <div 
                        onClick={() => toggleSelectItem(item.productId)}
                        className={`w-5 h-5 rounded-md border-2 transition-all cursor-pointer flex items-center justify-center ${selectedItems.includes(item.productId) ? 'border-[#1173d4] bg-[#1173d4]/10' : 'border-slate-800 hover:border-slate-700'}`}
                      >
                        {selectedItems.includes(item.productId) && <Check size={14} className="text-[#1173d4]" />}
                      </div>
                      <Link href={`/product/${item.productId}`} className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-[#101922] p-4 border border-slate-800 overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                      </Link>
                    </div>

                    <div className="flex-grow space-y-5 w-full">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="space-y-1">
                           <Link href={`/product/${item.productId}`} className="text-lg font-black text-white hover:text-[#1173d4] transition-colors leading-tight line-clamp-2">
                             {item.name}
                           </Link>
                           <div className="flex items-center gap-3">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.category || 'Phụ tùng'}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-700" />
                              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sẵn hàng</span>
                           </div>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.productId)}
                          className="p-2.5 bg-slate-800/50 hover:bg-rose-500/10 text-slate-600 hover:text-rose-500 rounded-xl transition-all active:scale-90"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Đơn giá</p>
                           <p className="text-xl font-black text-white">{item.price.toLocaleString('vi-VN')}₫</p>
                        </div>

                        <div className="flex items-center bg-[#101922] rounded-2xl border border-slate-800 p-1.5 w-fit">
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 text-slate-500 hover:text-white rounded-xl transition-all active:scale-90"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center font-black text-lg text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-10 h-10 flex items-center justify-center hover:bg-slate-800 text-slate-500 hover:text-white rounded-xl transition-all active:scale-90"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="space-y-1 text-right">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Thành tiền</p>
                           <p className="text-2xl font-black text-[#1173d4]">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-6 bg-[#1173d4]/5 border-t border-slate-800 flex justify-between items-center px-10">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Tạm tính cho shop:</span>
                <span className="font-black text-xl text-[#1173d4]">{items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
            <div className="bg-[#1A2129] rounded-[32px] p-10 border border-slate-800 shadow-2xl space-y-10">
                <div>
                   <h3 className="text-lg font-black uppercase tracking-tight mb-8 flex items-center gap-3 text-white">
                     <Tag size={20} className="text-[#1173d4]" />
                     Mã giảm giá (Promo)
                   </h3>
                   <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Nhập mã ưu đãi..." 
                        className="flex-1 bg-[#101922] px-6 py-4 rounded-2xl border border-slate-800 text-sm font-bold text-white outline-none focus:border-[#1173d4] placeholder:text-slate-600 transition-all"
                      />
                      <button className="bg-[#1173d4]/10 text-[#1173d4] px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-[#1173d4]/20 hover:bg-[#1173d4] hover:text-white transition-all active:scale-95">Áp dụng</button>
                   </div>
                </div>

                <div className="space-y-5 pt-4 border-t border-slate-800">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-500">
                    <span>Tạm tính ({items.length} món)</span>
                    <span className="text-slate-200">{getTotalPrice().toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-500">
                    <span>Phí vận chuyển</span>
                    <span className="text-emerald-500">Miễn phí</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-slate-500">
                    <span>Mã giảm giá</span>
                    <span className="text-rose-500">0₫</span>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-800">
                  <div className="flex justify-between items-end mb-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pb-1">Tổng thanh toán</span>
                    <div className="text-right">
                      <span className="block text-4xl font-black text-[#1173d4] tracking-tighter">{getTotalPrice().toLocaleString('vi-VN')}₫</span>
                      <p className="text-[10px] text-slate-500 font-bold italic mt-2">(Đã bao gồm VAT 10%)</p>
                    </div>
                  </div>

                  <Link 
                    href="/checkout" 
                    className="w-full bg-[#1173d4] text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-[#1173d4]/90 transition-all shadow-2xl shadow-[#1173d4]/20 active:scale-[0.98] group"
                  >
                    Tiến hành thanh toán <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-4 p-5 bg-[#101922] rounded-2xl border border-slate-800">
                    <div className="text-[#1173d4]"><Truck size={20} /></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">Giao hàng hỏa tốc <br/> 24h - 48h</p>
                  </div>
                  <div className="flex items-center gap-4 p-5 bg-[#101922] rounded-2xl border border-slate-800">
                    <div className="text-[#1173d4]"><ShieldCheck size={20} /></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed">Sản phẩm chính hãng <br/> Bảo hành 12 tháng</p>
                  </div>
                </div>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <section className="mt-32">
          <div className="flex items-center justify-between mb-10">
             <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
               <div className="p-2 bg-[#1173d4]/10 rounded-xl text-[#1173d4]">
                 <Info size={24} />
               </div>
               Có thể bạn quan tâm
             </h3>
             <Link href="/search" className="text-xs font-black uppercase tracking-widest text-[#1173d4] hover:underline flex items-center gap-2">
               Xem tất cả <ChevronRight size={14} />
             </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map((prod) => (
              <div key={prod.id} className="group bg-[#1A2129] p-6 rounded-[32px] border border-slate-800 hover:border-[#1173d4]/50 transition-all cursor-pointer">
                <div className="aspect-square rounded-2xl bg-[#101922] mb-6 overflow-hidden p-4">
                  <img src={prod.img} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" alt={prod.name} />
                </div>
                <h4 className="font-black text-xs text-slate-200 group-hover:text-[#1173d4] transition-colors line-clamp-2 h-8 leading-normal mb-3">{prod.name}</h4>
                <p className="text-[#1173d4] font-black text-lg">{prod.price.toLocaleString('vi-VN')}₫</p>
                <button className="mt-4 w-full bg-slate-800/50 group-hover:bg-[#1173d4] text-slate-500 group-hover:text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Thêm vào giỏ
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
