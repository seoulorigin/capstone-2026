import SidebarNav from "@/components/layout/SidebarNav"

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      <div className="mx-auto flex max-w-[1600px] gap-7 xl:gap-8">
        <SidebarNav />

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}