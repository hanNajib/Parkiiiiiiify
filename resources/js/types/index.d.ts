export interface Auth {
    user: User;
}

export interface SharedData {
    name: string;
    auth: Auth;
    areaParkir?: AreaParkir[];
    flash: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    role: string;
    [key: string]: unknown; 
}

export interface Kendaraan {
    id: number;
    plat_nomor: string;
    jenis_kendaraan: "motor" | "mobil" | "lainnya";
    warna: string;
    user?: User;
}

export interface FlashMessages {
    success?: string
    error?: string
    warning?: string
    info?: string
}

export interface PageProps {
    auth: {
        user: User | null
    }
    flash: FlashMessages
    [key: string]: unknown
}

export interface PaginatedData<T> {
    length: number;
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}


// Data Model
export interface AreaParkir {
    id: number;
    nama: string;
    lokasi: string;
    kapasitas: number;
    terisi: number;
    default_rule_type: 'choose' | 'flat' | 'interval' | 'progressive';
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    tarif_lengkap: boolean;
    [key: string]: unknown;
}

export interface Tarif {
    id: number;
    area_parkir_id: number;
    rule_type: 'flat' | 'interval' | 'progressive';
    jenis_kendaraan: 'motor'| 'mobil' | 'lainnya';
    interval_menit: number | null;
    harga_awal: number | null;
    harga_lanjutan: number | null;
    maksimal_per_hari: number | null;
    berlaku_dari: string | null;
    berlaku_sampai: string | null;
    progressive_rules: ProgressiveRule[] | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

interface ProgressiveRule {
    jam_ke: number;
    harga: number;
}

export interface Kendaraan {
    id: number;
    plat_nomor: string;
    jenis_kendaraan: 'motor'| 'mobil' | 'lainnya';
    warna: string;
    user_id: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    [key: string]: unknown;
}

export interface LogAktivitas {
    id: number;
    user_id: number | null;
    role: string | null;
    action: string;
    description: string | null;
    target_type: string | null;
    target_id: number | null;
    ip_address: string | null;
    user: User | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface Transaksi {
    id: number;
    kendaraan_id: number;
    waktu_masuk: string;
    waktu_keluar: string | null;
    tarif_id: number;
    durasi: number | null;
    total_biaya: number | null;
    status: 'ongoing' | 'completed';
    petugas_id: number;
    area_parkir_id: number;
    kode_transaksi: string;
    created_at: string;
    updated_at: string;
    kendaraan?: Kendaraan;
    tarif?: Tarif;
    petugas?: User;
    areaParkir?: AreaParkir;
    [key: string]: unknown;
}