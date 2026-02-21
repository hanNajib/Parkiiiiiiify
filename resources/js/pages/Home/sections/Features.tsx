import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    MapPin,
    Car,
    DollarSign,
    Users,
    BarChart3,
    FileText,
    TrendingUp,
    Zap,
    Smartphone,
    Shield,
    Bell,
    Sparkles,
    ArrowRight
} from 'lucide-react';

export default function FeaturesSection() {
    const tabsData = {
        management: [
            {
                icon: MapPin,
                title: 'Multi-Area Parkir',
                description: 'Kelola multiple lokasi parkir dari satu dashboard. Set kapasitas per area, monitor ketersediaan slot real-time, dan track area terisi vs kosong.',
                color: 'text-blue-500',
                bgColor: 'bg-blue-500/10'
            },
            {
                icon: Car,
                title: 'Database Kendaraan',
                description: 'Pencatatan lengkap: plat nomor, jenis kendaraan (Motor/Mobil/Lainnya), warna. Prevent duplicate kendaraan parkir dengan barcode scanner.',
                color: 'text-green-500',
                bgColor: 'bg-green-500/10'
            },
            {
                icon: DollarSign,
                title: 'Tarif Fleksibel',
                description: 'Dukung 2 tipe tarif: Flat Rate (tetap) atau Per Jam (durasi). Setting tarif berbeda per area parkir dan jenis kendaraan secara mudah.',
                color: 'text-purple-500',
                bgColor: 'bg-purple-500/10'
            },
            {
                icon: Users,
                title: 'Role-Based Access',
                description: '4 Role berbeda: Superadmin, Admin, Petugas, dan Owner. Setiap role punya akses dan dashboard khusus sesuai tugasnya.',
                color: 'text-orange-500',
                bgColor: 'bg-orange-500/10'
            }
        ],
        analytics: [
            {
                icon: BarChart3,
                title: 'Dashboard Multi-Role',
                description: 'Dashboard berbeda untuk setiap role: Admin lihat semua, Petugas track transaksinya sendiri, Owner view-only analytics. Chart revenue 7 hari terakhir.',
                color: 'text-purple-500',
                bgColor: 'bg-purple-500/10'
            },
            {
                icon: FileText,
                title: 'Export PDF & Excel',
                description: 'Export rekap transaksi ke PDF lengkap dengan filter. Export data user ke Excel. Cetak struk masuk/keluar parkir otomatis.',
                color: 'text-yellow-500',
                bgColor: 'bg-yellow-500/10'
            },
            {
                icon: TrendingUp,
                title: 'Performance Analytics',
                description: 'Monitor occupancy rate per area, total transaksi, revenue per area parkir. Real-time statistics: pending vs completed transactions.',
                color: 'text-cyan-500',
                bgColor: 'bg-cyan-500/10'
            },
            {
                icon: FileText,
                title: 'Log Aktivitas',
                description: 'Audit trail lengkap semua aktivitas user. Track CRUD operations dengan timestamp. View detail log dan info user yang melakukan aksi.',
                color: 'text-red-500',
                bgColor: 'bg-red-500/10'
            }
        ],
        automation: [
            {
                icon: Zap,
                title: 'Auto Check-in/Check-out',
                description: 'Proses transaksi otomatis: scan kendaraan → sistem catat waktu masuk/keluar → hitung durasi & biaya → print struk. Update kapasitas real-time.',
                color: 'text-yellow-500',
                bgColor: 'bg-yellow-500/10'
            },
            {
                icon: Smartphone,
                title: 'Barcode Scanner',
                description: 'Quick scan plat nomor kendaraan dengan camera integration. Prevent duplicate entry kendaraan yang masih parkir. Cetak struk dengan ID transaksi.',
                color: 'text-blue-500',
                bgColor: 'bg-blue-500/10'
            },
            {
                icon: Shield,
                title: 'Laravel Fortify Auth',
                description: 'Security terjamin dengan Laravel Fortify: Two-Factor Authentication (2FA), email verification, password reset, session management yang aman.',
                color: 'text-red-500',
                bgColor: 'bg-red-500/10'
            },
            {
                icon: Bell,
                title: 'Notifikasi & Alerts',
                description: 'Flash messages untuk setiap aksi. Toast notifications menggunakan Sonner. Success/error alerts yang informatif untuk user experience yang lebih baik.',
                color: 'text-green-500',
                bgColor: 'bg-green-500/10'
            }
        ]
    };

    return (
        <section id="fitur" className="container mx-auto px-4 py-20 bg-slate-50/50 border-y border-slate-100 dark:bg-zinc-900/50 dark:border-zinc-800">
            <div className="text-center space-y-4 mb-16">
                <Badge variant="secondary" className="w-fit mx-auto gap-1">
                    <Sparkles className="w-3 h-3" />
                    Fitur Unggulan
                </Badge>
                <h2 className="text-4xl md:text-6xl font-bold">
                    Semua yang Anda Butuhkan untuk{' '}
                    <span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Mengelola Parkir
                    </span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Dilengkapi dengan fitur-fitur canggih untuk memudahkan pengelolaan area parkir Anda
                </p>
            </div>

            <Tabs defaultValue="management" className="max-w-6xl mx-auto mb-12">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="management">Manajemen</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="automation">Automation</TabsTrigger>
                </TabsList>

                {Object.entries(tabsData).map(([tabKey, features]) => (
                    <TabsContent key={tabKey} value={tabKey} className="mt-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            {features.map((feature, index) => (
                                <Card key={index} className="hover:shadow-xl hover:shadow-primary/5 transition-all border-slate-200 hover:border-primary/30 dark:border-zinc-800 dark:hover:border-primary/50 h-full">
                                    <CardHeader>
                                        <div className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                                            <feature.icon className={`w-7 h-7 ${feature.color}`} />
                                        </div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                        <CardDescription className="text-base">{feature.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>

            <div className="text-center mt-12">
                <Link href="/register">
                    <Button size="lg" className="gap-2">
                        Coba Semua Fitur Gratis
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </section>
    );
}
