import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Logo } from '@/components/logo-icon';

export default function Footer() {
    const footerSections = [
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
    ];

    return (
        <footer className="border-t border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
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
                    {footerSections.map((section) => (
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
    );
}
