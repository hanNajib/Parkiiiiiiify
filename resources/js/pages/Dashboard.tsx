import { DashboardLayout } from "@/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Users, Car, Building2, Clock, Activity, BarChart3, Download, FileText } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { FormEventHandler, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { router, usePage } from "@inertiajs/react";
import { toast } from "sonner";

interface DashboardProps {
    userRole: 'superadmin' | 'admin' | 'petugas' | 'owner';
    [key: string]: any;
}

export default function DashboardPage(props: DashboardProps) {
    const { userRole } = props;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short'
        });
    };

    if (userRole === 'petugas') {
        return <PetugasDashboard {...props} formatCurrency={formatCurrency} />;
    }

    if (userRole === 'owner') {
        return <OwnerDashboard {...props} formatCurrency={formatCurrency} formatDate={formatDate} />;
    }

    // Admin & Superadmin Dashboard
    return <AdminDashboard {...props} formatCurrency={formatCurrency} formatDate={formatDate} />;
}

function AdminDashboard({ 
    totalRevenue, 
    todayRevenue, 
    monthRevenue, 
    totalTransactions,
    ongoingTransactions,
    completedTransactions,
    total_areas,
    total_vehicles,
    totalUsers,
    revenueChart,
    areaPerformance,
    recentTransactions,
    formatCurrency,
    formatDate
}: any) {
    const revenueChartConfig = {
        revenue: {
            label: "Pendapatan",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard Admin</h1>
                    <p className="text-muted-foreground">Ringkasan sistem parkir</p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                            <p className="text-xs text-muted-foreground">Hari ini: {formatCurrency(todayRevenue)}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Bulan Ini</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(monthRevenue)}</div>
                            <p className="text-xs text-muted-foreground">{completedTransactions} transaksi selesai</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sedang Parkir</CardTitle>
                            <Car className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{ongoingTransactions}</div>
                            <p className="text-xs text-muted-foreground">Total: {totalTransactions} transaksi</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Area Parkir</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{total_areas}</div>
                            <p className="text-xs text-muted-foreground">{total_vehicles} kendaraan terdaftar</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Revenue Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Pendapatan 7 Hari Terakhir</CardTitle>
                        <CardDescription>Tren pendapatan harian</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={revenueChartConfig} className="h-[300px] w-full">
                            <AreaChart data={revenueChart}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="date" 
                                    tickFormatter={formatDate}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis 
                                    tickFormatter={(value) => formatCurrency(value)}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="var(--color-revenue)" 
                                    fill="var(--color-revenue)" 
                                    fillOpacity={0.2}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Area Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Performa Area Parkir</CardTitle>
                        <CardDescription>Okupansi dan pendapatan per area</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {areaPerformance.map((area: any) => (
                                <div key={area.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                    <div className="space-y-1">
                                        <p className="font-medium">{area.nama}</p>
                                        <p className="text-sm text-muted-foreground">{area.lokasi}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{formatCurrency(area.revenue)}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {area.ongoing}/{area.kapasitas} terisi
                                            </p>
                                        </div>
                                        <Badge variant={area.occupancy > 80 ? "destructive" : "default"}>
                                            {area.occupancy}%
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transaksi Terbaru</CardTitle>
                        <CardDescription>10 transaksi terakhir</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recentTransactions.map((trx: any) => (
                                <div key={trx.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{trx.kendaraan?.plat_nomor}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {trx.areaParkir?.nama} • {trx.petugas?.name}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={trx.status === 'ongoing' ? 'default' : 'secondary'}>
                                            {trx.status}
                                        </Badge>
                                        {trx.total_biaya && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatCurrency(trx.total_biaya)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

function PetugasDashboard({ 
    todayTransactions, 
    todayRevenue, 
    ongoingNow,
    myTransactions,
    hourlyActivity,
    availableAreas,
    formatCurrency 
}: any) {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard Petugas</h1>
                    <p className="text-muted-foreground">Aktivitas hari ini</p>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Transaksi Hari Ini</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{todayTransactions}</div>
                            <p className="text-xs text-muted-foreground">Transaksi yang saya buat</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pendapatan Hari Ini</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(todayRevenue)}</div>
                            <p className="text-xs text-muted-foreground">Dari transaksi selesai</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Sedang Parkir</CardTitle>
                            <Car className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{ongoingNow}</div>
                            <p className="text-xs text-muted-foreground">Kendaraan aktif sekarang</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Hourly Activity */}
                {hourlyActivity.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Aktivitas Per Jam</CardTitle>
                            <CardDescription>Transaksi hari ini</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={{
                                transactions: { label: "Transaksi", color: "hsl(var(--chart-2))" }
                            }} className="h-[200px] w-full">
                                <BarChart data={hourlyActivity}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="hour" tickLine={false} axisLine={false} />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="transactions" fill="var(--color-transactions)" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                )}

                {/* Available Areas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Status Area Parkir</CardTitle>
                        <CardDescription>Ketersediaan tempat parkir</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {availableAreas.map((area: any) => (
                                <div key={area.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                                    <div>
                                        <p className="font-medium">{area.nama}</p>
                                        <p className="text-sm text-muted-foreground">{area.lokasi}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{area.available} tersedia</p>
                                            <p className="text-xs text-muted-foreground">
                                                {area.terisi}/{area.kapasitas} terisi
                                            </p>
                                        </div>
                                        <div className="h-2 w-20 rounded-full bg-muted overflow-hidden">
                                            <div 
                                                className="h-full bg-primary" 
                                                style={{ width: `${(area.terisi / area.kapasitas) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* My Recent Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transaksi Saya</CardTitle>
                        <CardDescription>10 transaksi terakhir</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {myTransactions.map((trx: any) => (
                                <div key={trx.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{trx.kendaraan?.plat_nomor}</p>
                                        <p className="text-xs text-muted-foreground">{trx.areaParkir?.nama}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={trx.status === 'ongoing' ? 'default' : 'secondary'}>
                                            {trx.status}
                                        </Badge>
                                        {trx.total_biaya && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {formatCurrency(trx.total_biaya)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}

function OwnerDashboard({ 
    revenueData,
    thisMonthRevenue,
    lastMonthRevenue,
    growthRate,
    areaProfitability,
    vehicleDistribution,
    peakHours,
    totalRevenue,
    totalTransactions,
    avgRevPerTransaction,
    areaList,
    formatCurrency,
    formatDate
}: any) {
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(1)).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedArea, setSelectedArea] = useState('all');
    const [isDownloading, setIsDownloading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);
    const { props } = usePage();

    useEffect(() => {
        const flash = (props as any).flash;
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [(props as any).flash]);

    const handleDownloadRekap: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (!startDate || !endDate) {
            toast.error('Harap pilih tanggal mulai dan selesai');
            return;
        }

        if (new Date(startDate) > new Date(endDate)) {
            toast.error('Tanggal mulai tidak boleh lebih besar dari tanggal selesai');
            return;
        }

        setIsDownloading(true);
        
        if (formRef.current) {
            formRef.current.submit();
        }
        
        setTimeout(() => {
            setIsDownloading(false);
        }, 2000);
    };

    const revenueChartConfig = {
        revenue: {
            label: "Pendapatan",
            color: "hsl(var(--chart-1))",
        },
        transactions: {
            label: "Transaksi",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard Owner</h1>
                    <p className="text-muted-foreground">Analisis bisnis dan performa</p>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pendapatan Bulan Ini</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(thisMonthRevenue)}</div>
                            <p className={`text-xs ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {growthRate >= 0 ? '+' : ''}{growthRate}% dari bulan lalu
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                            <p className="text-xs text-muted-foreground">Sepanjang masa</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalTransactions}</div>
                            <p className="text-xs text-muted-foreground">Semua waktu</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rata-rata Transaksi</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(avgRevPerTransaction)}</div>
                            <p className="text-xs text-muted-foreground">Per transaksi</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Download Rekap Transaksi
                        </CardTitle>
                        <CardDescription>Export laporan transaksi parkir dalam format PDF</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form ref={formRef} action="/download-rekap-pdf" method="POST" onSubmit={handleDownloadRekap}>
                            {/* CSRF Token */}
                            <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                            
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start-date">Tanggal Mulai</Label>
                                    <Input
                                        id="start-date"
                                        name="start_date"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end-date">Tanggal Selesai</Label>
                                    <Input
                                        id="end-date"
                                        name="end_date"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        min={startDate}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="area-filter">Area Parkir</Label>
                                    <Select value={selectedArea} onValueChange={setSelectedArea}>
                                        <SelectTrigger id="area-filter">
                                            <SelectValue placeholder="Pilih area" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Area</SelectItem>
                                            {areaList?.map((area: any) => (
                                                <SelectItem key={area.id} value={area.id.toString()}>
                                                    {area.nama}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedArea !== 'all' && (
                                        <input type="hidden" name="area_id" value={selectedArea} />
                                    )}
                                </div>
                                <div className="flex items-end">
                                    <Button 
                                        type="submit"
                                        className="w-full"
                                        disabled={isDownloading}
                                    >
                                        {isDownloading ? (
                                            <>
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                <Download className="mr-2 h-4 w-4" />
                                                Download PDF
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Tren Pendapatan 30 Hari</CardTitle>
                        <CardDescription>Pendapatan dan jumlah transaksi harian</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={revenueChartConfig} className="h-75 w-full">
                            <LineChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="date" 
                                    tickFormatter={formatDate}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis 
                                    yAxisId="left"
                                    tickFormatter={(value) => formatCurrency(value)}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis 
                                    yAxisId="right" 
                                    orientation="right"
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line 
                                    yAxisId="left"
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="var(--color-revenue)" 
                                    strokeWidth={2}
                                />
                                <Line 
                                    yAxisId="right"
                                    type="monotone" 
                                    dataKey="transactions" 
                                    stroke="var(--color-transactions)" 
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Area Profitability */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Profitabilitas Area</CardTitle>
                            <CardDescription>Pendapatan bulan ini per area</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {areaProfitability.slice(0, 5).map((area: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between border-b pb-2 last:border-0">
                                        <div>
                                            <p className="font-medium text-sm">{area.nama}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {area.transactions} transaksi
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{formatCurrency(area.revenue)}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Avg: {formatCurrency(area.avgTransaction)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vehicle Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Distribusi Jenis Kendaraan</CardTitle>
                            <CardDescription>Bulan ini</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {vehicleDistribution.map((vehicle: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between border-b pb-2 last:border-0">
                                        <div>
                                            <p className="font-medium text-sm capitalize">{vehicle.type}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {vehicle.count} kendaraan
                                            </p>
                                        </div>
                                        <p className="font-medium">{formatCurrency(vehicle.revenue)}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Peak Hours */}
                <Card>
                    <CardHeader>
                        <CardTitle>Jam Tersibuk</CardTitle>
                        <CardDescription>5 jam dengan transaksi terbanyak bulan ini</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={{
                            transactions: { label: "Transaksi", color: "hsl(var(--chart-3))" }
                        }} className="h-[200px] w-full">
                            <BarChart data={peakHours} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" tickLine={false} axisLine={false} />
                                <YAxis dataKey="hour" type="category" tickLine={false} axisLine={false} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="transactions" fill="var(--color-transactions)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}