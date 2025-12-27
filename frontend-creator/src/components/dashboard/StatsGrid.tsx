import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Box, Users, DollarSign, Wallet } from "lucide-react";

interface DashboardStats {
    total_created: number;
    total_sales_count: number;
    total_buyers: number;
    total_earnings: string;
}

interface StatsGridProps {
    stats: DashboardStats | null;
}

export function StatsGrid({ stats }: StatsGridProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-secondary/5 border-white/5 backdrop-blur-sm text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Created</CardTitle>
                    <Box className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats?.total_created || 0}</div>
                </CardContent>
            </Card>
            <Card className="bg-secondary/5 border-white/5 backdrop-blur-sm text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
                    <Wallet className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats?.total_sales_count || 0}</div>
                </CardContent>
            </Card>
            <Card className="bg-secondary/5 border-white/5 backdrop-blur-sm text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
                    <DollarSign className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats?.total_earnings || "0.00"} ETH</div>
                </CardContent>
            </Card>
            <Card className="bg-secondary/5 border-white/5 backdrop-blur-sm text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Unique Buyers</CardTitle>
                    <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats?.total_buyers || 0}</div>
                </CardContent>
            </Card>
        </div>
    );
}
