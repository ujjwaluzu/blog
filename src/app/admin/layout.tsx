"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background lg:flex-row">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />
        <div className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</div>
      </div>
    </div>
  );
}