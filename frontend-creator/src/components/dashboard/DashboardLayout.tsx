import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout({ children }: { children?: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-bg-primary">
            <aside className="hidden h-screen w-64 flex-col fixed inset-y-0 left-0 z-30 md:flex border-r border-white/5 bg-secondary/10 backdrop-blur-xl">
                <Sidebar className="h-full border-r-0" />
            </aside>
            <main className="flex-1 md:pl-64">
                <div className="h-full px-4 py-8 md:px-8">
                    {children || <Outlet />}
                </div>
            </main>
        </div>
    );
}
