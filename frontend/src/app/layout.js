import { Inter } from "next/font/google";
import "@/styles/globals.css";
import MainLayout from "@/components/layout/MainLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LK AUTO - Phụ tùng ô tô chính hãng",
  description: "Hệ thống cung cấp phụ tùng linh kiện ô tô chuyên nghiệp, uy tín hàng đầu Việt Nam.",
};

import ToasterProvider from "@/components/common/ToasterProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <MainLayout>
          {children}
        </MainLayout>
        <ToasterProvider />
      </body>
    </html>
  );
}
