import { Head, Link } from '@inertiajs/react';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo-icon';
import {
    Clock,
    Zap,
    CheckCircle2,
    ArrowRight,
    ChevronRight,
    Sparkles,
    MapPin,
    Car,
    BarChart3,
} from 'lucide-react';
import HeroSection from './sections/Hero';
import FeaturesSection from './sections/Features';
import PricingSection from './sections/Pricing';
import TestimonialsSection from './sections/Testimonials';
import FAQSection from './sections/FAQ';
import Footer from './sections/Footer';

export default function Welcome() {
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const lenis = new Lenis({
            lerp: 0.08,
            smoothWheel: true,
            wheelMultiplier: 0.9,
        });

        let rafId = 0;
        const raf = (time: number) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };

        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, []);

    return (
        <>
            <Head title="Sistem Manajemen Parkir Modern" />

            <div className="min-h-screen bg-white lg:px-8 dark:bg-zinc-950">
                <motion.nav
                    className="border-b border-slate-200 bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50"
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

                {/* Hero Section */}
                <HeroSection />

                {/* Features Section */}
                <FeaturesSection />

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
                            <Card key={index} className="relative hover:shadow-xl hover:shadow-primary/5 transition-all border-slate-200 hover:border-primary/30 dark:border-zinc-800 dark:hover:border-primary/50 h-full">
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
                <PricingSection />

                {/* Testimonials Section */}
                <TestimonialsSection />

                {/* FAQ Section */}
                <FAQSection />

                {/* CTA Section - OPTIMIZED */}
                <section className="container mx-auto px-4 py-20">
                    <Card className="relative overflow-hidden border-slate-200 shadow-2xl shadow-primary/5 dark:border-zinc-800 dark:shadow-none">
                        {/* OPTIMASI #4: Static gradient instead of animated */}
                        <div className="absolute inset-0 bg-linear-to-br from-purple-50/80 via-white to-primary/5 dark:from-primary/10 dark:via-purple-500/10 dark:to-primary/10" />
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
                <Footer />
            </div>
        </>
    );
}