'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  FileText, 
  CreditCard, 
  Building2, 
  Landmark,
  Save,
  Clock
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import useUserStore from '@/store/useUserStore';

export default function SellerKYC() {
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    idCardNumber: user?.kycDetails?.idCardNumber || '',
    idCardFront: user?.kycDetails?.idCardFront || '',
    idCardBack: user?.kycDetails?.idCardBack || '',
    businessLicense: user?.kycDetails?.businessLicense || '',
    taxCode: user?.kycDetails?.taxCode || '',
    bankInfo: {
      bankName: user?.kycDetails?.bankInfo?.bankName || '',
      accountNumber: user?.kycDetails?.bankInfo?.accountNumber || '',
      accountName: user?.kycDetails?.bankInfo?.accountName || ''
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (field) => {
    // Simulated upload - in a real app, this would use a file input and upload to S3/Cloudinary
    const mockUrl = `https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=800&q=80&rand=${Math.random()}`;
    setFormData(prev => ({ ...prev, [field]: mockUrl }));
    toast.success('Đã tải ảnh lên thành công!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/kyc/submit', formData);
      if (response.data.success) {
        setUser(response.data.user);
        toast.success('Hồ sơ KYC đã được gửi! Vui lòng chờ quản trị viên duyệt.');
      }
    } catch (error) {
      console.error('KYC Submit Error:', error);
      toast.error(error.response?.data?.error || 'Đã có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  const isPending = user?.isApproved === false && user?.kycDetails?.submittedAt;
  const isApproved = user?.isApproved === true;
  const isRejected = user?.kycDetails?.rejectionReason && !user?.isApproved;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1173d4]/10 border border-[#1173d4]/20 text-[#1173d4] text-[10px] font-black uppercase tracking-widest mb-2">
            <ShieldCheck size={12} />
            Xác thực định danh
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white uppercase">Xác minh tài khoản</h2>
          <p className="text-slate-500 text-sm font-medium">Hoàn thiện hồ sơ để bắt đầu kinh doanh trên hệ thống.</p>
        </div>
      </header>

      {/* Status Banner */}
      {isPending && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 flex items-center gap-4 animate-pulse">
          <div className="size-12 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <h4 className="text-amber-500 font-black text-sm uppercase tracking-widest">Đang chờ phê duyệt</h4>
            <p className="text-amber-500/70 text-xs font-medium mt-1">Hồ sơ của bạn đã được gửi vào {new Date(user.kycDetails.submittedAt).toLocaleDateString('vi-VN')}. Quá trình duyệt mất 1-2 ngày làm việc.</p>
          </div>
        </div>
      )}

      {isApproved && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <h4 className="text-emerald-500 font-black text-sm uppercase tracking-widest">Đã xác minh</h4>
            <p className="text-emerald-500/70 text-xs font-medium mt-1">Chúc mừng! Gian hàng của bạn đã sẵn sàng hoạt động.</p>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-6 flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-rose-500/20 text-rose-500 flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div className="flex-1">
            <h4 className="text-rose-500 font-black text-sm uppercase tracking-widest">Yêu cầu bổ sung thông tin</h4>
            <p className="text-rose-500/70 text-xs font-semibold mt-1 italic">Lý do: {user.kycDetails.rejectionReason}</p>
          </div>
          <button className="px-4 py-2 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all">Sửa lại</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Info */}
          <div className="bg-[#1A2632] border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-800 flex items-center gap-4 bg-slate-800/20">
               <div className="p-3 rounded-2xl bg-[#1173d4]/10 text-[#1173d4]">
                  <CreditCard size={24} />
               </div>
               <h3 className="font-black uppercase tracking-[0.2em] text-sm text-white">Thông tin cá nhân / Đại diện</h3>
            </div>
            <div className="p-8 space-y-6">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Số CCCD / Hộ chiếu</label>
                  <input 
                    type="text" 
                    name="idCardNumber"
                    value={formData.idCardNumber}
                    onChange={handleInputChange}
                    required
                    disabled={isPending || isApproved}
                    className="w-full bg-[#101922] border border-slate-800 rounded-2xl focus:ring-2 focus:ring-[#1173d4]/50 py-4 px-5 text-sm font-bold text-white transition-all disabled:opacity-50" 
                    placeholder="Nhập 12 số CCCD..." 
                  />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Mặt trước CCCD</label>
                     <div 
                       onClick={() => !isPending && !isApproved && handleImageUpload('idCardFront')}
                       className={`aspect-[1.6/1] rounded-2xl border-2 border-dashed border-slate-800 bg-[#101922] flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-[#1173d4]/50 transition-all overflow-hidden relative ${isPending || isApproved ? 'cursor-not-allowed opacity-80' : ''}`}
                     >
                        {formData.idCardFront ? (
                          <img src={formData.idCardFront} className="w-full h-full object-cover" alt="Front" />
                        ) : (
                          <>
                            <Upload className="text-slate-600 group-hover:text-[#1173d4] transition-colors" size={32} />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Tải ảnh mặt trước</span>
                          </>
                        )}
                     </div>
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Mặt sau CCCD</label>
                     <div 
                       onClick={() => !isPending && !isApproved && handleImageUpload('idCardBack')}
                       className={`aspect-[1.6/1] rounded-2xl border-2 border-dashed border-slate-800 bg-[#101922] flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-[#1173d4]/50 transition-all overflow-hidden relative ${isPending || isApproved ? 'cursor-not-allowed opacity-80' : ''}`}
                     >
                        {formData.idCardBack ? (
                          <img src={formData.idCardBack} className="w-full h-full object-cover" alt="Back" />
                        ) : (
                          <>
                            <Upload className="text-slate-600 group-hover:text-[#1173d4] transition-colors" size={32} />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Tải ảnh mặt sau</span>
                          </>
                        )}
                     </div>
                  </div>
               </div>
            </div>
          </div>

          {/* Business Info */}
          <div className="bg-[#1A2632] border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-slate-800 flex items-center gap-4 bg-slate-800/20">
               <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Building2 size={24} />
               </div>
               <h3 className="font-black uppercase tracking-[0.2em] text-sm text-white">Thông tin doanh nghiệp / Hộ KD</h3>
            </div>
            <div className="p-8 space-y-6">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mã số thuế / Giấy phép kinh doanh số</label>
                  <input 
                    type="text" 
                    name="taxCode"
                    value={formData.taxCode}
                    onChange={handleInputChange}
                    disabled={isPending || isApproved}
                    className="w-full bg-[#101922] border border-slate-800 rounded-2xl focus:ring-2 focus:ring-[#1173d4]/50 py-4 px-5 text-sm font-bold text-white disabled:opacity-50" 
                    placeholder="Nhập mã số thuế..." 
                  />
               </div>
               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Ảnh Giấy phép kinh doanh</label>
                  <div 
                    onClick={() => !isPending && !isApproved && handleImageUpload('businessLicense')}
                    className={`h-48 rounded-2xl border-2 border-dashed border-slate-800 bg-[#101922] flex items-center justify-center gap-4 group cursor-pointer hover:border-[#1173d4]/50 transition-all overflow-hidden relative ${isPending || isApproved ? 'cursor-not-allowed opacity-80' : ''}`}
                  >
                     {formData.businessLicense ? (
                       <img src={formData.businessLicense} className="w-full h-full object-cover" alt="License" />
                     ) : (
                       <div className="flex flex-col items-center gap-2">
                         <FileText className="text-slate-600 group-hover:text-[#1173d4] transition-colors" size={32} />
                         <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Tải lên file ảnh giấy phép</span>
                       </div>
                     )}
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           {/* Bank Info */}
           <div className="bg-[#1A2632] border border-slate-800 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 w-fit mb-6">
                 <Landmark size={24} />
              </div>
              <h4 className="text-xl font-black text-white tracking-tight mb-6 uppercase">Thông tin tài khoản ngân hàng</h4>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Tên ngân hàng</label>
                    <input 
                      type="text" 
                      name="bankInfo.bankName"
                      value={formData.bankInfo.bankName}
                      onChange={handleInputChange}
                      disabled={isPending || isApproved}
                      className="w-full bg-[#101922] border border-slate-800 rounded-xl p-3 text-xs font-bold text-white disabled:opacity-50"
                      placeholder="VD: Vietcombank"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Số tài khoản</label>
                    <input 
                      type="text" 
                      name="bankInfo.accountNumber"
                      value={formData.bankInfo.accountNumber}
                      onChange={handleInputChange}
                      disabled={isPending || isApproved}
                      className="w-full bg-[#101922] border border-slate-800 rounded-xl p-3 text-xs font-bold text-white disabled:opacity-50"
                      placeholder="123456789..."
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Chủ tài khoản</label>
                    <input 
                      type="text" 
                      name="bankInfo.accountName"
                      value={formData.bankInfo.accountName}
                      onChange={handleInputChange}
                      disabled={isPending || isApproved}
                      className="w-full bg-[#101922] border border-slate-800 rounded-xl p-3 text-xs font-black text-white uppercase disabled:opacity-50"
                      placeholder="NGUYEN VAN A"
                    />
                 </div>
                 
                 {!isPending && !isApproved && (
                   <button 
                     type="submit"
                     disabled={loading}
                     className="w-full bg-[#1173d4] hover:bg-blue-600 text-white p-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
                   >
                     {loading ? 'Đang xử lý...' : 'Gửi hồ sơ xét duyệt'}
                     <ArrowRight size={16} />
                   </button>
                 )}
              </div>
           </div>

           {/* Why KYC? */}
           <div className="bg-blue-500/5 border border-blue-500/10 rounded-3xl p-8 space-y-4">
              <h5 className="text-[10px] font-black text-[#1173d4] uppercase tracking-[0.2em]">Tại sao cần xác thực?</h5>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed italic">
                Để đảm bảo tính minh bạch và bảo vệ quyền lợi của cả người mua và người bán, XeParts yêu cầu xác định danh tính đối tác trước khi kích hoạt gian hàng và cho phép thanh toán.
              </p>
           </div>
        </div>
      </form>
    </div>
  );
}
