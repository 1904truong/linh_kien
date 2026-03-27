'use client';

import React, { useState } from 'react';
import { ZoomIn, PlayCircle } from 'lucide-react';

const ProductGallery = ({ images = [] }) => {
  const [activeImage, setActiveImage] = useState(images[0] || 'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=800&auto=format&fit=crop');

  const productImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1635773103241-d21056c8639a?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598501022234-7965b3413cb6?q=80&w=800&auto=format&fit=crop',
  ];

  return (
    <div className="space-y-6">
      {/* Main Image Container */}
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#101922] border border-slate-800 group cursor-zoom-in">
        <img 
          src={activeImage} 
          alt="Product Main" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
        />
        <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md text-white p-3 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <ZoomIn size={24} />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {productImages.map((img, idx) => (
          <button 
            key={idx}
            onClick={() => setActiveImage(img)}
            className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${activeImage === img ? 'border-[#1173d4] ring-4 ring-[#1173d4]/10' : 'border-slate-800 hover:border-slate-600'}`}
          >
            <img 
              src={img} 
              alt={`Thumbnail ${idx + 1}`} 
              className="w-full h-full object-cover"
            />
          </button>
        ))}
        {/* Mock Video Thumbnail */}
        <button className="aspect-square rounded-2xl overflow-hidden bg-[#1A2129] border border-slate-800 flex flex-col items-center justify-center text-slate-500 hover:text-white transition-all group">
          <PlayCircle size={32} className="group-hover:scale-110 transition-transform mb-1" />
          <span className="text-[8px] font-black uppercase tracking-widest">Video</span>
        </button>
      </div>
    </div>
  );
};

export default ProductGallery;
