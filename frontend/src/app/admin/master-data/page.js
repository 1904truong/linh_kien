'use client';

import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Car, 
  Settings2, 
  Layers, 
  Edit3, 
  Trash2, 
  Save, 
  X,
  FileSpreadsheet,
  Download,
  RotateCw
} from 'lucide-react';

export default function MasterData() {
  const [activeTab, setActiveTab] = useState('car-models');
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [supplierStatus, setSupplierStatus] = useState('approved');
  
  const carMakes = [
    { id: 1, name: 'Toyota', models: ['Vios', 'Camry', 'Innova', 'Fortuner', 'Corolla Cross'], count: 142 },
    { id: 2, name: 'BMW', models: ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X7'], count: 89 },
    { id: 3, name: 'Mercedes-Benz', models: ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE'], count: 124 },
    { id: 4, name: 'Hyundai', models: ['Accent', 'Elantra', 'Santa Fe', 'Tucson', 'Kona'], count: 95 },
  ];

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5001/api/suppliers?status=${supplierStatus}`);
      const data = await res.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5001/api/suppliers/${id}/approve`, { method: 'PATCH' });
      if (res.ok) {
        alert('Đã duyệt nhà cung cấp!');
        fetchSuppliers();
      }
    } catch (error) {
      console.error('Error approving supplier:', error);
    }
  };

  const handleReject = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn từ chối nhà cung cấp này?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/suppliers/${id}/reject`, { method: 'PATCH' });
      if (res.ok) {
        alert('Đã từ chối nhà cung cấp!');
        fetchSuppliers();
      }
    } catch (error) {
      console.error('Error rejecting supplier:', error);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'suppliers') {
      fetchSuppliers();
    }
  }, [activeTab, supplierStatus]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Title & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Cấu hình Master Data</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-1">Quản lý dữ liệu gốc: Dòng xe, Mã lỗi, Cây danh mục & Nhà cung cấp</p>
        </div>
        <div className="flex bg-[#1A2632] p-1 rounded-2xl border border-[#2d3d4d] overflow-x-auto no-scrollbar">
          {[
            { id: 'car-models', label: 'Dòng xe' },
            { id: 'suppliers', label: 'Nhà cung cấp' },
            { id: 'error-codes', label: 'Mã lỗi' },
            { id: 'categories', label: 'Danh mục' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-[#1173d4] text-white shadow-lg shadow-blue-500/10' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'car-models' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / List View */}
          <div className="bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] p-6 shadow-2xl h-fit">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hãng xe (Makes)</h4>
              <button className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20">
                  <Plus size={16} />
              </button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
              <input 
                  type="text" 
                  placeholder="Tìm hãng..." 
                  className="w-full bg-[#101922] border border-[#2d3d4d] text-white rounded-xl pl-10 pr-4 py-2 text-[10px] font-bold focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              {carMakes.map(make => (
                <button 
                  key={make.id}
                  className="w-full flex items-center justify-between px-4 py-3 bg-[#101922] hover:bg-slate-700/50 rounded-2xl border border-transparent hover:border-[#2d3d4d] transition-all group"
                >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-slate-800 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Car size={16} />
                      </div>
                      <span className="text-xs font-black text-slate-300 group-hover:text-white transition-colors">{make.name}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-600">{make.count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content View / Detailed Config */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-[#2d3d4d] flex items-center justify-between bg-gradient-to-r from-[#1A2632] to-[#101922]">
                  <div className="flex items-center gap-4">
                      <div className="size-16 rounded-[24px] bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary">
                        <Car size={32} strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-white tracking-tight">Toyota</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Đang quản lý 142 phiên bản xe</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-3">
                      <button className="p-3 bg-slate-800 border border-slate-700 rounded-2xl text-slate-400 hover:text-white transition-all shadow-xl">
                        <FileSpreadsheet size={20} />
                      </button>
                      <button className="px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all flex items-center gap-3">
                        <Plus size={18} />
                        Thêm Model mới
                      </button>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {carMakes[0].models.map((model, i) => (
                        <div key={i} className="flex items-center justify-between p-5 bg-[#101922] border border-[#2d3d4d] rounded-[24px] group hover:border-slate-500 transition-all">
                          <div className="flex items-center gap-4">
                              <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">
                                <Settings2 size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-black text-white">{model}</p>
                                <p className="text-[10px] font-bold text-slate-600 uppercase">24 biến thể</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 hover:bg-white/10 text-slate-500 hover:text-primary rounded-lg">
                                <Edit3 size={16} />
                              </button>
                              <button className="p-2 hover:bg-rose-400/10 text-slate-500 hover:text-rose-400 rounded-lg">
                                <Trash2 size={16} />
                              </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="p-8 bg-[#101922]/50 border-t border-[#2d3d4d] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                      <div className="size-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bộ lọc hiện tại: Toyota / Tất cả năm</span>
                  </div>
                  <button className="text-[10px] font-black text-primary hover:underline flex items-center gap-2">
                      Cấu hình nâng cao <ChevronRight size={14} />
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div className="bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="p-8 border-b border-[#2d3d4d] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-black text-white tracking-tight">Danh sách Nhà cung cấp</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Quản lý nguồn hàng Master cho toàn bộ Seller</p>
            </div>
            <div className="flex items-center bg-[#101922] p-1 rounded-2xl border border-[#2d3d4d]">
               <button 
                 onClick={() => setSupplierStatus('approved')}
                 className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${supplierStatus === 'approved' ? 'bg-[#1173d4] text-white' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 Đang hoạt động
               </button>
               <button 
                 onClick={() => setSupplierStatus('pending')}
                 className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${supplierStatus === 'pending' ? 'bg-amber-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
               >
                 Chờ xét duyệt
               </button>
            </div>
            <button className="px-6 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-3">
              <Plus size={18} />
              Thêm Nhà cung cấp
            </button>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full py-20 flex flex-col items-center gap-4 text-slate-500">
                  <RotateCw className="animate-spin" size={32} />
                  <p className="text-[10px] font-black uppercase tracking-widest">Đang tải dữ liệu...</p>
                </div>
              ) : suppliers.length === 0 ? (
                <div className="col-span-full py-20 flex flex-col items-center gap-4 text-slate-500 opacity-20">
                   <Layers size={64} />
                   <p className="text-[10px] font-black uppercase tracking-widest">Chưa có nhà cung cấp nào ở trạng thái này</p>
                </div>
              ) : suppliers.map(sup => (
                <div key={sup._id} className="bg-[#101922] border border-[#2d3d4d] rounded-[24px] p-6 hover:border-slate-500 transition-all group">
                   <div className="flex items-start justify-between mb-4">
                      <div className="size-14 rounded-xl bg-slate-800 overflow-hidden border border-[#2d3d4d]">
                         {sup.logo ? <img src={sup.logo} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-600"><Layers size={24} /></div>}
                      </div>
                      <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-tighter ${
                        sup.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                        sup.isVerified ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 
                        'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}>
                         {sup.status === 'pending' ? 'Pending Approval' : sup.isVerified ? 'Verified' : 'Unverified'}
                      </div>
                   </div>
                   <h4 className="text-sm font-black text-white group-hover:text-primary transition-colors">{sup.name}</h4>
                   <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 font-bold">
                      <Database size={10} /> {sup.location || 'Chưa cập nhật địa chỉ'}
                   </p>
                   <div className="mt-4 flex flex-wrap gap-2">
                      {sup.categories?.map((cat, i) => (
                        <span key={i} className="text-[8px] font-black uppercase tracking-tighter bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">{cat}</span>
                      ))}
                   </div>

                   {sup.status === 'pending' ? (
                     <div className="mt-6 pt-6 border-t border-[#2d3d4d] grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => handleReject(sup._id)}
                          className="py-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                           Từ chối
                        </button>
                        <button 
                          onClick={() => handleApprove(sup._id)}
                          className="py-2.5 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                           Phê duyệt
                        </button>
                     </div>
                   ) : (
                     <div className="mt-6 pt-6 border-t border-[#2d3d4d] flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-white/10 text-slate-500 hover:text-primary rounded-lg transition-all">
                           <Edit3 size={16} />
                        </button>
                        <button className="p-2 hover:bg-rose-400/10 text-slate-500 hover:text-rose-400 rounded-lg transition-all">
                           <Trash2 size={16} />
                        </button>
                     </div>
                   )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Other tabs placeholder */}
      {(activeTab === 'error-codes' || activeTab === 'categories') && (
        <div className="bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] p-20 flex flex-col items-center gap-4 text-slate-500 opacity-50">
           <Database size={48} />
           <p className="text-[10px] font-black uppercase tracking-widest mt-2">{activeTab} management coming soon</p>
        </div>
      )}

    </div>
  );
}
