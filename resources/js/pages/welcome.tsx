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

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

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
            answer: "Tentu bisa! PaarkirBang support multi-area parkir dengan tarif yang bisa di-customize per area dan per jenis kendaraan (Motor/Mobil/Lainnya). Anda bisa set tarif flat atau per jam sesuai kebutuhan."
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
            
            <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
                {/* Navigation with Blur Effect */}
                <motion.nav 
                    className="border-b bg-white/50 dark:bg-zinc-950/50 backdrop-blur-lg sticky top-0 z-50"
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <motion.div 
                                className="flex items-center gap-2"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Logo />
                            </motion.div>
                            <div className="hidden md:flex items-center gap-6">
                                {['Fitur', 'Cara Kerja', 'Harga', 'Testimoni', 'FAQ'].map((item, index) => (
                                    <motion.a
                                        key={item}
                                        href={`#${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-sm font-medium hover:text-primary transition-colors"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ y: -2 }}
                                    >
                                        {item}
                                    </motion.a>
                                ))}
                            </div>
                            <div className="flex items-center gap-4">
                                <Link href="/login">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button variant="ghost" size="sm">
                                            Masuk
                                        </Button>
                                    </motion.div>
                                </Link>
                                <Link href="/register">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button size="sm" className="gap-2">
                                            Daftar Sekarang
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </motion.div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.nav>

                {/* Hero Section with Parallax */}
                <section ref={heroRef} className="relative container mx-auto px-4 py-20 md:py-32 overflow-hidden">
                    <motion.div style={{ y, opacity }}>
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Left Side - Text Content */}
                            <div className="space-y-8">
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Badge className="w-fit gap-1" variant="secondary">
                                        <Sparkles className="w-3 h-3" />
                                        Laravel 11 + React + TypeScript + shadcn/ui
                                    </Badge>
                                </motion.div>
                                
                                <motion.h1 
                                    className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                >
                                    Kelola Parkir dengan{' '}
                                    <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                        Lebih Mudah
                                    </span>
                                    {' '}dan{' '}
                                    <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                        Efisien
                                    </span>
                                </motion.h1>
                                
                                <motion.p 
                                    className="text-lg md:text-xl text-muted-foreground leading-relaxed"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                >
                                    PaarkirBang adalah sistem manajemen parkir berbasis web yang membantu Anda 
                                    mengelola multiple area parkir, transaksi kendaraan masuk-keluar, dan menghasilkan 
                                    laporan analitik secara real-time. Dibangun dengan Laravel 11 + React + TypeScript.
                                </motion.p>
                                
                                <motion.div 
                                    className="flex flex-wrap gap-4"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.6 }}
                                >
                                    <Link href="/register">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button size="lg" className="gap-2 text-base px-8">
                                                Mulai Gratis Sekarang
                                                <ArrowRight className="w-5 h-5" />
                                            </Button>
                                        </motion.div>
                                    </Link>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button size="lg" variant="outline" className="gap-2 text-base px-8">
                                            <Play className="w-5 h-5" />
                                            Lihat Demo
                                        </Button>
                                    </motion.div>
                                </motion.div>
                                
                                <motion.div 
                                    className="flex items-center gap-2 text-sm text-muted-foreground"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.6 }}
                                >
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <span>Gratis selamanya untuk 1 area parkir</span>
                                </motion.div>
                                
                                <Separator />
                                
                                <motion.div 
                                    className="flex flex-wrap items-center gap-6 pt-4"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6, duration: 0.6 }}
                                >
                                    {[
                                        { value: "100+", label: "Area Parkir" },
                                        { value: "5K+", label: "Transaksi/Bulan" },
                                        { value: "4 Role", label: "Multi-Access" }
                                    ].map((stat, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            {index > 0 && <Separator orientation="vertical" className="h-12" />}
                                            <div>
                                                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                                    {stat.value}
                                                </div>
                                                <div className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                            
                            {/* Right Side - Dashboard Preview RESPONSIVE & FIT SCREEN */}
                            <motion.div 
                                className="relative w-full h-[450px] md:h-[500px] lg:h-[600px]"
                                initial={{ opacity: 0, x: 100, scale: 0.8 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                {/* Animated Background Blob with Parallax */}
                                <motion.div 
                                    className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/10 blur-3xl rounded-full"
                                    animate={{ 
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 180, 360]
                                    }}
                                    transition={{ 
                                        duration: 25, 
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                />
                                
                                {/* Main Dashboard Card - PERFECTLY SIZED */}
                                <motion.div 
                                    className="relative bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl p-4 md:p-6 shadow-2xl border-2 border-primary/10 h-full overflow-hidden"
                                    whileHover={{ scale: 1.02, rotateY: 2 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div className="space-y-3 md:space-y-4 h-full">
                                        {/* Main Stats Card */}
                                        <motion.div
                                            initial={{ y: 30, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <Card className="shadow-lg border-2 hover:shadow-xl transition-shadow">
                                                <CardHeader className="pb-2 md:pb-3">
                                                    <div className="flex items-center justify-between">
                                                        <CardTitle className="text-xs md:text-sm font-medium">Dashboard Overview</CardTitle>
                                                        <Badge variant="secondary" className="gap-1 text-xs">
                                                            <TrendingUp className="w-3 h-3" />
                                                            Live
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="pb-3 md:pb-4">
                                                    <div className="flex items-center gap-3">
                                                        <motion.div 
                                                            className="bg-gradient-to-br from-primary/20 to-primary/5 p-2 md:p-3 rounded-xl"
                                                            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                                                            transition={{ duration: 0.5 }}
                                                        >
                                                            <Car className="w-5 h-5 md:w-7 md:h-7 text-primary" />
                                                        </motion.div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-xs text-muted-foreground truncate">Total Kendaraan</div>
                                                            <motion.div 
                                                                className="text-2xl md:text-3xl font-bold"
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ delay: 0.6, type: "spring" }}
                                                            >
                                                                247
                                                            </motion.div>
                                                        </div>
                                                        <Badge variant="secondary" className="gap-1 text-xs shrink-0">
                                                            <TrendingUp className="w-3 h-3" />
                                                            +12%
                                                        </Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                        
                                        {/* Grid Cards PERFECTLY RESPONSIVE */}
                                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                                            {[
                                                { icon: MapPin, label: "Area", value: "12", color: "text-primary", delay: 0.5 },
                                                { icon: Clock, label: "Avg Time", value: "2.5h", color: "text-primary", delay: 0.6 },
                                                { icon: DollarSign, label: "Revenue", value: "12M", color: "text-green-500", delay: 0.7 },
                                                { icon: Users, label: "Occupancy", value: "82%", color: "text-blue-500", delay: 0.8 }
                                            ].map((item, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ y: 30, opacity: 0, scale: 0.8 }}
                                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                                    transition={{ delay: item.delay, type: "spring", stiffness: 200 }}
                                                    whileHover={{ y: -5, scale: 1.05 }}
                                                >
                                                    <Card className="shadow hover:shadow-lg transition-all">
                                                        <CardContent className="p-3 md:p-4">
                                                            <item.icon className={`w-4 h-4 md:w-5 md:h-5 ${item.color} mb-1 md:mb-2`} />
                                                            <div className="text-[10px] md:text-xs text-muted-foreground truncate">{item.label}</div>
                                                            <div className="text-lg md:text-2xl font-bold">{item.value}</div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            ))}
                                        </div>
                                        
                                        {/* Floating Badges */}
                                        <motion.div
                                            className="flex gap-2 flex-wrap"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.9 }}
                                        >
                                            {[
                                                { icon: Shield, label: "2FA" },
                                                { icon: Zap, label: "Real-time" }
                                            ].map((badge, index) => (
                                                <motion.div 
                                                    key={index}
                                                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                                                >
                                                    <Badge variant="outline" className="gap-1 text-xs">
                                                        <badge.icon className="w-3 h-3" />
                                                        {badge.label}
                                                    </Badge>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </div>
                                </motion.div>
                                
                                {/* Floating Orbs with Parallax */}
                                <motion.div
                                    className="absolute -top-8 -right-8 w-20 h-20 md:w-32 md:h-32 bg-primary/10 rounded-full blur-2xl"
                                    animate={{ 
                                        y: [0, -30, 0],
                                        x: [0, 20, 0],
                                        scale: [1, 1.3, 1]
                                    }}
                                    transition={{ 
                                        duration: 6, 
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                                <motion.div
                                    className="absolute -bottom-8 -left-8 w-24 h-24 md:w-40 md:h-40 bg-purple-500/10 rounded-full blur-2xl"
                                    animate={{ 
                                        y: [0, 30, 0],
                                        x: [0, -20, 0],
                                        scale: [1, 1.2, 1]
                                    }}
                                    transition={{ 
                                        duration: 7, 
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 0.5
                                    }}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                

                {/* Features Section with Scroll Animations */}
                <motion.section 
                    id="fitur" 
                    className="container mx-auto px-4 py-20 bg-zinc-50 dark:bg-zinc-900/50"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <div className="text-center space-y-4 mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Badge variant="secondary" className="w-fit mx-auto gap-1">
                                <Sparkles className="w-3 h-3" />
                                Fitur Unggulan
                            </Badge>
                        </motion.div>
                        <motion.h2 
                            className="text-4xl md:text-6xl font-bold"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            Semua yang Anda Butuhkan untuk{' '}
                            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Mengelola Parkir
                            </span>
                        </motion.h2>
                        <motion.p 
                            className="text-xl text-muted-foreground max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            Dilengkapi dengan fitur-fitur canggih untuk memudahkan pengelolaan area parkir Anda
                        </motion.p>
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
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        whileHover={{ y: -5 }}
                                    >
                                        <Card className="hover:shadow-lg transition-all border-2 hover:border-primary/50 h-full">
                                            <CardHeader>
                                                <motion.div 
                                                    className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}
                                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                                                </motion.div>
                                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                                                <CardDescription className="text-base">{feature.description}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </motion.div>
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
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        whileHover={{ y: -5 }}
                                    >
                                        <Card className="hover:shadow-lg transition-all border-2 hover:border-primary/50 h-full">
                                            <CardHeader>
                                                <motion.div 
                                                    className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}
                                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                                                </motion.div>
                                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                                                <CardDescription className="text-base">{feature.description}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </motion.div>
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
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        whileHover={{ y: -5 }}
                                    >
                                        <Card className="hover:shadow-lg transition-all border-2 hover:border-primary/50 h-full">
                                            <CardHeader>
                                                <motion.div 
                                                    className={`w-14 h-14 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}
                                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                                                </motion.div>
                                                <CardTitle className="text-xl">{feature.title}</CardTitle>
                                                <CardDescription className="text-base">{feature.description}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>

                    <motion.div 
                        className="text-center mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/register">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button size="lg" className="gap-2">
                                    Coba Semua Fitur Gratis
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </motion.div>
                        </Link>
                    </motion.div>
                </motion.section>

                {/* How It Works Section */}
                <motion.section 
                    id="cara-kerja" 
                    className="container mx-auto px-4 py-20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center space-y-4 mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Badge variant="secondary" className="w-fit mx-auto gap-1">
                                <Zap className="w-3 h-3" />
                                Cara Kerja
                            </Badge>
                        </motion.div>
                        <motion.h2 
                            className="text-4xl md:text-6xl font-bold"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            Mudah Digunakan dalam{' '}
                            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                3 Langkah
                            </span>
                        </motion.h2>
                        <motion.p 
                            className="text-xl text-muted-foreground max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            Setup dalam hitungan menit, operasional dalam hitungan detik
                        </motion.p>
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
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10, scale: 1.05 }}
                            >
                                <Card className="relative hover:shadow-xl transition-all border-2 hover:border-primary/50 h-full">
                                    <CardHeader>
                                        <div className="text-7xl font-bold text-primary/5 absolute top-4 right-4">{item.step}</div>
                                        <motion.div 
                                            className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-2xl mb-4"
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.6 }}
                                        >
                                            {index + 1}
                                        </motion.div>
                                        <Badge variant="secondary" className="w-fit mb-2">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {item.time}
                                        </Badge>
                                        <CardTitle className="text-2xl">{item.title}</CardTitle>
                                        <CardDescription className="text-base leading-relaxed">{item.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <motion.div 
                                            className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center`}
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                        >
                                            <item.icon className="w-6 h-6 text-primary" />
                                        </motion.div>
                                    </CardContent>
                                    {index < 2 && (
                                        <motion.div
                                            className="hidden lg:block absolute top-1/2 -right-12 w-8 h-8 text-primary/30"
                                            animate={{ x: [0, 10, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <ArrowRight className="w-full h-full" />
                                        </motion.div>
                                    )}
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Pricing Section */}
                <motion.section 
                    id="harga" 
                    className="container mx-auto px-4 py-20 bg-zinc-50 dark:bg-zinc-900/50"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center space-y-4 mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Badge variant="secondary" className="w-fit mx-auto gap-1">
                                <DollarSign className="w-3 h-3" />
                                Harga Transparan
                            </Badge>
                        </motion.div>
                        <motion.h2 
                            className="text-4xl md:text-6xl font-bold"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            Pilih Paket yang{' '}
                            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Pas untuk Anda
                            </span>
                        </motion.h2>
                        <motion.p 
                            className="text-xl text-muted-foreground max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            Mulai gratis, upgrade kapan saja. Tanpa komitmen jangka panjang.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, type: "spring" }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10, scale: plan.highlighted ? 1.05 : 1.03 }}
                            >
                                <Card className={`relative h-full ${plan.highlighted ? 'border-primary shadow-2xl scale-105 dark:bg-zinc-900' : 'border-2'}`}>
                                    {plan.highlighted && (
                                        <motion.div 
                                            className="absolute -top-4 left-1/2 -translate-x-1/2"
                                            animate={{ y: [0, -5, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <Badge className="gap-1 px-4 py-1">
                                                <Award className="w-3 h-3" />
                                                Paling Populer
                                            </Badge>
                                        </motion.div>
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
                                                <motion.li 
                                                    key={idx} 
                                                    className="flex items-start gap-3"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    whileInView={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                    viewport={{ once: true }}
                                                >
                                                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                    <span className="text-sm">{feature}</span>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Link href="/register" className="w-full">
                                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                <Button 
                                                    className="w-full gap-2" 
                                                    variant={plan.highlighted ? "default" : "outline"}
                                                    size="lg"
                                                >
                                                    {plan.name === "Enterprise" ? "Hubungi Sales" : "Mulai Sekarang"}
                                                    <ArrowRight className="w-4 h-4" />
                                                </Button>
                                            </motion.div>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div 
                        className="text-center mt-12"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-muted-foreground">
                            Semua paket termasuk: Barcode Scanner, Export PDF/Excel, Multi-area Support, dan Log Aktivitas
                        </p>
                    </motion.div>
                </motion.section>

                {/* Testimonials Section */}
                <motion.section 
                    id="testimoni" 
                    className="container mx-auto px-4 py-20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center space-y-4 mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Badge variant="secondary" className="w-fit mx-auto gap-1">
                                <Star className="w-3 h-3" />
                                Testimoni Pengguna
                            </Badge>
                        </motion.div>
                        <motion.h2 
                            className="text-4xl md:text-6xl font-bold"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            Feedback dari{' '}
                            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Pengguna Sistem
                            </span>
                        </motion.h2>
                        <motion.p 
                            className="text-xl text-muted-foreground max-w-2xl mx-auto"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            Lihat bagaimana PaarkirBang membantu mengelola area parkir
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: index * 0.1, type: "spring" }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10, scale: 1.05 }}
                            >
                                <Card className="hover:shadow-xl transition-all border-2 h-full">
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
                                                <motion.div
                                                    key={i}
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    whileInView={{ scale: 1, rotate: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    viewport={{ once: true }}
                                                >
                                                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                                </motion.div>
                                            ))}
                                        </div>
                                        <p className="text-sm leading-relaxed italic">"{testimonial.content}"</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                

                {/* FAQ Section */}
                <motion.section 
                    id="faq" 
                    className="container mx-auto px-4 py-20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center space-y-4 mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Badge variant="secondary" className="w-fit mx-auto">
                                FAQ
                            </Badge>
                        </motion.div>
                        <motion.h2 
                            className="text-4xl md:text-6xl font-bold"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            Pertanyaan yang{' '}
                            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                                Sering Ditanyakan
                            </span>
                        </motion.h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
                            {faqs.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                >
                                    <AccordionItem value={`item-${index}`}>
                                        <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                </motion.div>
                            ))}
                        </Accordion>
                    </motion.div>

                    <motion.div 
                        className="text-center mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="text-muted-foreground mb-4">Masih punya pertanyaan?</p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button variant="outline" size="lg">
                                Hubungi Support
                            </Button>
                        </motion.div>
                    </motion.div>
                </motion.section>

                {/* CTA Section with Parallax */}
                <motion.section 
                    className="container mx-auto px-4 py-20"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Card className="relative overflow-hidden border-2">
                            <motion.div 
                                className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-primary/10"
                                animate={{ 
                                    backgroundPosition: ['0% 0%', '100% 100%'],
                                }}
                                transition={{ 
                                    duration: 20,
                                    repeat: Infinity,
                                    repeatType: "reverse"
                                }}
                            />
                            <CardContent className="relative p-12 md:p-16 text-center space-y-8">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <Badge className="w-fit mx-auto gap-1" variant="secondary">
                                        <Zap className="w-3 h-3" />
                                        Setup Cepat dalam Menit
                                    </Badge>
                                </motion.div>
                                <motion.h2 
                                    className="text-4xl md:text-6xl font-bold"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    Siap untuk Memulai?
                                </motion.h2>
                                <motion.p 
                                    className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    viewport={{ once: true }}
                                >
                                    Bergabunglah dengan PaarkirBang hari ini dan rasakan kemudahan mengelola parkir 
                                    dengan Laravel 11 + React. Multi-area support, role-based access, dan export PDF/Excel siap pakai!
                                </motion.p>
                                <motion.div 
                                    className="flex flex-wrap gap-4 justify-center pt-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    viewport={{ once: true }}
                                >
                                    <Link href="/register">
                                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                            <Button size="lg" className="gap-2 px-8">
                                                Daftar Gratis Sekarang
                                                <ArrowRight className="w-5 h-5" />
                                            </Button>
                                        </motion.div>
                                    </Link>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button size="lg" variant="outline" className="px-8">
                                            Jadwalkan Demo
                                        </Button>
                                    </motion.div>
                                </motion.div>
                                <motion.div 
                                    className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm text-muted-foreground"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    viewport={{ once: true }}
                                >
                                    {[
                                        "Laravel 11 + React",
                                        "Multi-area parkir",
                                        "Export PDF & Excel"
                                    ].map((item, index) => (
                                        <motion.div 
                                            key={index}
                                            className="flex items-center gap-2"
                                            whileHover={{ scale: 1.1 }}
                                        >
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span>{item}</span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.section>

                {/* Footer with Animations */}
                <motion.footer 
                    className="border-t bg-zinc-50 dark:bg-zinc-900/50"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="container mx-auto px-4 py-12">
                        <div className="grid md:grid-cols-5 gap-8 mb-12">
                            <motion.div 
                                className="md:col-span-2 space-y-4"
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <Logo />
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Sistem manajemen parkir berbasis web dengan Laravel 11 + React + TypeScript. 
                                    Multi-area support, role-based access, dan export PDF/Excel.
                                </p>
                                <div className="flex gap-3">
                                    {[1, 2, 3].map((i) => (
                                        <motion.div 
                                            key={i}
                                            whileHover={{ scale: 1.2, rotate: 360 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Button size="icon" variant="outline">
                                                <span className="w-4 h-4">•</span>
                                            </Button>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
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
                            ].map((section, index) => (
                                <motion.div 
                                    key={section.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                >
                                    <h3 className="font-bold mb-4 text-sm">{section.title}</h3>
                                    <ul className="space-y-3 text-sm text-muted-foreground">
                                        {section.links.map((link) => (
                                            <motion.li 
                                                key={link}
                                                whileHover={{ x: 5, color: 'var(--primary)' }}
                                            >
                                                <a href="#" className="hover:text-primary transition-colors">{link}</a>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                        <Separator className="mb-8" />
                        <motion.div 
                            className="flex flex-col md:flex-row justify-between items-center gap-4"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <p className="text-sm text-muted-foreground">
                                © 2026 HanNajib. All rights reserved.
                            </p>
                            <div className="flex gap-6 text-sm text-muted-foreground">
                                {["Privacy Policy", "Terms of Service", "Cookies"].map((link) => (
                                    <motion.a 
                                        key={link}
                                        href="#" 
                                        className="hover:text-primary transition-colors"
                                        whileHover={{ y: -2 }}
                                    >
                                        {link}
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.footer>
            </div>
        </>
    );
}