import { Link } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    MapPin,
    Clock,
    Shield,
    TrendingUp,
    Sparkles,
    ArrowRight,
    CheckCircle2,
    Play
} from 'lucide-react';

export default function HeroSection() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const yRaw = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
    const opacityRaw = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const y = useSpring(yRaw, { stiffness: 20, damping: 15, mass: 0.2 });
    const opacity = useSpring(opacityRaw, { stiffness: 20, damping: 15, mass: 0.2 });

    return (
        <section ref={heroRef} className="relative container mx-auto px-4 py-12 md:py-16 lg:pb-20 overflow-hidden">
            <motion.div style={{ y, opacity }} className='will-change-transform'>
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
                                <Play className="w-4 h-4" />
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
                        initial={{ opacity: 0, x: 40, y: -20 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.6 }}
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
                                <div className="w-64 md:w-72 lg:w-80 p-6 rounded-2xl bg-white/60 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-200/60 dark:border-zinc-700/50 shadow-2xl shadow-primary/5 dark:shadow-none">
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

                            {/* Floating Small Cards */}
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
    );
}
