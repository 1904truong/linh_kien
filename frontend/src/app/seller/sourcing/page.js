'use client';

import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  Truck, 
  MapPin, 
  CheckCircle2,
  Building2,
  Package,
  ArrowUpRight,
  Globe,
  Plus
} from 'lucide-react';
import useSellerStore from '@/store/useSellerStore';
import api from '@/lib/api'; // Use existing configured api instance

export default function SellerSourcing() {
  const { suppliers, fetchSuppliers, loading } = useSellerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [connectedSuppliers, setConnectedSuppliers] = useState([]);
  const [requestForm, setRequestForm] = useState({
    name: '',
    location: '',
    categories: '',
    description: ''
  });

  // Debouncing effect
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchSuppliers({ search: debouncedSearch });
  }, [debouncedSearch, fetchSuppliers]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...requestForm,
        categories: requestForm.categories
      };
      
      const response = await api.post('/seller/sourcing/requests', payload);
      
      if (response.data.success) {
        alert(response.data.message || 'Yêu cầu đã được gửi thành công!');
        setIsRequestModalOpen(false);
        setRequestForm({ name: '', location: '', categories: '', description: '' });
      }
    } catch (error) {
      console.error('Error requesting supplier:', error);
      alert(error.response?.data?.message || 'Có lỗi khi gửi yêu cầu. Vui lòng thử lại.');
    }
  };

  const handleConnect = (supplier) => {
    alert(`🤝 Lời mời kết nối đã được gửi đến: ${supplier.name}!\n\nNhà cung cấp sẽ nhận được thông báo và duyệt yêu cầu của bạn. Sau khi kết nối thành công, bạn sẽ nhận được mã giảm giá sỉ dành riêng cho đại lý.`);
    if (!connectedSuppliers.includes(supplier._id)) {
      setConnectedSuppliers(prev => [...prev, supplier._id]);
    }
  };

  // Safe fallback to empty array if undefined
  const displaySuppliers = suppliers || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Tìm kiếm nguồn hàng</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Kết nối với hàng ngàn nhà cung cấp uy tín để mở rộng gian hàng của bạn.</p>
        </div>
        <button 
          onClick={() => setIsRequestModalOpen(true)}
          className="flex items-center gap-3 px-6 py-4 bg-[#1173d4] text-white rounded-[24px] text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Plus size={20} />
          Đề xuất nhà cung cấp
        </button>
      </header>

      {/* Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[40px] p-8 shadow-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Building2 size={120} />
              </div>
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Đề xuất nhà cung cấp</h3>
                 <button onClick={() => setIsRequestModalOpen(false)} className="size-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-rose-500 hover:text-white transition-all">
                    <Plus size={24} className="rotate-45" />
                 </button>
              </div>
              
              <form onSubmit={handleRequestSubmit} className="space-y-6 relative">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Tên nhà cung cấp</label>
                    <input 
                      required
                      type="text" 
                      placeholder="VD: Phụ tùng chính hãng Toyota" 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-[20px] text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                      value={requestForm.name}
                      onChange={(e) => setRequestForm({...requestForm, name: e.target.value})}
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Vị trí / Địa chỉ</label>
                       <input 
                         required
                         type="text" 
                         placeholder="VD: Quận 7, TP. HCM" 
                         className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-[20px] text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                         value={requestForm.location}
                         onChange={(e) => setRequestForm({...requestForm, location: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Danh mục (phẩy)</label>
                       <input 
                         required
                         type="text" 
                         placeholder="VD: Phanh, Động cơ" 
                         className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-[20px] text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                         value={requestForm.categories}
                         onChange={(e) => setRequestForm({...requestForm, categories: e.target.value})}
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Mô tả ngắn</label>
                    <textarea 
                      placeholder="Thông tin về năng lực sản xuất, nguồn hàng..." 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-[20px] text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all h-28 resize-none dark:text-white"
                      value={requestForm.description}
                      onChange={(e) => setRequestForm({...requestForm, description: e.target.value})}
                    ></textarea>
                 </div>
                 <button type="submit" className="w-full py-4 bg-[#1173d4] text-white rounded-[20px] text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                    <Plus size={18} />
                    Gửi yêu cầu xét duyệt
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* Search & Tabs */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full relative group">
          <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 group-focus-within:text-[#1173d4] transition-colors">
            <Search size={20} />
          </span>
          <input 
            type="text" 
            placeholder="Tìm theo tên nhà cung cấp, loại linh kiện hoặc thương hiệu..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl focus:ring-4 focus:ring-[#1173d4]/10 focus:border-[#1173d4] outline-none text-sm transition-all shadow-sm font-medium"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
          <Filter size={18} />
          Lọc nâng cao
        </button>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {['Tất cả', 'Phanh & Gầm', 'Động cơ', 'Điện & Đèn', 'Nội thất', 'Dầu & Lốp'].map((cat, i) => (
          <button key={i} className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${i === 0 ? 'bg-[#1173d4] text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-500 hover:border-[#1173d4] hover:text-[#1173d4]'}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Marketplace & Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1173d4] flex items-center gap-2">
            <Building2 size={16} />
            Đề xuất nhà cung cấp
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displaySuppliers.map((sup) => (
              <div key={sup._id} className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-6 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 group relative overflow-hidden flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="size-16 rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm group-hover:scale-110 transition-transform duration-500">
                    <img src={sup.logo} alt={sup.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                     {sup.isVerified && (
                       <span className="flex items-center gap-1 bg-blue-500/10 text-[#1173d4] text-[8px] font-black px-2 py-1 rounded-full border border-blue-500/20 uppercase tracking-tighter shadow-sm">
                        <ShieldCheck size={10} /> Verified
                       </span>
                     )}
                     <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                        <Star size={12} fill="currentColor" /> {sup.rating}
                     </div>
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="font-black text-slate-900 dark:text-white leading-tight group-hover:text-[#1173d4] transition-colors line-clamp-2">{sup.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter mt-1 flex items-center gap-1">
                    <MapPin size={10} /> {sup.location}
                  </p>
                  <p className="mt-4 text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-3">
                    {sup.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {sup.categories.slice(0, 2).map((cat, i) => (
                      <span key={i} className="text-[9px] font-black uppercase tracking-tighter text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-md">{cat}</span>
                    ))}
                    {sup.categories.length > 2 && <span className="text-[9px] font-black text-slate-400">+{sup.categories.length - 2}</span>}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Giao hàng</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{sup.deliveryTime}</span>
                  </div>
                  <button 
                    onClick={() => handleConnect(sup)}
                    disabled={connectedSuppliers.includes(sup._id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${connectedSuppliers.includes(sup._id) ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 cursor-not-allowed' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-[#1173d4] hover:dark:bg-[#1173d4] dark:hover:text-white group-hover:shadow-lg group-hover:shadow-blue-500/30'}`}
                  >
                    {connectedSuppliers.includes(sup._id) ? 'Đã gửi lời mời' : 'Kết nối'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar: Your Connections & Stats */}
        <div className="space-y-8">
           <div className="bg-gradient-to-br from-[#1173d4] to-blue-700 rounded-[32px] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 size-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
              <h4 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center justify-between">
                Kho nguồn hàng của bạn
                <ArrowUpRight size={18} />
              </h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h5 className="text-2xl font-black">12</h5>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Nhà cung cấp đã nối</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <Package size={24} />
                  </div>
                  <div>
                    <h5 className="text-2xl font-black">450+</h5>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Sản phẩm có thể nhập</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-8 py-3.5 bg-white text-[#1173d4] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                Quản lý kho nguồn
              </button>
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
             <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-slate-400">Lợi ích từ nguồn hàng</h4>
             <div className="space-y-6">
               {[
                 { title: 'Tự động hóa kho', desc: 'Đồng bộ tồn kho thời gian thực với NCC.', icon: Globe },
                 { title: 'Giá sỉ đặc quyền', desc: 'Chiết khấu lên tới 30% cho đại lý XeParts.', icon: Plus },
                 { title: 'Logistics tích hợp', desc: 'Sử dụng đội ngũ vận chuyển của XeParts.', icon: Truck },
               ].map((item, i) => (
                 <div key={i} className="flex gap-4 group">
                    <div className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[#1173d4] group-hover:bg-[#1173d4]/5 transition-all outline-none border border-slate-100 dark:border-slate-700">
                      <item.icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</p>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-0.5">{item.desc}</p>
                    </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
