'use client';

import React, { useState } from 'react';
import useCartStore from '@/store/useCartStore';
import { 
  ShoppingBag, 
  MapPin as MapPinIcon, 
  Truck as TruckIcon, 
  CreditCard as CreditCardIcon, 
  ChevronRight as ChevronRightIcon, 
  Plus, 
  CircleDot, 
  Circle, 
  Pencil, 
  Zap, 
  Leaf, 
  Wrench, 
  Banknote, 
  Smartphone,
  ArrowRight,
  ShoppingCart
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, createOrder, fetchCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  const [shippingMethod, setShippingMethod] = useState('fast');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [selectedAddress, setSelectedAddress] = useState('default');

  const shippingFee = shippingMethod === 'fast' ? 35000 : 15000;
  const discount = 50000;
  const totalPrice = getTotalPrice() + shippingFee - discount;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // For now, using a fixed address since we haven't implemented address management yet
      const address = {
        street: '123 Đường Lê Lợi',
        city: 'TP. Hồ Chí Minh',
        state: 'HCM',
        zipCode: '70000'
      };
      const result = await createOrder(address);
      if (result.success) {
        alert('Đặt hàng thành công!');
        router.push('/orders');
      }
    } catch (error) {
      alert('Đã có lỗi xảy ra khi đặt hàng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center text-white">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-500">
           <ShoppingBag size={40} />
        </div>
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng của bạn đang trống!</h1>
        <p className="text-slate-500 mb-10 max-w-xs mx-auto">Vui lòng chọn linh kiện trước khi thực hiện thanh toán nhé.</p>
        <Link 
          href="/" 
          className="bg-[#1173d4] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1173d4]/90 transition-all shadow-lg shadow-[#1173d4]/20"
        >
          Quay lại mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101922] text-slate-100 font-sans pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#101922]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-[#1173d4] flex items-center justify-center">
              <ShoppingCart size={28} />
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-tight">Thanh toán</h2>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-500">
            <span className="text-[#1173d4]">Giỏ hàng</span>
            <ChevronRightIcon size={16} />
            <span className="text-white">Thanh toán</span>
            <ChevronRightIcon size={16} />
            <span>Hoàn tất</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-10 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Forms */}
          <div className="flex flex-col flex-1 gap-8 w-full">
            {/* Address Section */}
            <section className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-3">
                  <MapPinIcon className="text-[#1173d4]" size={22} />
                  Địa chỉ nhận hàng
                </h3>
                <button className="text-[#1173d4] text-xs font-black uppercase tracking-widest flex items-center gap-1.5 hover:underline">
                  <Plus size={14} /> Thêm địa chỉ mới
                </button>
              </div>

              <div className="space-y-4">
                <label className={`relative flex cursor-pointer rounded-2xl border-2 p-6 transition-all ${selectedAddress === 'default' ? 'border-[#1173d4] bg-[#1173d4]/5' : 'border-slate-800 bg-transparent'}`}>
                  <input type="radio" name="address" className="hidden" onClick={() => setSelectedAddress('default')} />
                  <div className="flex w-full items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 ${selectedAddress === 'default' ? 'text-[#1173d4]' : 'text-slate-600'}`}>
                        {selectedAddress === 'default' ? <CircleDot size={20} /> : <Circle size={20} />}
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="font-black text-sm text-white">Nguyễn Văn A | 0901234567</p>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh</p>
                        <span className="mt-3 inline-flex items-center rounded-lg bg-[#1173d4]/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#1173d4] border border-[#1173d4]/20 w-fit">Mặc định</span>
                      </div>
                    </div>
                    <button className="text-slate-600 hover:text-white transition-colors">
                      <Pencil size={18} />
                    </button>
                  </div>
                </label>

                <label className={`relative flex cursor-pointer rounded-2xl border-2 p-6 transition-all ${selectedAddress === 'secondary' ? 'border-[#1173d4] bg-[#1173d4]/5' : 'border-slate-800 bg-transparent hover:border-slate-700'}`}>
                  <input type="radio" name="address" className="hidden" onClick={() => setSelectedAddress('secondary')} />
                  <div className="flex w-full items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`mt-1 ${selectedAddress === 'secondary' ? 'text-[#1173d4]' : 'text-slate-600'}`}>
                        {selectedAddress === 'secondary' ? <CircleDot size={20} /> : <Circle size={20} />}
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="font-black text-sm text-white">Trần Thị B | 0988776655</p>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">456 Võ Văn Kiệt, Quận 5, TP. Hồ Chí Minh</p>
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </section>

            {/* Shipping Section */}
            <section className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800">
              <h3 className="text-xl font-bold flex items-center gap-3 mb-8">
                <TruckIcon className="text-[#1173d4]" size={22} />
                Phương thức vận chuyển
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`relative flex cursor-pointer rounded-2xl border-2 p-6 transition-all ${shippingMethod === 'fast' ? 'border-[#1173d4] bg-[#1173d4]/5' : 'border-slate-800'}`}>
                  <input type="radio" name="shipping" className="hidden" onClick={() => setShippingMethod('fast')} />
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${shippingMethod === 'fast' ? 'bg-[#1173d4] text-white' : 'bg-slate-800 text-slate-500'}`}>
                        <Zap size={20} />
                      </div>
                      <span className="font-black text-white uppercase tracking-tight">Giao nhanh</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-1">Dự kiến nhận: 1-2 ngày</p>
                      <p className="text-lg font-black text-[#1173d4]">35.000₫</p>
                    </div>
                  </div>
                </label>

                <label className={`relative flex cursor-pointer rounded-2xl border-2 p-6 transition-all ${shippingMethod === 'eco' ? 'border-[#1173d4] bg-[#1173d4]/5' : 'border-slate-800 hover:border-slate-700'}`}>
                  <input type="radio" name="shipping" className="hidden" onClick={() => setShippingMethod('eco')} />
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${shippingMethod === 'eco' ? 'bg-[#1173d4] text-white' : 'bg-slate-800 text-slate-500'}`}>
                        <Leaf size={20} />
                      </div>
                      <span className="font-black text-white uppercase tracking-tight">Tiết kiệm</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-bold mb-1">Dự kiến nhận: 3-5 ngày</p>
                      <p className="text-lg font-black text-white">15.000₫</p>
                    </div>
                  </div>
                </label>
              </div>
            </section>

            {/* Payment Section */}
            <section className="bg-slate-900/40 p-8 rounded-2xl border border-slate-800">
              <h3 className="text-xl font-bold flex items-center gap-3 mb-8">
                <CreditCardIcon className="text-[#1173d4]" size={22} />
                Phương thức thanh toán
              </h3>
              <div className="space-y-3">
                {[
                  { id: 'cod', n: 'Thanh toán khi nhận hàng (COD)', d: 'Trả tiền mặt khi shipper giao hàng', icon: <Wrench size={20} /> },
                  { id: 'bank', n: 'Chuyển khoản ngân hàng', d: 'Chuyển qua ứng dụng ngân hàng hoặc ATM', icon: <Banknote size={20} /> },
                  { id: 'wallet', n: 'Ví điện tử liên kết', d: 'Momo, ZaloPay, ShopeePay', icon: <Smartphone size={20} /> },
                ].map((pay) => (
                  <label key={pay.id} className={`flex items-center gap-5 p-6 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === pay.id ? 'border-[#1173d4] bg-[#1173d4]/5' : 'border-slate-800 hover:bg-white/5'}`}>
                    <input type="radio" name="payment" className="hidden" onClick={() => setPaymentMethod(pay.id)} />
                    <div className={`${paymentMethod === pay.id ? 'text-[#1173d4]' : 'text-slate-600'}`}>
                      {paymentMethod === pay.id ? <CircleDot size={20} /> : <Circle size={20} />}
                    </div>
                    <div className={`p-2.5 rounded-xl ${paymentMethod === pay.id ? 'bg-[#1173d4]/20 text-[#1173d4]' : 'bg-slate-800 text-slate-500'}`}>
                      {pay.icon}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-black text-sm text-white">{pay.n}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{pay.d}</span>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Sidebar */}
          <aside className="w-full lg:w-[420px] lg:sticky lg:top-24">
            <div className="bg-[#1A2129] p-10 rounded-[32px] border border-slate-800 shadow-2xl space-y-10">
              <h3 className="text-xl font-black uppercase tracking-tight border-b border-slate-800 pb-6">Tóm tắt đơn hàng</h3>
              
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-5">
                    <div className="w-20 h-20 rounded-2xl bg-[#101922] p-2 border border-slate-800 flex-shrink-0 overflow-hidden">
                      <img className="w-full h-full object-contain" src={item.image} alt={item.name} />
                    </div>
                    <div className="flex flex-col flex-1 justify-center gap-1.5">
                      <p className="text-xs font-black text-white leading-snug line-clamp-2">{item.name}</p>
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-[#1173d4]">x{item.quantity}</span>
                        <p className="text-sm font-black text-white">{item.price.toLocaleString('vi-VN')}₫</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-10 border-t border-slate-800">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                  <span>Tạm tính</span>
                  <span className="text-slate-200">{getTotalPrice().toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                  <span>Phí vận chuyển</span>
                  <span className="text-slate-200">{shippingFee.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                  <span>Giảm giá</span>
                  <span className="text-emerald-500">-{discount.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between items-end pt-8 border-t border-slate-800 mt-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pb-1">Tổng cộng</span>
                  <span className="text-4xl font-black text-[#1173d4] tracking-tighter">
                    {totalPrice.toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <div className="flex gap-2">
                  <input 
                    className="flex-1 rounded-2xl border-2 border-slate-800 bg-[#101922] px-5 py-3.5 text-xs font-bold text-white focus:outline-none focus:border-[#1173d4] transition-all placeholder:text-slate-600" 
                    placeholder="Mã giảm giá" 
                    type="text"
                  />
                  <button className="bg-[#1173d4]/10 text-[#1173d4] border border-[#1173d4]/20 px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#1173d4]/20 transition-all">Áp dụng</button>
                </div>
                  <button 
                    disabled={loading}
                    onClick={handlePlaceOrder}
                    className={`w-full bg-[#1173d4] text-white py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-[#1173d4]/90 shadow-2xl shadow-[#1173d4]/20 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG NGAY'}
                    {!loading && <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />}
                  </button>
                <p className="text-[10px] text-center text-slate-600 font-bold uppercase tracking-widest leading-relaxed opacity-60">
                  Bằng cách đặt hàng, bạn đồng ý với các <br /> <span className="underline hover:text-white cursor-pointer">Điều khoản & Chính sách</span> của XeParts
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-800 py-10 text-center text-slate-600 text-[10px] font-black uppercase tracking-widest">
        <p>© 2024 XeParts Corporation. Hệ thống thanh toán bảo mật 256-bit SSL.</p>
      </footer>
    </div>
  );
}
