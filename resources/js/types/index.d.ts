export interface Auth {
    user: User;
}

export interface SharedData {
    name: string;
    auth: Auth;
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
    pemilik: string;
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
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    [key: string]: unknown;
}