'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  UserCheck, 
  UserMinus, 
  Eye, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  Activity
} from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function UserManagement() {
  const [activeRole, setActiveRole] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users', {
        params: {
          page: pagination.page,
          search,
          role: activeRole !== 'all' ? activeRole.toLowerCase() : undefined
        }
      });
      if (response.data.success) {
        setUsers(response.data.data.users);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Fetch Users Error:', error);
      toast.error('Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [activeRole, search, pagination.page]);

  const handleUpdateStatus = async (userId, isApproved) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, { isApproved });
      if (response.data.success) {
        toast.success(isApproved ? 'Đã kích hoạt tài khoản' : 'Đã tạm khóa tài khoản');
        fetchUsers();
      }
    } catch (error) {
      toast.error('Cập nhật trạng thái thất bại.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('Đã xóa người dùng.');
      fetchUsers();
    } catch (error) {
      toast.error('Xóa người dùng thất bại.');
    }
  };

  const roles = [
    { id: 'all', label: 'Tất cả' },
    { id: 'customer', label: 'Khách hàng' },
    { id: 'seller', label: 'Người bán' },
    { id: 'admin', label: 'Quản trị' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700" suppressHydrationWarning>
      
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Quản lý người dùng</h2>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-1 uppercase">Quản trị toàn bộ tài khoản và phân quyền trong hệ thống</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#1173d4] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95">
          <UserPlus size={18} />
          <span>Tạo người dùng mới</span>
        </button>
      </div>

      {/* Role Tabs */}
      <div className="flex bg-[#1A2632] p-1.5 rounded-2xl border border-[#2d3d4d] w-fit">
        {roles.map(role => (
          <button 
            key={role.id}
            onClick={() => { setActiveRole(role.id); setPagination({ ...pagination, page: 1 }); }}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeRole === role.id ? 'bg-[#1173d4] text-white shadow-xl shadow-blue-500/10' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {role.label}
          </button>
        ))}
      </div>

      {/* Main Table Card */}
      <div className="bg-[#1A2632] border border-[#2d3d4d] rounded-[32px] shadow-2xl overflow-hidden mb-12">
        <div className="p-6 border-b border-[#2d3d4d] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative group flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên, email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#101922] border border-[#2d3d4d] text-white rounded-2xl pl-12 pr-4 py-3 text-xs font-bold focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder:text-slate-600"
            />
          </div>
          <div className="flex items-center gap-3">
             <button className="p-3 bg-[#101922] border border-[#2d3d4d] rounded-2xl text-slate-500 hover:text-white transition-all shadow-md">
                <Filter size={20} />
             </button>
             <div className="h-8 w-[1px] bg-[#2d3d4d] mx-1"></div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest uppercase">Hiển thị <span className="text-white">{pagination.total}</span> người dùng</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#101922]/50 border-b border-[#2d3d4d]">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Người dùng</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Vai trò</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Liên hệ</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ngày tham gia</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest">Trạng thái</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d3d4d]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1173d4]"></div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] uppercase">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length > 0 ? users.map((user) => (
                <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-[#101922] border border-[#2d3d4d] flex items-center justify-center text-primary font-black shadow-inner">
                        {user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white group-hover:text-primary transition-colors">{user.name}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter uppercase truncate max-w-[100px]">{user._id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex items-center gap-2">
                      <Shield size={14} className={
                        user.role === 'admin' ? 'text-rose-500' : user.role === 'seller' ? 'text-blue-500' : 'text-slate-400'
                      } />
                      <span className="text-xs font-bold text-slate-300 capitalize">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                        <Mail size={12} /> {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                        <Phone size={12} /> {user.phoneNumber || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-xs font-bold text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase ${
                      user.isApproved ? 'bg-emerald-400/10 text-emerald-400' : 'bg-rose-400/10 text-rose-400'
                    }`}>
                      <div className={`size-1.5 rounded-full ${
                        user.isApproved ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'
                      }`}></div>
                      {user.isApproved ? 'Hoạt động' : 'Đang chờ/Khóa'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 bg-[#101922] hover:bg-primary/20 text-slate-500 hover:text-primary rounded-xl border border-[#2d3d4d] transition-all">
                          <Eye size={16} />
                       </button>
                       <button 
                         onClick={() => handleUpdateStatus(user._id, !user.isApproved)}
                         title={user.isApproved ? "Khóa tài khoản" : "Kích hoạt tài khoản"}
                         className={`p-2 bg-[#101922] rounded-xl border border-[#2d3d4d] transition-all ${
                         user.isApproved ? 'hover:bg-rose-400/20 text-rose-400' : 'hover:bg-emerald-400/20 text-emerald-400'
                       }`}>
                          {user.isApproved ? <UserMinus size={16} /> : <UserCheck size={16} />}
                       </button>
                       <button 
                         onClick={() => handleDeleteUser(user._id)}
                         className="p-2 bg-[#101922] hover:bg-rose-600/20 text-slate-500 hover:text-rose-600 rounded-xl border border-[#2d3d4d] transition-all">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center text-slate-500 font-medium italic">
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-6 bg-[#101922]/50 border-t border-[#2d3d4d] flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button 
                disabled={pagination.page === 1}
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                className="flex items-center gap-2 px-4 py-2 bg-[#101922] border border-[#2d3d4d] text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all disabled:opacity-30">
                 <ChevronLeft size={16} /> Trước
              </button>
              <button 
                disabled={pagination.page === pagination.pages}
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                className="flex items-center gap-2 px-4 py-2 bg-[#101922] border border-[#2d3d4d] text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all disabled:opacity-30">
                 Sau <ChevronRight size={16} />
              </button>
           </div>
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic uppercase">Trang {pagination.page} / {pagination.pages}</p>
        </div>
      </div>

    </div>
  );
}
