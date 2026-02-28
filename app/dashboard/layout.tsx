import type { Metadata } from "next";
import { SidebarMenu } from "@/components/SidebarMenu";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Review recent files, shortcuts and usage across your workspace."
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[70vh] bg-slate-50">
      <SidebarMenu />
      <section className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</section>
    </div>
  );
}
