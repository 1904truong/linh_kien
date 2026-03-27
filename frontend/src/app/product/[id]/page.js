'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productService } from '@/features/product/services/productService';
import useCartStore from '@/store/useCartStore';
import { ShoppingCart, Star, ShieldCheck, Truck, RotateCcw, ChevronRight, Minus, Plus, Heart, Share2, Check, Info, MessageSquare, Tag } from 'lucide-react';
import ProductGallery from '@/features/product/components/ProductGallery';
import CompatibilityTable from '@/features/product/components/CompatibilityTable';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('compatibility');
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    // Mock data for initial design pass, ideally fetched from service
    const mockProduct = {
      _id: '1',
      name: 'Bộ lọc dầu nhớt động cơ cao cấp - Hiệu suất cao',
      category: 'Phụ tùng động cơ',
      sku: 'OLF-2023-PREMIUM',
      oem: '15400-PLM-A02',
      price: 150000,
      oldPrice: 210000,
      discount: 30,
      rating: 4.8,
      reviewsCount: 128,
      stock: 'Còn hàng',
      images: [
        'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1635773103241-d21056c8639a?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1598501022234-7965b3413cb6?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=800&auto=format&fit=crop'
      ]
    };

    const fetchProduct = async () => {
      try {
        const data = await productService.getProductById(id);
        if (data.product) {
          setProduct({ ...mockProduct, ...data.product });
        } else {
          setProduct(mockProduct);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(mockProduct); // Fallback to mock for UI dev
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    router.push('/checkout');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0A0F14] p-20 flex flex-col items-center justify-center text-slate-500 font-bold">
      Đang tải thông tin sản phẩm...
    </div>
  );
  
  if (!product) return <div className="min-h-screen bg-[#0A0F14] flex items-center justify-center p-20 text-white font-bold">Sản phẩm không tồn tại</div>;

  return (
    <div className="min-h-screen pb-32 bg-[#0A0F14]">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <nav className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-12">
          <Link href="/" className="hover:text-[#1173d4] transition-colors">Trang chủ</Link>
          <ChevronRight size={12} className="text-slate-700" />
          <Link href="/search" className="hover:text-[#1173d4] transition-colors">{product.category}</Link>
          <ChevronRight size={12} className="text-slate-700" />
          <span className="text-white truncate max-w-[300px]">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Product Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-24 items-start">
          <ProductGallery images={product.images} />

          <div className="flex flex-col h-full">
            <div className="space-y-6 mb-10">
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
                  <Star size={14} className="fill-current" />
                  <span className="text-xs font-black tracking-tight">{product.rating}/5</span>
                  <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-400">({product.reviewsCount} đánh giá)</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider">{product.stock}</span>
                </div>
              </div>

              {/* SKU & OEM Info */}
              <div className="grid grid-cols-2 gap-4 bg-[#101922] p-5 rounded-2xl border border-slate-800">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mã sản phẩm (SKU)</p>
                  <p className="text-sm font-mono font-bold text-slate-200">{product.sku}</p>
                </div>
                <div className="space-y-1 border-l border-slate-800 pl-4">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mã OEM</p>
                  <p className="text-sm font-mono font-bold text-slate-200">{product.oem}</p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-5xl font-black text-[#1173d4] tracking-tighter">
                  {product.price.toLocaleString('vi-VN')}₫
                </span>
                <span className="text-xl text-slate-500 line-through decoration-slate-700 font-medium tracking-tight">
                  {product.oldPrice.toLocaleString('vi-VN')}₫
                </span>
                <span className="bg-[#E11D48] text-white text-xs font-black px-2.5 py-1.5 rounded-lg shadow-lg shadow-red-900/20">-{product.discount}%</span>
              </div>
              <p className="text-xs text-slate-500 font-bold italic tracking-wide">Giá đã bao gồm VAT và cam kết chính hãng 100%.</p>
            </div>

            {/* Actions */}
            <div className="mt-auto space-y-6">
              <div className="flex flex-col sm:flex-row gap-5 items-stretch">
                <div className="flex items-center bg-[#1A2129] rounded-[20px] border border-slate-800/60 p-1.5 h-16 w-full sm:w-48 shadow-inner group">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center rounded-xl text-slate-500 hover:text-white hover:bg-slate-800/80 transition-all duration-300 active:scale-90"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest opacity-40">SL</span>
                    <input 
                      type="text" 
                      value={quantity} 
                      readOnly 
                      className="w-full text-center bg-transparent font-black text-xl text-white outline-none leading-none -mt-0.5" 
                    />
                  </div>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl text-slate-500 hover:text-white hover:bg-slate-800/80 transition-all duration-300 active:scale-90"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-grow bg-[#1173d4]/10 border border-[#1173d4]/30 text-[#1173d4] h-16 rounded-[20px] font-black text-xs uppercase tracking-[0.2em] hover:bg-[#1173d4]/20 hover:border-[#1173d4] transition-all duration-500 flex items-center justify-center gap-3 active:scale-95 group shadow-lg shadow-[#1173d4]/5"
                >
                  <div className="bg-[#1173d4] text-white p-2 rounded-xl group-hover:scale-110 transition-transform duration-500">
                    <ShoppingCart size={18} />
                  </div>
                  Thêm vào giỏ
                </button>
              </div>
              <button 
                onClick={handleBuyNow}
                className="w-full bg-[#1173d4] text-white h-16 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-[#1173d4]/90 transition-all shadow-xl shadow-[#1173d4]/20 active:scale-[0.98]"
              >
                Mua ngay bây giờ
              </button>
            </div>

            {/* Quick trust items */}
            <div className="grid grid-cols-3 gap-4 border-t border-slate-800 mt-10 pt-10 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="text-[#1173d4] bg-[#1173d4]/5 p-2 rounded-lg"><Truck size={20} /></div>
                Giao hỏa tốc 2h
              </div>
              <div className="flex flex-col items-center gap-3 border-x border-slate-800">
                <div className="text-[#1173d4] bg-[#1173d4]/5 p-2 rounded-lg"><ShieldCheck size={20} /></div>
                Bảo hành 12th
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="text-[#1173d4] bg-[#1173d4]/5 p-2 rounded-lg"><RotateCcw size={20} /></div>
                Đổi trả 7 ngày
              </div>
            </div>
          </div>
        </div>

        {/* Details & Sidebar Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 border-t border-slate-800 pt-16">
          <div className="lg:col-span-8 space-y-20">
            {/* Tabs Navigation */}
            <div className="flex border-b border-slate-800 overflow-x-auto no-scrollbar gap-10">
              {[
                { id: 'compatibility', label: 'Tương thích xe' },
                { id: 'specs', label: 'Thông số kỹ thuật' },
                { id: 'reviews', label: 'Đánh giá (128)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-6 text-sm font-black uppercase tracking-[0.15em] transition-all border-b-4 ${
                    activeTab === tab.id 
                    ? 'border-[#1173d4] text-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="min-h-[400px]">
              {activeTab === 'compatibility' && <CompatibilityTable />}
              
              {activeTab === 'specs' && (
                <div className="space-y-10">
                  <h2 className="text-2xl font-black flex items-center gap-3 text-white uppercase tracking-tight">
                    <div className="bg-[#1173d4]/10 p-2 rounded-xl text-[#1173d4]">
                      <Info size={24} />
                    </div>
                    Thông số kỹ thuật chi tiết
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { l: 'Loại sản phẩm', v: 'Bộ lọc dầu vặn ren (Spin-on)' },
                      { l: 'Vật liệu lọc', v: 'Sợi tổng hợp cao cấp' },
                      { l: 'Kích thước ren', v: 'M20 x 1.5' },
                      { l: 'Đường kính ngoài', v: '68 mm' },
                      { l: 'Chiều cao', v: '85 mm' },
                      { l: 'Van một chiều', v: 'Có (Silicon)', highlight: true },
                    ].map((spec, i) => (
                      <div key={i} className="flex justify-between p-5 bg-[#101922] rounded-2xl border border-slate-800">
                        <span className="text-xs text-slate-500 font-black uppercase tracking-wider">{spec.l}</span>
                        <span className={`text-sm font-bold ${spec.highlight ? 'text-emerald-500' : 'text-slate-200'}`}>{spec.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-12">
                   {/* Review Summary Mock */}
                   <div className="flex flex-col md:flex-row gap-10 items-center bg-[#1173d4]/5 p-10 rounded-3xl border border-[#1173d4]/10">
                     <div className="text-center">
                        <div className="text-6xl font-black text-[#1173d4] mb-3 leading-none">4.8</div>
                        <div className="flex text-amber-500 justify-center mb-2">
                          {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-current" />)}
                        </div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dựa trên 128 lượt mua</div>
                     </div>
                     <div className="flex-1 w-full space-y-4">
                        {[85, 10, 3, 1, 1].map((pct, i) => (
                           <div key={i} className="flex items-center gap-4 text-[10px] font-black tracking-widest text-slate-500">
                              <span className="w-4">{5-i}</span>
                              <div className="flex-1 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-[#1173d4] transition-all duration-1000" style={{ width: `${pct}%` }}></div>
                              </div>
                              <span className="w-10 text-right">{pct}%</span>
                           </div>
                        ))}
                     </div>
                   </div>

                   {/* Mock Individual Reviews */}
                   <div className="space-y-10">
                      {[1, 2].map((r) => (
                         <div key={r} className="p-8 bg-[#101922] rounded-3xl border border-slate-800 space-y-5">
                            <div className="flex justify-between items-start">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-[#1173d4]/10 flex items-center justify-center font-black text-[#1173d4]">NT</div>
                                  <div>
                                     <div className="font-black text-slate-100">Nguyễn Thành</div>
                                     <div className="text-[9px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Đã mua hàng
                                     </div>
                                  </div>
                               </div>
                               <span className="text-[10px] font-bold text-slate-600">2 ngày trước</span>
                            </div>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">
                              Sản phẩm rất chất lượng, đóng gói kỹ càng. Mình lắp cho Honda Civic 2020 thấy rất khít, ren mượt. Giá này quá tốt so với hãng.
                            </p>
                         </div>
                      ))}
                   </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10">
            {/* Special Offer Sidebar */}
            <div className="bg-[#101922] p-8 rounded-3xl border border-slate-800 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#1173d4]/10 rounded-full blur-2xl group-hover:bg-[#1173d4]/20 transition-all duration-500" />
              <h3 className="font-black text-white text-lg mb-6 flex items-center gap-3 uppercase tracking-tight">
                <Tag size={20} className="text-[#1173d4]" />
                Ưu đãi đặc biệt
              </h3>
              <ul className="space-y-5 text-sm font-bold text-slate-400">
                <li className="flex gap-3 items-start group/li transition-colors hover:text-white">
                  <Check size={18} className="text-[#1173d4] mt-0.5 shrink-0" />
                  <span>Giảm 10% khi mua từ 3 bộ lọc trở lên.</span>
                </li>
                <li className="flex gap-3 items-start group/li transition-colors hover:text-white">
                  <Check size={18} className="text-[#1173d4] mt-0.5 shrink-0" />
                  <span>Miễn phí ship đơn từ 500k.</span>
                </li>
                <li className="flex gap-3 items-start group/li transition-colors hover:text-white">
                  <Check size={18} className="text-[#1173d4] mt-0.5 shrink-0" />
                  <span>Tặng kèm long đền xả nhớt.</span>
                </li>
              </ul>
            </div>

            {/* Technical Help Card */}
            <div className="bg-gradient-to-br from-[#101922] to-[#0D151C] p-8 rounded-3xl border border-slate-800 shadow-2xl">
              <h3 className="font-black text-white text-lg mb-3 uppercase tracking-tight">Cần hỗ trợ kỹ thuật?</h3>
              <p className="text-sm text-slate-500 font-medium mb-8 leading-relaxed">Đội ngũ kỹ thuật của chúng tôi sẵn sàng giải đáp thắc mắc về lắp đặt qua Zalo hoặc Hotline.</p>
              <button className="w-full bg-[#1A2129] hover:bg-white text-slate-200 hover:text-slate-900 h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 border border-slate-700 hover:border-white shadow-xl">
                 <MessageSquare size={18} /> Nhắn tin kỹ thuật
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
