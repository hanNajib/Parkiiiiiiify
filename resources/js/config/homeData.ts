export const pricingPlans = [
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

export const faqs = [
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

// testimonials data
export const testimonials = [
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
