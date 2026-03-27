'use client';

import React, { useState } from 'react';
import { 
  Headphones, 
  ShieldAlert, 
  ChevronRight, 
  PhoneCall, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  Wrench, 
  Search,
  MessageSquare, 
  FileText,
  HelpCircle,
  History,
  Info,
  Upload,
  X,
  Plus
} from 'lucide-react';

export default function HelpCenterPage() {
  const [activeTab, setActiveTab] = useState('complaint');

  const menuItems = [
    { id: 'faq', label: 'Câu hỏi thường gặp', icon: <HelpCircle size={18} /> },
    { id: 'policy', label: 'Chính sách đổi trả', icon: <Scale size={18} /> },
    { id: 'complaint', label: 'Gửi yêu cầu khiếu nại', icon: <AlertTriangle size={18} /> },
    { id: 'history', label: 'Lịch sử khiếu nại', icon: <History size={18} /> },
    { id: 'warranty', label: 'Chính sách bảo hành', icon: <ShieldAlert size={18} /> },
  ];

  const handleUpload = () => {
    // Mock upload handler
    console.log('Upload triggered');
  };

  return (
    <div className="min-h-screen bg-[#101922] text-slate-100 pb-24">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-[#1A2129]/50 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-10 flex items-center justify-center rounded-xl bg-[#1173d4] text-white">
              <Headphones size={24} />
            </div>
            <h2 className="text-white text-xl font-black leading-tight tracking-tight uppercase">Trung tâm Trợ giúp</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8 items-center">
            <div className="hidden md:flex relative w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  className="w-full bg-[#101922] border border-slate-800 rounded-xl py-2.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-[#1173d4] outline-none transition-all" 
                  placeholder="Tìm kiếm hỗ trợ..."
                />
            </div>
            <div className="flex gap-4">
               <button className="bg-slate-800 p-2.5 rounded-xl text-slate-400 hover:text-white transition-colors">
                  <Search size={22} className="md:hidden" />
               </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 border-r border-slate-800 p-8 flex flex-col bg-[#1A2129]/20">
          <div className="mb-8">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 px-2">Danh mục hỗ trợ</h3>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button 
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-[#1173d4] text-white shadow-xl shadow-[#1173d4]/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                >
                  <span className={activeTab === item.id ? 'text-white' : 'text-slate-500'}>{item.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-8 rounded-3xl bg-[#1173d4]/5 border border-[#1173d4]/10">
            <p className="text-[10px] font-black text-[#1173d4] uppercase tracking-widest mb-2">Cần hỗ trợ gấp?</p>
            <p className="text-xs text-slate-500 font-bold leading-relaxed mb-6">Tổng đài hỗ trợ kỹ thuật và khiếu nại 24/7 của XeParts.</p>
            <button className="w-full py-4 bg-[#1173d4] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-[#1173d4]/90 transition-all shadow-lg shadow-[#1173d4]/10">
              Gọi ngay: 1900 1234
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 p-10 lg:p-20 overflow-y-auto">
          <div className="max-w-3xl">
            {activeTab === 'complaint' && (
              <div className="animate-in fade-in duration-700">
                <div className="mb-12">
                   <div className="flex items-center gap-3 text-rose-500 mb-4">
                     <AlertTriangle size={24} />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em]">Bảo vệ người mua</span>
                   </div>
                   <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Gửi yêu cầu khiếu nại</h1>
                   <p className="text-slate-500 font-medium leading-relaxed">Vui lòng điền thông tin chi tiết về vấn đề bạn gặp phải để đội ngũ kỹ thuật của XeParts có thể hỗ trợ giải quyết nhanh nhất.</p>
                </div>

                <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
                  {/* Order Selection */}
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Chọn đơn hàng cần khiếu nại <span className="text-rose-500">*</span></label>
                    <div className="relative group">
                      <select defaultValue="" className="w-full appearance-none rounded-2xl border border-slate-800 bg-[#1A2129] px-6 py-5 text-sm font-bold text-white focus:border-[#1173d4] outline-none transition-all cursor-pointer">
                        <option disabled value="">Chọn mã đơn hàng (ví dụ: #DH12459)</option>
                        <option value="ord1">#DH12459 - Bugi Toyota Vios 2018</option>
                        <option value="ord2">#DH12450 - Má phanh Toyota Camry 2022</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-slate-500">
                        <ChevronRight className="rotate-90" size={18} />
                      </div>
                    </div>
                  </div>

                  {/* Reason Selection */}
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Lý do khiếu nại <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <select defaultValue="" className="w-full appearance-none rounded-2xl border border-slate-800 bg-[#1A2129] px-6 py-5 text-sm font-bold text-white focus:border-[#1173d4] outline-none transition-all cursor-pointer">
                        <option disabled value="">Chọn lý do</option>
                        <option value="damaged">Sản phẩm bị hư hỏng/vỡ do vận chuyển</option>
                        <option value="wrong_item">Giao sai sản phẩm / Không đúng mã OEM</option>
                        <option value="missing_part">Thiếu phụ kiện kèm theo</option>
                        <option value="not_described">Sản phẩm không đúng mô tả kỹ thuật</option>
                        <option value="other">Thanh toán rồi nhưng chưa nhận được hàng</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-slate-500">
                        <ChevronRight className="rotate-90" size={18} />
                      </div>
                    </div>
                  </div>

                  {/* Description Area */}
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Mô tả chi tiết vấn đề <span className="text-rose-500">*</span></label>
                    <textarea 
                      className="w-full rounded-2xl border border-slate-800 bg-[#1A2129] px-6 py-5 text-sm font-bold text-white focus:border-[#1173d4] outline-none transition-all placeholder:text-slate-700 min-h-[150px] resize-none" 
                      placeholder="Hãy mô tả rõ tình trạng sản phẩm khi nhận được hoặc lý do bạn không hài lòng..."
                    />
                  </div>

                  {/* Proof Upload */}
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Đính kèm ảnh/video bằng chứng <span className="text-rose-500">*</span></label>
                    <div 
                      onClick={handleUpload}
                      className="border-2 border-dashed border-slate-800 rounded-[32px] p-12 flex flex-col items-center justify-center bg-[#1A2129]/50 hover:bg-[#1A2129] hover:border-[#1173d4]/50 transition-all cursor-pointer group"
                    >
                      <div className="size-16 rounded-full bg-[#1173d4]/10 text-[#1173d4] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                        <Upload size={32} />
                      </div>
                      <p className="text-sm font-black text-white mb-2">Nhấn để tải lên hoặc kéo thả tệp</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">PNG, JPG hoặc MP4 (Tối đa 20MB)</p>
                    </div>

                    <div className="grid grid-cols-4 gap-6 mt-8">
                      {/* Mock Previews */}
                      <div className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
                        <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?q=80&w=400&auto=format&fit=crop" alt="Defect proof" />
                        <button className="absolute top-2 right-2 size-7 bg-rose-500 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                          <X size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-slate-800 bg-[#101922] text-slate-700 hover:text-[#1173d4] hover:border-[#1173d4]/50 transition-all cursor-pointer">
                        <Plus size={24} />
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-10 flex items-center justify-end gap-6 border-t border-slate-800">
                    <button className="px-10 py-5 rounded-2xl border border-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all" type="button">
                      Hủy bỏ
                    </button>
                    <button className="px-12 py-5 rounded-2xl bg-[#1173d4] text-white font-black text-[10px] uppercase tracking-widest hover:bg-[#1173d4]/90 shadow-2xl shadow-[#1173d4]/20 transition-all active:scale-95" type="submit">
                      Gửi yêu cầu ngay
                    </button>
                  </div>
                </form>

                {/* Tips */}
                <div className="mt-16 p-10 rounded-[40px] bg-gradient-to-br from-[#1173d4]/5 to-[#1A2129] border border-slate-800">
                  <div className="flex gap-6">
                    <div className="text-[#1173d4] pt-1">
                      <Info size={32} />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white uppercase tracking-tight mb-3">Mẹo nhỏ cho bạn</h4>
                      <ul className="text-xs text-slate-500 space-y-4 font-bold leading-relaxed">
                        <li className="flex items-start gap-3">• <span className="text-slate-400">Chụp ảnh rõ nét tem vận đơn trên kiện hàng khi nhận.</span></li>
                        <li className="flex items-start gap-3">• <span className="text-slate-400">Quay video lúc mở hộp (unboxing) để việc giải quyết được ưu tiên hàng đầu.</span></li>
                        <li className="flex items-start gap-3">• <span className="text-slate-400">Thời gian phản hồi thông thường trong vòng 24h làm việc.</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'faq' && (
              <div className="py-20 text-center animate-in fade-in duration-700">
                <div className="w-20 h-20 bg-slate-800/50 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-[#1173d4]">
                  <HelpCircle size={40} />
                </div>
                <h2 className="text-3xl font-black text-white mb-4">Câu hỏi thường gặp</h2>
                <p className="text-slate-500 font-medium">Chúng tôi đang cập nhật các câu hỏi mới nhất từ người dùng.</p>
              </div>
            )}

            {activeTab === 'policy' && (
              <div className="py-20 text-center animate-in fade-in duration-700">
                <div className="w-20 h-20 bg-slate-800/50 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-[#1173d4]">
                  <Scale size={40} />
                </div>
                <h2 className="text-3xl font-black text-white mb-4">Chính sách đổi trả</h2>
                <p className="text-slate-500 font-medium">Hệ thống đang đồng bộ dữ liệu chính sách mới.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
