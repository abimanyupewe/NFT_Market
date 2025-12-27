import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { StatsGrid } from "../components/dashboard/StatsGrid";

export default function DashboardHome() {
    const { dashboardStats, getDashboardStats } = useContext(AppContext)!;

    useEffect(() => {
        getDashboardStats();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
                <p className="text-muted-foreground">Overview of your NFT performance.</p>
            </div>
            <StatsGrid stats={dashboardStats} />
        </div>
    );
}
