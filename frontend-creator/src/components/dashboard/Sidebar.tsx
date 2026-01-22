import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    PlusCircle,
    LogOut,
    User,
    Images
} from "lucide-react";
import { cn } from "../../lib/util";
import { Button } from "../ui/button";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
    const location = useLocation();
    const { logout, user } = useContext(AppContext)!;
    const pathname = location.pathname;

    const sidebarItems = [
        {
            title: "Overview",
            href: "/",
            icon: LayoutDashboard,
        },
        // Placeholder for future routes
        {
            title: "My NFTs",
            href: "/my-nfts",
            icon: Images,
        },
        {
            title: "Create NFT",
            href: "/create-nft",
            icon: PlusCircle,
        },
    ];

    return (
        <div className={cn("pb-12 min-h-screen w-full", className)}>
            <div className="space-y-4 py-4">
                <div className="px-6 py-4 flex items-center gap-2">
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tr from-pink-500 to-purple-500 text-white font-bold shadow-lg shadow-pink-500/20">
                            A
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-white/70">
                            Antaboga.
                        </span>
                    </Link>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        Menu
                    </h2>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Link key={item.href} to={item.href}>
                                <Button
                                    variant={pathname === item.href ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-2",
                                        pathname === item.href
                                            ? "bg-primary/20 text-primary hover:bg-primary/30"
                                            : "text-white hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-white">
                        Account
                    </h2>
                    <div className="space-y-1">
                        <Link to="/profile">
                            <Button variant="ghost" className="w-full justify-start gap-2 text-white hover:bg-white/5 hover:text-white">
                                <User className="h-4 w-4" />
                                Profile
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            onClick={logout}
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            <div className="px-6 mt-auto absolute bottom-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{user?.username}</span>
                        <span className="text-xs text-muted-foreground capitalize">{user?.role}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
