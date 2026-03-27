'use client';

import React, { useState } from 'react';
import { 
  Info, 
  LayoutGrid, 
  FileText, 
  Image as ImageIcon, 
  CreditCard, 
  CheckCircle2,
  Upload,
  X,
  Plus,
  ArrowRight,
  Save,
  ChevronRight,
  Sliders,
  Settings,
  Lightbulb,
  AlertCircle,
  FileBadge,
  Camera,
  Layers,
  Globe,
  Truck,
  Eye,
  Send,
  XCircle,
  Package2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    oemCode: '',
    category: 'engine',
    description: '',
    price: '',
    inventory: '',
    safetyStock: 5,
    status: 'Hiển thị (Công khai)',
    compatibility: ['Toyota Camry (2018-2024)', 'Toyota Avalon (2019-2022)']
  });

  const [images, setImages] = useState([]);
  const [newCompatibility, setNewCompatibility] = useState('');
  const [showCompatibilityInput, setShowCompatibilityInput] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.inventory) {
      alert('Vui lòng nhập đầy đủ Tên sản phẩm, Giá và Số lượng tồn kho.');
      return;
    }
    
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        SKU: formData.oemCode || `SKU-${Date.now()}`,
        price: Number(formData.price),
        stock: Number(formData.inventory),
        lowStockThreshold: Number(formData.safetyStock),
        description: formData.description,
        category: formData.category,
        compatibility: formData.compatibility, // Assuming backend schema can be updated or ignores this
        images: images, // Send base64 images
      };

      await api.post('/seller/products', payload);
      router.push('/seller/products');
    } catch (error) {
      console.error('Error creating product:', error);
      alert(error.response?.data?.message || 'Đã có lỗi xảy ra khi đăng sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRemoveCompatibility = (index) => {
    setFormData(prev => ({
      ...prev,
      compatibility: prev.compatibility.filter((_, i) => i !== index)
    }));
  };

  const handleAddCompatibility = () => {
    if (newCompatibility.trim()) {
      setFormData(prev => ({
        ...prev,
        compatibility: [...prev.compatibility, newCompatibility.trim()]
      }));
      setNewCompatibility('');
      setShowCompatibilityInput(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Breadcrumb & Title */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Link href="/seller/products" className="hover:text-[#1173d4] transition-colors">Sản phẩm</Link>
            <ChevronRight size={14} />
            <span className="text-slate-900 dark:text-white">Thêm sản phẩm mới</span>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Thêm sản phẩm mới</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Cung cấp thông tin chi tiết để tối ưu hóa khả năng tìm kiếm của khách hàng.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-sm">Lưu bản nháp</button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Basic Info */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10 text-[#1173d4]">
                <Info size={20} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">Thông tin cơ bản</h3>
            </div>
            <div className="p-8 space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tên sản phẩm <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#1173d4]/50 p-4 text-sm font-medium placeholder:text-slate-400" 
                  placeholder="Ví dụ: Má phanh trước Toyota Camry 2020" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Thương hiệu</label>
                  <select 
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#1173d4]/50 p-4 text-sm font-medium"
                  >
                    <option value="">Chọn thương hiệu</option>
                    <option value="Toyota">Toyota Genuine Parts</option>
                    <option value="Bosch">Bosch</option>
                    <option value="Denso">Denso</option>
                    <option value="Brembo">Brembo</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Mã OEM / Part Number</label>
                  <input 
                    type="text" 
                    name="oemCode"
                    value={formData.oemCode}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#1173d4]/50 p-4 text-sm font-medium placeholder:text-slate-400" 
                    placeholder="Ví dụ: 04465-06150" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category & Compatibility */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                <Layers size={20} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">Phân loại & Tương thích</h3>
            </div>
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Danh mục sản phẩm <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { id: 'brake', label: 'Hệ thống phanh', icon: Sliders },
                    { id: 'engine', label: 'Động cơ', icon: Plus },
                    { id: 'electric', label: 'Hệ thống điện', icon: Lightbulb },
                  ].map((cat) => (
                    <button 
                      key={cat.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                      className={`flex flex-col items-center justify-center p-6 border-2 rounded-xl transition-all group ${
                        formData.category === cat.id 
                          ? 'border-[#1173d4] bg-[#1173d4]/5 text-[#1173d4]' 
                          : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                      }`}
                    >
                      <cat.icon size={28} className={`mb-3 ${formData.category === cat.id ? 'text-[#1173d4]' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold uppercase tracking-wider text-center">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Dòng xe tương thích</label>
                <div className="flex flex-wrap gap-3 items-center">
                  {formData.compatibility.map((car, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 bg-[#1173d4]/10 text-[#1173d4] text-[11px] font-bold rounded-full border border-[#1173d4]/20">
                      {car}
                      <X size={14} className="cursor-pointer hover:scale-110 transition-transform" onClick={() => handleRemoveCompatibility(i)} />
                    </div>
                  ))}
                  
                  {showCompatibilityInput ? (
                    <div className="flex items-center gap-2">
                       <input 
                         type="text" 
                         value={newCompatibility}
                         onChange={(e) => setNewCompatibility(e.target.value)}
                         onKeyDown={(e) => e.key === 'Enter' && handleAddCompatibility()}
                         autoFocus
                         className="px-3 py-1.5 text-[11px] font-bold border border-slate-300 dark:border-slate-700 rounded-full focus:outline-none focus:ring-1 focus:ring-[#1173d4] bg-transparent"
                         placeholder="Nhập và ấn Enter..."
                       />
                       <X size={14} className="text-slate-400 cursor-pointer" onClick={() => setShowCompatibilityInput(false)} />
                    </div>
                  ) : (
                    <button type="button" onClick={() => setShowCompatibilityInput(true)} className="flex items-center gap-2 px-4 py-2 border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 text-[11px] font-bold rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                      <Plus size={14} /> Thêm dòng xe
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                <FileText size={20} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">Mô tả sản phẩm</h3>
            </div>
            <div className="p-8">
               <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-inner">
                  <div className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 p-3 flex gap-4">
                     {['Bold', 'Italic', 'List', 'Link', 'Image'].map((tool, i) => (
                       <button key={i} type="button" className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-500 transition-colors">
                          <span className="text-xs font-bold">{tool[0]}</span>
                       </button>
                     ))}
                  </div>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-none focus:ring-0 p-6 text-sm font-medium leading-relaxed min-h-[200px]" 
                    placeholder="Nhập mô tả chi tiết về sản phẩm, bao gồm tình trạng, chất liệu, tính năng nổi bật..."
                  ></textarea>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Images */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                <Camera size={20} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">Hình ảnh sản phẩm</h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {images.map((imgUrl, idx) => (
                  <div key={idx} className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl relative overflow-hidden group">
                    <img src={imgUrl} alt="upload" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="aspect-square bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-[#1173d4] hover:text-[#1173d4] transition-all group">
                    <Upload size={24} className="mb-2 group-hover:-translate-y-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Tải ảnh lên</span>
                    <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
                  </label>
                )}
              </div>
              <p className="text-[11px] text-slate-500 text-center font-medium">Định dạng JPG, PNG. Tối đa 5MB mỗi ảnh. Nên sử dụng ảnh nền trắng.</p>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                <CreditCard size={20} />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">Giá & Kho hàng</h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Giá bán (VND) <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#1173d4]/50 py-4 px-5 pr-12 text-sm font-black" 
                    placeholder="0" 
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₫</span>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Số lượng tồn kho <span className="text-red-500">*</span></label>
                <input 
                  type="number" 
                  name="inventory"
                  value={formData.inventory}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#1173d4]/50 py-4 px-5 text-sm font-bold" 
                  placeholder="0" 
                />
              </div>
              <div className="pt-4 flex items-center justify-between">
                 <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Cho phép đặt trước</label>
                 <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer transition-colors peer-checked:bg-[#1173d4]">
                    <span className="sr-only">Toggle</span>
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1 peer-checked:translate-x-6" />
                 </div>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className="bg-gradient-to-br from-[#1173d4] to-blue-600 rounded-2xl p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
            <div className="absolute right-[-20px] top-[-20px] size-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
            <h4 className="font-bold flex items-center gap-2 mb-3">
              <CheckCircle2 size={20} />
              Trạng thái hiển thị
            </h4>
            <p className="text-xs text-blue-50/80 mb-6 leading-relaxed">Sản phẩm sẽ được hiển thị ngay lập tức trên cửa hàng sau khi đăng.</p>
            <select 
               name="status"
               value={formData.status}
               onChange={handleInputChange}
               className="w-full bg-white/10 border-white/20 text-white rounded-xl focus:ring-white/30 text-sm font-bold p-3"
            >
              <option className="text-slate-900">Hiển thị (Công khai)</option>
              <option className="text-slate-900">Ẩn (Chờ duyệt)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <footer className="pt-10 flex items-center justify-end gap-6 border-t border-slate-200 dark:border-slate-800 mt-10">
        <button 
          onClick={() => router.back()}
          className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          Hủy bỏ
        </button>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#1173d4] hover:bg-[#1173d4]/90 text-white px-10 py-3.5 rounded-xl font-black text-sm flex items-center gap-3 transition-all shadow-xl shadow-blue-500/30 active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Đăng sản phẩm ngay'}
          <CheckCircle2 size={20} />
        </button>
      </footer>
    </div>
  );
}
