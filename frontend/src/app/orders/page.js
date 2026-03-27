'use client';

import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Search, 
  MapPin, 
  Box, 
  ArrowRight,
  ShieldCheck,
  Headphones,
  Check,
  History,
  Timer
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useEffect } from 'react';

const getStatusLabel = (status) => {
  const mapping = {
    'pending': 'Chờ xác nhận',
    'processing': 'Đang xử lý',
    'shipped': 'Đang giao',
    'delivered': 'Đã giao',
    'cancelled': 'Đã hủy'
  };
  return mapping[status] || status;
};

const getProgress = (status) => {
  const mapping = {
    'pending': 20,
    'processing': 40,
    'shipped': 70,
    'delivered': 100,
    'cancelled': 0
  };
  return mapping[status] || 0;
};

const OrderStepper = ({ progress, statusId }) => {
  const steps = [
    { label: 'Đã đặt', icon: <Check size={14} />, minProgress: 0 },
    { label: 'Đã xác nhận', icon: <Package size={14} />, minProgress: 40 },
    { label: 'Đang giao', icon: <Truck size={14} />, minProgress: 70 },
    { label: 'Hoàn thành', icon: <CheckCircle2 size={14} />, minProgress: 100 },
  ];

  return (
    <div className="relative flex items-center justify-between w-full mt-12 mb-6 px-2">
      <div className="absolute left-0 top-4 -translate-y-1/2 h-1 w-full bg-slate-800 rounded-full" />
      <div 
        className="absolute left-0 top-4 -translate-y-1/2 h-1 bg-[#1173d4] rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(17,115,212,0.5)]" 
        style={{ width: `${progress}%` }}
      />
      
      {steps.map((step, index) => {
        const isActive = progress >= step.minProgress;
        return (
          <div key={index} className="relative z-10 flex flex-col items-center gap-3">
            <div className={`size-8 rounded-full flex items-center justify-center transition-all duration-500 border-4 border-[#101922] ${isActive ? 'bg-[#1173d4] text-white' : 'bg-slate-800 text-slate-500'}`}>
              {isActive ? step.icon : <div className="size-1.5 bg-slate-600 rounded-full" />}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-[#1173d4]' : 'text-slate-600'}`}>
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('Tất cả');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const tabs = ['Tất cả', 'Chờ xác nhận', 'Đang xử lý', 'Đang giao', 'Đã giao', 'Đã hủy'];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get('/orders');
        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error('Fetch Orders Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'Tất cả') return true;
    return getStatusLabel(order.status) === activeTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#101922] text-slate-100 flex items-center justify-center" suppressHydrationWarning>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1173d4]" suppressHydrationWarning></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101922] text-slate-100 pb-24" suppressHydrationWarning>
      <div className="max-w-[1200px] mx-auto px-4 pt-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
          <div className="space-y-2">
             <div className="flex items-center gap-3 text-[#1173d4] mb-2">
               <History size={24} />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Theo dõi đơn hàng</span>
             </div>
             <h1 className="text-4xl font-black tracking-tight text-white leading-none">Quản lý đơn hàng</h1>
             <p className="text-sm text-slate-500 font-medium">Theo dõi và quản lý lịch sử mua sắm linh kiện của bạn</p>
          </div>
          
          <div className="relative group w-full md:w-96">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1173d4] transition-colors" size={20} />
            <input 
                type="text" 
                placeholder="Tìm kiếm mã đơn hàng, tên linh kiện..." 
                className="w-full pl-14 pr-6 py-4 bg-[#1A2129] border border-slate-800 rounded-2xl text-sm font-bold text-white outline-none focus:border-[#1173d4] transition-all placeholder:text-slate-600 shadow-xl" 
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex bg-[#1A2129]/50 p-2 rounded-2xl border border-slate-800 mb-12 overflow-x-auto no-scrollbar gap-2">
          {tabs.map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeTab === tab ? 'bg-[#1173d4] text-white shadow-xl shadow-[#1173d4]/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-10">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20 bg-[#1A2129] rounded-[32px] border border-slate-800">
               <Package size={48} className="mx-auto text-slate-700 mb-6 opacity-20" />
               <p className="text-slate-500 font-bold">Không tìm thấy đơn hàng nào trong mục này.</p>
            </div>
          ) : filteredOrders.map((order) => (
            <div key={order._id} className="bg-[#1A2129] rounded-[32px] border border-slate-800 overflow-hidden shadow-2xl hover:border-[#1173d4]/30 transition-all group">
              {/* Order Header */}
              <div className="px-10 py-8 border-b border-slate-800 flex flex-wrap justify-between items-center gap-6 bg-white/[0.02]">
                <div className="flex items-center gap-10">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-[#1173d4]/10 rounded-xl text-[#1173d4]">
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Mã đơn hàng</p>
                        <p className="font-black text-lg text-white tracking-tight uppercase">#{order._id.substring(order._id.length - 8)}</p>
                      </div>
                   </div>
                   <div className="hidden sm:block w-px h-12 bg-slate-800" />
                   <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Ngày đặt</p>
                      <p className="font-bold text-sm text-slate-300 flex items-center gap-2">
                         <Clock size={16} className="text-slate-500" /> {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                   </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Tổng tiền</p>
                       <p className="text-2xl font-black text-[#1173d4] tracking-tighter">{order.totalPrice.toLocaleString('vi-VN')}₫</p>
                    </div>
                    <span className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest ${order.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : order.status === 'shipped' ? 'bg-blue-500/10 text-blue-500' : order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                      {getStatusLabel(order.status)}
                    </span>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-10 flex flex-col lg:flex-row gap-16">
                <div className="flex-grow space-y-8">
                   {/* Items Previews */}
                   <div className="space-y-6">
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Thông tin sản phẩm</p>
                     {order.items.map((item, i) => (
                       <div key={i} className="flex justify-between items-center group/item">
                         <div className="flex gap-6 items-center">
                           <div className="w-20 h-20 bg-[#101922] rounded-2xl border border-slate-800 p-3 overflow-hidden flex-shrink-0 group-hover/item:scale-105 transition-transform duration-500">
                             <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                           </div>
                           <div>
                             <p className="font-black text-white hover:text-[#1173d4] transition-colors leading-tight mb-2">{item.name}</p>
                             <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Số lượng: <span className="text-white">{item.quantity}</span></span>
                                <span className="w-1 h-1 rounded-full bg-slate-800" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Đơn giá: <span className="text-white">{item.price.toLocaleString('vi-VN')}₫</span></span>
                             </div>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>

                   {/* Tracking Progress */}
                   <div className="pt-10 border-t border-slate-800/50">
                      <div className="flex items-center justify-between mb-2">
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Trạng thái vận chuyển</p>
                         <p className="text-sm font-black text-[#1173d4]">{getProgress(order.status)}%</p>
                      </div>
                      <OrderStepper progress={getProgress(order.status)} statusId={order.status} />
                      <div className="mt-8 flex justify-between items-center p-5 bg-[#101922] rounded-2xl border border-slate-800/50">
                         <div className="flex items-center gap-4 text-emerald-500">
                            <Truck size={20} />
                            <p className="text-[10px] font-black uppercase tracking-widest">Dự kiến giao: <span className="text-white ml-2">Sớm nhất có thể</span></p>
                         </div>
                         <button className="text-[10px] font-black uppercase tracking-widest text-[#1173d4] hover:underline flex items-center gap-2">
                            Chi tiết hành trình <ArrowRight size={14} />
                         </button>
                      </div>
                   </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden lg:block w-px bg-slate-800 self-stretch" />

                {/* Actions Section */}
                <div className="lg:w-72 flex flex-col justify-between">
                   <div className="space-y-6">
                      <div className="bg-[#101922] rounded-2xl p-6 border border-slate-800/50 flex items-start gap-4">
                        <MapPin size={20} className="text-[#1173d4] mt-1 shrink-0" />
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Địa chỉ nhận hàng</p>
                           <p className="text-xs font-bold text-slate-300 leading-relaxed">219 Nguyễn Thị Minh Khai, Quận 1, TP. Hồ Chí Minh</p>
                        </div>
                      </div>
                      <div className="bg-[#101922] rounded-2xl p-6 border border-slate-800/50 flex items-start gap-4">
                        <ShieldCheck size={20} className="text-emerald-500 mt-1 shrink-0" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Thông tin thanh toán</p>
                            <p className="text-xs font-bold text-white leading-relaxed">
                                {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : 'Đã thanh toán trực tuyến'}
                            </p>
                        </div>
                      </div>
                   </div>

                   <div className="mt-12 space-y-4">
                           <Link href="/help" className="w-full bg-[#1173d4] text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#1173d4]/90 transition-all shadow-xl shadow-[#1173d4]/20 active:scale-[0.98] flex items-center justify-center">
                             Xem hóa đơn điện tử
                           </Link>
                           <Link href="/help" className="w-full bg-slate-800/50 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-800 hover:border-slate-700 transition-all active:scale-[0.98] flex items-center justify-center">
                             Liên hệ yêu cầu hỗ trợ
                           </Link>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Banner */}
        <div className="mt-24 p-12 rounded-[40px] bg-gradient-to-br from-[#1173d4]/20 via-[#1A2129] to-[#1173d4]/5 border border-[#1173d4]/20 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-8">
             <div className="size-20 rounded-full bg-white flex items-center justify-center text-[#1173d4] shadow-2xl shadow-white/10">
               <Headphones size={40} />
             </div>
             <div className="space-y-2">
               <h4 className="text-2xl font-black text-white uppercase tracking-tight">Cần hỗ trợ về đơn hàng?</h4>
               <p className="text-slate-500 font-bold">Đội ngũ kỹ thuật viên của XeParts sẵn sàng giải đáp 24/7</p>
             </div>
          </div>
          <div className="flex gap-4">
             <Link href="tel:19008888" className="whitespace-nowrap bg-white text-slate-900 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform active:scale-95 shadow-xl shadow-white/5 flex items-center justify-center">
                Gọi ngay: 1900 8888
             </Link>
             <Link href="/help" className="whitespace-nowrap bg-slate-800 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-all border border-slate-700 flex items-center justify-center">
                Gửi yêu cầu hỗ trợ
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
