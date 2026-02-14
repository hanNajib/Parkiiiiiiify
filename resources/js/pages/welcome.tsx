import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Logo } from '@/components/logo-icon';
import { 
    Car, 
    MapPin, 
    Clock, 
    Shield, 
    BarChart3, 
    Users, 
    Zap,
    CheckCircle2,
    ArrowRight,
    Smartphone,
    FileText,
    TrendingUp,
    Star,
    Quote,
    DollarSign,
    Bell,
    ChevronRight,
    Play,
    Sparkles,
    Award,
    Target
} from 'lucide-react';

export default function Welcome() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const testimonials = [
        {
            name: "Budi Santoso",
            role: "Manajer Parkir Mall ABC",
            avatar: "BS",
            content: "Multi-area management-nya membantu banget! Bisa manage 8 area parkir dari satu dashboard. Real-time capacity tracking-nya akurat!",
            rating: 5
        },
        {
            name: "Siti Aminah",
            role: "Owner Gedung Perkantoran",
            avatar: "SA",
            content: "Dashboard Owner-nya informatif. Export PDF untuk laporan bulanan jadi gampang. Role-based access-nya juga pas sesuai kebutuhan.",
            rating: 5
        },
        {
            name: "Ahmad Wijaya",
            role: "Petugas Parkir Kampus Tech",
            avatar: "AW",
            content: "Barcode scanner-nya cepat banget! Transaksi check-in/out jadi 30 detik aja. Struk otomatis langsung print, keren!",
            rating: 5
        }
    ];

    const pricingPlans = [
        {
            name: "Starter",
            price: "Gratis",
            period: "selamanya",
            description: "Sempurna untuk area parkir kecil",
            features: [
                "1 area parkir",
                "Unlimited transaksi",
                "Dashboard analytics basic",
                "Export PDF & Excel",
                "1 user Petugas",
                "Barcode scanner"
            ],
            highlighted: false
        },
        {
            name: "Professional",
            price: "Rp 299K",
            period: "/bulan",
            description: "Untuk bisnis parkir yang sedang berkembang",
            features: [
                "Hingga 10 area parkir",
                "Unlimited transaksi",
                "Dashboard analytics advanced",
                "Multi-user (5 petugas)",
                "Role-based access control",
                "Log aktivitas lengkap",
                "Priority support",
                "Custom branding struk"
            ],
            highlighted: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "hubungi kami",
            description: "Solusi lengkap untuk bisnis besar",
            features: [
                "Unlimited area parkir",
                "Unlimited users & transaksi",
                "Custom role permissions",
                "White-label solution",
                "Dedicated server option",
                "Custom integration",
                "24/7 Priority support",
                "Training & onboarding"
            ],
            highlighted: false
        }
    ];

    const faqs = [
        {
            question: "Apakah bisa manage multiple area parkir dengan tarif berbeda?",
            answer: "Tentu bisa! Parkify support multi-area parkir dengan tarif yang bisa di-customize per area dan per jenis kendaraan (Motor/Mobil/Lainnya). Anda bisa set tarif flat atau per jam sesuai kebutuhan."
        },
        {
            question: "Bagaimana sistem menghitung biaya parkir?",
            answer: "Sistem otomatis menghitung durasi parkir dari waktu check-in sampai check-out. Biaya dihitung berdasarkan tarif yang dipilih saat check-in. Support 2 tipe: Flat Rate (tetap) atau Per Jam (dikalikan durasi)."
        },
        {
            question: "Role apa saja yang tersedia dan apa bedanya?",
            answer: "Ada 4 role: (1) Superadmin - akses full sistem, (2) Admin - manage area, kendaraan, tarif, (3) Petugas - input transaksi parkir, (4) Owner - view-only dashboard & laporan. Setiap role punya dashboard dan akses berbeda."
        },
        {
            question: "Apakah bisa export laporan transaksi?",
            answer: "Sangat bisa! Sistem support export ke PDF untuk rekap transaksi dengan filter tanggal/area. Juga bisa export data user ke Excel. Struk masuk/keluar parkir otomatis di-generate saat transaksi."
        },
        {
            question: "Apakah ada log aktivitas untuk audit?",
            answer: "Ada! Semua aktivitas user tercatat di Log Aktivitas lengkap dengan timestamp dan info user. Tracking CRUD operations untuk audit trail yang komprehensif. Cocok untuk accountability dan security."
        },
        {
            question: "Bagaimana cara mencegah kendaraan parkir 2x (duplicate)?",
            answer: "Sistem otomatis cek apakah kendaraan dengan plat nomor yang sama masih ada transaksi ongoing (belum check-out). Jika masih parkir, sistem akan prevent duplicate entry untuk kendaraan tersebut."
        }
    ];

    return (
        <>
            <Head title="Parkify - Sistem Manajemen Parkir Modern" />
            
            <div className="min-h-screen bg-linear-to-b lg:px-8 from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
                {/* Navigation - OPTIMASI: Kurangin spring stiffness */}
                <motion.nav 
                    className="border-b bg-white/50 dark:bg-zinc-950/50 backdrop-blur-lg sticky top-0 z-50"
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Logo />
                            </div>
                            <div className="hidden md:flex items-center gap-6">
                                {['Fitur', 'Cara Kerja', 'Harga', 'Testimoni', 'FAQ'].map((item) => (
                                    <a
                                        key={item}
                                        href={`#${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-sm font-medium hover:text-primary transition-colors"
                                    >
                                        {item}
                                    </a>
                                ))}
                            </div>
                            <div className="flex items-center gap-4">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm">
                                        Masuk
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="gap-2">
                                        Daftar Sekarang
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.nav>

                {/* Hero Section - OPTIMIZED PARALLAX & LAPTOP SCREEN FIT */}
                <section ref={heroRef} className="relative container mx-auto px-4 py-12 md:py-16 lg:py-20 overflow-hidden">
                    <motion.div style={{ y, opacity }}>
                        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                            {/* Left Side - Text Content */}
                            <div className="space-y-6 lg:space-y-8">
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Badge className="w-fit gap-1" variant="secondary">
                                        <Sparkles className="w-3 h-3" />
                                        Sistem Parkir Pintar & Modern
                                    </Badge>
                                </motion.div>
                                
                                <motion.h1 
                                    className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1, duration: 0.5 }}
                                >
                                    Kelola Parkir dengan{' '}
                                    <span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                        Lebih Mudah
                                    </span>
                                    {' '}dan{' '}
                                    <span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                        Efisien
                                    </span>
                                </motion.h1>
                                
                                <motion.p 
                                    className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.5 }}
                                >
                                    Parkify adalah sistem manajemen parkir berbasis web yang membantu Anda 
                                    mengelola multiple area parkir, transaksi kendaraan masuk-keluar, dan menghasilkan 
                                    laporan analitik secara real-time.
                                </motion.p>
                                
                                <motion.div 
                                    className="flex flex-wrap gap-3 lg:gap-4"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    <Link href="/register">
                                        <Button size="lg" className="gap-2 text-sm md:text-base px-6 lg:px-8">
                                            Mulai Gratis Sekarang
                                            <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                                        </Button>
                                    </Link>
                                    <Button size="lg" variant="outline" className="gap-2 text-sm md:text-base px-6 lg:px-8">
                                        <Play className="w-4 h-4 lg:w-5 lg:h-5" />
                                        Lihat Demo
                                    </Button>
                                </motion.div>
                                
                                <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span>Gratis selamanya untuk 1 area parkir</span>
                                </div>
                                
                                <Separator className="my-4 lg:my-6" />
                                
                                <div className="flex flex-wrap items-center gap-4 lg:gap-6 pt-2 lg:pt-4">
                                    {[
                                        { value: "100+", label: "Area Parkir" },
                                        { value: "5K+", label: "Transaksi/Bulan" },
                                        { value: "4 Role", label: "Multi-Access" }
                                    ].map((stat, index) => (
                                        <div key={index} className="flex items-center gap-3 lg:gap-4">
                                            {index > 0 && <Separator orientation="vertical" className="h-10 lg:h-12" />}
                                            <div>
                                                <div className="text-2xl md:text-3xl lg:text-4xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                                    {stat.value}
                                                </div>
                                                <div className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <motion.div 
                                className="relative w-full h-90 sm:h-105 md:h-112.5 lg:h-120 xl:h-130"
                                initial={{ opacity: 0, x: 50, y: -100 }}
                                animate={{ opacity: 1, x: 0, y: -50 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
                                <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
                                
                                <div className="relative h-full flex items-center justify-center">
                                    <motion.div
                                        className="relative z-10"
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.6 }}
                                    >
                                        <div className="w-64 md:w-72 lg:w-80 p-6 rounded-2xl bg-linear-to-br from-white/90 to-white/50 dark:from-zinc-900/90 dark:to-zinc-900/50 backdrop-blur-xl border border-white/20 dark:border-zinc-700/50 shadow-2xl">
                                            {/* Live Badge */}
                                            <div className="flex items-center justify-between mb-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                    <span className="text-xs font-medium text-green-600 dark:text-green-400">Live Update</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground">13 Feb 2026</div>
                                            </div>
                                            
                                            {/* Main Stats */}
                                            <div className="space-y-4">
                                                <div className="text-center">
                                                    <div className="text-5xl md:text-6xl font-bold bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                                        247
                                                    </div>
                                                    <div className="text-sm text-muted-foreground mt-1">Kendaraan Parkir</div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-muted-foreground">Kapasitas</span>
                                                        <span className="font-semibold text-primary">82%</span>
                                                    </div>
                                                    <div className="h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            className="h-full bg-linear-to-r from-primary to-purple-600"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: "82%" }}
                                                            transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                                                        />
                                                    </div>
                                                </div>
                                                
                                                {/* Quick Stats Grid */}
                                                <div className="grid grid-cols-3 gap-3 pt-2">
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-zinc-900 dark:text-white">12</div>
                                                        <div className="text-[10px] text-muted-foreground">Area</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-zinc-900 dark:text-white">2.5h</div>
                                                        <div className="text-[10px] text-muted-foreground">Avg Time</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-2xl font-bold text-zinc-900 dark:text-white">12M</div>
                                                        <div className="text-[10px] text-muted-foreground">Revenue</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Floating Small Card - Top Left */}
                                    <motion.div
                                        className="absolute top-8 left-0 md:left-4"
                                        initial={{ x: -100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.6 }}
                                        whileHover={{ y: -8, scale: 1.05 }}
                                    >
                                        <div className="w-28 md:w-32 p-4 rounded-xl bg-linear-to-br from-blue-500/90 to-blue-600/90 backdrop-blur-xl border border-white/20 shadow-xl">
                                            <MapPin className="w-6 h-6 text-white mb-2" />
                                            <div className="text-2xl font-bold text-white">8</div>
                                            <div className="text-[10px] text-white/80">Locations</div>
                                        </div>
                                    </motion.div>

                                    {/* Floating Small Card - Top Right */}
                                    <motion.div
                                        className="absolute top-0 right-0 md:right-8"
                                        initial={{ x: 100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.6 }}
                                        whileHover={{ y: -8, scale: 1.05 }}
                                    >
                                        <div className="w-28 md:w-32 p-4 rounded-xl bg-linear-to-br from-green-500/90 to-green-600/90 backdrop-blur-xl border border-white/20 shadow-xl">
                                            <TrendingUp className="w-6 h-6 text-white mb-2" />
                                            <div className="text-2xl font-bold text-white">+18%</div>
                                            <div className="text-[10px] text-white/80">Growth</div>
                                        </div>
                                    </motion.div>

                                    {/* Floating Small Card - Bottom Left */}
                                    <motion.div
                                        className="absolute bottom-12 left-0 md:left-8"
                                        initial={{ x: -100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.6 }}
                                        whileHover={{ y: -8, scale: 1.05 }}
                                    >
                                        <div className="w-28 md:w-32 p-4 rounded-xl bg-linear-to-br from-purple-500/90 to-purple-600/90 backdrop-blur-xl border border-white/20 shadow-xl">
                                            <Clock className="w-6 h-6 text-white mb-2" />
                                            <div className="text-2xl font-bold text-white">24/7</div>
                                            <div className="text-[10px] text-white/80">Active</div>
                                        </div>
                                    </motion.div>

                                    {/* Floating Small Card - Bottom Right */}
                                    <motion.div
                                        className="absolute bottom-0 right-0 md:right-4"
                                        initial={{ x: 100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.7, duration: 0.6 }}
                                        whileHover={{ y: -8, scale: 1.05 }}
                                    >
                                        <div className="w-28 md:w-32 p-4 rounded-xl bg-linear-to-br from-orange-500/90 to-orange-600/90 backdrop-blur-xl border border-white/20 shadow-xl">
                                            <Shield className="w-6 h-6 text-white mb-2" />
                                            <div className="text-2xl font-bold text-white">100%</div>
                                            <div className="text-[10px] text-white/80">Secure</div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* Features Section - OPTIMIZED */}
                <section id="fitur" className="container mx-auto px-4 py-20 bg-zinc-50 dark:bg-zinc-900/50">
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
                        <TabsContent value="management" className="mt-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
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
                                        description: 'Pencatatan lengkap: plat nomor, jenis kendaraan (Motor/Mobil/Lainnya), nama pemilik, warna. Prevent duplicate kendaraan parkir dengan barcode scanner.',
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
                                ].map((feature, index) => (
                                    <Card key={index} className="hover:shadow-lg transition-all border-2 hover:border-primary/50 h-full">
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
                        <TabsContent value="analytics" className="mt-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
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
                                ].map((feature, index) => (
                                    <Card key={index} className="hover:shadow-lg transition-all border-2 hover:border-primary/50 h-full">
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
                        <TabsContent value="automation" className="mt-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
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
                                ].map((feature, index) => (
                                    <Card key={index} className="hover:shadow-lg transition-all border-2 hover:border-primary/50 h-full">
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

                {/* How It Works Section */}
                <section id="cara-kerja" className="container mx-auto px-4 py-20">
                    <div className="text-center space-y-4 mb-16">
                        <Badge variant="secondary" className="w-fit mx-auto gap-1">
                            <Zap className="w-3 h-3" />
                            Cara Kerja
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-bold">
                            Mudah Digunakan dalam{' '}
                            <span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                3 Langkah
                            </span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Setup dalam hitungan menit, operasional dalam hitungan detik
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                step: '01',
                                title: 'Setup Area & Tarif',
                                description: 'Buat area parkir dengan kapasitas yang diinginkan. Atur tarif flat atau per jam untuk setiap jenis kendaraan (Motor/Mobil/Lainnya) per area.',
                                icon: MapPin,
                                time: '5 menit'
                            },
                            {
                                step: '02',
                                title: 'Transaksi Check-in',
                                description: 'Petugas scan/input plat nomor, pilih tarif yang berlaku. Sistem catat waktu masuk otomatis dan cetak struk masuk. Kapasitas area berkurang real-time.',
                                icon: Car,
                                time: '30 detik'
                            },
                            {
                                step: '03',
                                title: 'Check-out & Analytics',
                                description: 'Scan kendaraan keluar, sistem hitung durasi & biaya otomatis. Print struk pembayaran. Lihat dashboard analytics dengan chart revenue 7 hari terakhir.',
                                icon: BarChart3,
                                time: '45 detik'
                            }
                        ].map((item, index) => (
                            <Card key={index} className="relative hover:shadow-xl transition-all border-2 hover:border-primary/50 h-full">
                                <CardHeader>
                                    <div className="text-7xl font-bold text-primary/5 absolute top-4 right-4">{item.step}</div>
                                    <div className="relative w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-2xl mb-4">
                                        {index + 1}
                                    </div>
                                    <Badge variant="secondary" className="w-fit mb-2">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {item.time}
                                    </Badge>
                                    <CardTitle className="text-2xl">{item.title}</CardTitle>
                                    <CardDescription className="text-base leading-relaxed">{item.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center`}>
                                        <item.icon className="w-6 h-6 text-primary" />
                                    </div>
                                </CardContent>
                                {index < 2 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-12 w-8 h-8 text-primary/30">
                                        <ArrowRight className="w-full h-full" />
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="harga" className="container mx-auto px-4 py-20 bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="text-center space-y-4 mb-16">
                        <Badge variant="secondary" className="w-fit mx-auto gap-1">
                            <DollarSign className="w-3 h-3" />
                            Harga Transparan
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-bold">
                            Pilih Paket yang{' '}
                            <span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Pas untuk Anda
                            </span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Mulai gratis, upgrade kapan saja. Tanpa komitmen jangka panjang.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <Card key={index} className={`relative h-full ${plan.highlighted ? 'border-primary shadow-2xl scale-105 dark:bg-zinc-900' : 'border-2'}`}>
                                {plan.highlighted && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <Badge className="gap-1 px-4 py-1">
                                            <Award className="w-3 h-3" />
                                            Paling Populer
                                        </Badge>
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                    <div className="pt-4">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-muted-foreground">
                                            {plan.period && ` ${plan.period}`}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Separator />
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Link href="/register" className="w-full">
                                        <Button 
                                            className="w-full gap-2" 
                                            variant={plan.highlighted ? "default" : "outline"}
                                            size="lg"
                                        >
                                            {plan.name === "Enterprise" ? "Hubungi Sales" : "Mulai Sekarang"}
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-muted-foreground">
                            Semua paket termasuk: Barcode Scanner, Export PDF/Excel, Multi-area Support, dan Log Aktivitas
                        </p>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimoni" className="container mx-auto px-4 py-20">
                    <div className="text-center space-y-4 mb-16">
                        <Badge variant="secondary" className="w-fit mx-auto gap-1">
                            <Star className="w-3 h-3" />
                            Testimoni Pengguna
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-bold">
                            Feedback dari{' '}
                            <span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Pengguna Sistem
                            </span>
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Lihat bagaimana Parkify membantu mengelola area parkir
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="hover:shadow-xl transition-all border-2 h-full">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-12 h-12">
                                                <AvatarFallback className="bg-primary text-primary-foreground">
                                                    {testimonial.avatar}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <CardTitle className="text-base">{testimonial.name}</CardTitle>
                                                <CardDescription className="text-xs">{testimonial.role}</CardDescription>
                                            </div>
                                        </div>
                                        <Quote className="w-8 h-8 text-primary/20" />
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex gap-1">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                        ))}
                                    </div>
                                    <p className="text-sm leading-relaxed italic">"{testimonial.content}"</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="container mx-auto px-4 py-20">
                    <div className="text-center space-y-4 mb-16">
                        <Badge variant="secondary" className="w-fit mx-auto">
                            FAQ
                        </Badge>
                        <h2 className="text-4xl md:text-6xl font-bold">
                            Pertanyaan yang{' '}
                            <span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Sering Ditanyakan
                            </span>
                        </h2>
                    </div>

                    <Accordion type="single" collapsible className="max-w-3xl mx-auto">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <div className="text-center mt-12">
                        <p className="text-muted-foreground mb-4">Masih punya pertanyaan?</p>
                        <Button variant="outline" size="lg">
                            Hubungi Support
                        </Button>
                    </div>
                </section>

                {/* CTA Section - OPTIMIZED */}
                <section className="container mx-auto px-4 py-20">
                    <Card className="relative overflow-hidden border-2">
                        {/* OPTIMASI #4: Static gradient instead of animated */}
                        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-purple-500/10 to-primary/10" />
                        <CardContent className="relative p-12 md:p-16 text-center space-y-8">
                            <Badge className="w-fit mx-auto gap-1" variant="secondary">
                                <Zap className="w-3 h-3" />
                                Setup Cepat dalam Menit
                            </Badge>
                            <h2 className="text-4xl md:text-6xl font-bold">
                                Siap untuk Memulai?
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                Bergabunglah dengan Parkify hari ini dan rasakan kemudahan mengelola parkir 
                                dengan Laravel 12 + React. Multi-area support, role-based access, dan export PDF/Excel siap pakai!
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center pt-4">
                                <Link href="/register">
                                    <Button size="lg" className="gap-2 px-8">
                                        Daftar Gratis Sekarang
                                        <ArrowRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline" className="px-8">
                                    Jadwalkan Demo
                                </Button>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-muted-foreground">
                                {[
                                    "Laravel 12 + React",
                                    "Multi-area parkir",
                                    "Export PDF & Excel"
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Footer */}
                <footer className="border-t bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="container mx-auto px-4 py-12">
                        <div className="grid md:grid-cols-5 gap-8 mb-12">
                            <div className="md:col-span-2 space-y-4">
                                <Logo />
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Sistem manajemen parkir berbasis web dengan Laravel 12 + React + TypeScript. 
                                    Multi-area support, role-based access, dan export PDF/Excel.
                                </p>
                                <div className="flex gap-3">
                                    {[1, 2, 3].map((i) => (
                                        <Button key={i} size="icon" variant="outline">
                                            <span className="w-4 h-4">•</span>
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            {[
                                {
                                    title: "Produk",
                                    links: ["Fitur", "Harga", "Demo", "API"]
                                },
                                {
                                    title: "Perusahaan",
                                    links: ["Tentang Kami", "Blog", "Karir", "Press Kit"]
                                },
                                {
                                    title: "Dukungan",
                                    links: ["Pusat Bantuan", "Dokumentasi", "FAQ", "Kontak"]
                                }
                            ].map((section) => (
                                <div key={section.title}>
                                    <h3 className="font-bold mb-4 text-sm">{section.title}</h3>
                                    <ul className="space-y-3 text-sm text-muted-foreground">
                                        {section.links.map((link) => (
                                            <li key={link}>
                                                <a href="#" className="hover:text-primary transition-colors">{link}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <Separator className="mb-8" />
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-sm text-muted-foreground">
                                © 2026 HanNajib. All rights reserved.
                            </p>
                            <div className="flex gap-6 text-sm text-muted-foreground">
                                {["Privacy Policy", "Terms of Service", "Cookies"].map((link) => (
                                    <a key={link} href="#" className="hover:text-primary transition-colors">
                                        {link}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}