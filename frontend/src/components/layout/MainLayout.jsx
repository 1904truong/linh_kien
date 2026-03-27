'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  const pathname = usePathname();
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isSellerPage = pathname.startsWith('/seller');
  const isAdminPage = pathname.startsWith('/admin');
  const hideLayout = isAuthPage || isSellerPage || isAdminPage;

  return (
    <div 
      className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark dark text-slate-900 dark:text-slate-100 font-display"
      suppressHydrationWarning
    >
      {!hideLayout && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {!hideLayout && <Footer />}
    </div>
  );
};

export default MainLayout;
