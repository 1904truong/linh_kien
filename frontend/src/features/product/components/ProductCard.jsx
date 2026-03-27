'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, Eye } from 'lucide-react';
import useCartStore from '@/store/useCartStore';

const ProductCard = ({ product }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link href={`/product/${product._id}`} className="group bg-[#0D151C] rounded-2xl overflow-hidden border border-slate-800 hover:border-[#1173d4]/40 transition-all duration-300 flex flex-col h-full relative">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.discount > 0 && (
          <span className="bg-[#E11D48] text-white text-[9px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-wider">
            -{product.discount}%
          </span>
        )}
        {product.isHot && (
          <span className="bg-[#1173d4] text-white text-[9px] font-black px-2 py-1 rounded shadow-sm uppercase tracking-wider">
            HOT
          </span>
        )}
      </div>

      {/* Image Container - No fixed background, let the image decide */}
      <div className="relative aspect-square overflow-hidden bg-black/20 flex items-center justify-center">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=800&auto=format&fit=crop'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow bg-[#101922]">
        <div className="mb-4">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em] mb-1.5">{product.category || 'Phụ tùng'}</p>
          <h3 className="text-sm font-bold text-slate-200 line-clamp-2 leading-snug group-hover:text-white transition-colors min-h-[40px]">{product.name}</h3>
        </div>

        <div className="mt-auto space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[#1173d4] font-black text-xl leading-none">{product.price.toLocaleString('vi-VN')}₫</p>
              {product.oldPrice > 0 && (
                <p className="text-xs text-slate-500 line-through font-medium">{product.oldPrice.toLocaleString('vi-VN')}₫</p>
              )}
            </div>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full bg-transparent hover:bg-[#1173d4]/10 border border-[#1173d4]/30 hover:border-[#1173d4] text-[#1173d4] text-[11px] font-black py-3 px-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-tight"
          >
            <ShoppingCart size={16} className="mb-0.5" /> Thêm vào giỏ
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
