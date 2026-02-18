import DashboardHeader from "@/components/dashboard-header";
import { SidebarLayout } from "@/layout/SidebarLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Head, router } from "@inertiajs/react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { IconSearch, IconCheck } from "@tabler/icons-react";
import { ChevronLeft } from "lucide-react";

interface Petugas {
    id: number;
    name: string;
    email: string;
    is_assigned: boolean;
}

interface AreaParkir {
    id: number;
    nama: string;
    lokasi: string;
    kapasitas: number;
    default_rule_type: string;
    is_active: boolean;
}

const ruleTypeLabel: Record<string, string> = {
    choose: "Pilih Saat Transaksi",
    flat: "Flat (sekali bayar)",
    interval: "Interval (per blok waktu)",
    progressive: "Progresif (bertahap per jam)"
};

export default function Show({ area, allPetugas }: { area: AreaParkir; allPetugas: Petugas[] }) {
    const [selectedPetugas, setSelectedPetugas] = useState<number[]>(
        allPetugas.filter((p) => p.is_assigned).map((p) => p.id)
    );
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredPetugas = useMemo(() => {
        return allPetugas.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allPetugas, searchTerm]);

    const handleCheckboxChange = (petugasId: number) => {
        setSelectedPetugas((prev) =>
            prev.includes(petugasId)
                ? prev.filter((id) => id !== petugasId)
                : [...prev, petugasId]
        );
    };

    const handleSelectAll = () => {
        if (selectedPetugas.length === filteredPetugas.length) {
            setSelectedPetugas([]);
        } else {
            setSelectedPetugas(filteredPetugas.map((p) => p.id));
        }
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "";
            const response = await fetch(
                `/admin/area-parkir/${area.id}/petugas`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": csrfToken,
                    },
                    body: JSON.stringify({ petugas_ids: selectedPetugas }),
                }
            );

            if (response.ok) {
                toast.success("Petugas berhasil diperbarui");
                router.visit("/admin/area-parkir");
            } else {
                const data = await response.json();
                toast.error(data.message || "Gagal menyimpan perubahan");
            }
        } catch (error) {
            toast.error("Terjadi kesalahan saat menyimpan");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SidebarLayout>
            <Head title={`Detail Area Parkir - ${area.nama}`} />
            <div className="space-y-6">
                <DashboardHeader
                    title={area.nama}
                    description={`Lokasi: ${area.lokasi} • Kapasitas: ${area.kapasitas} slot`}
                />

                {/* Breadcrumb */}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.visit("/admin/area-parkir")}
                    className="gap-2"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Kembali ke Area Parkir
                </Button>

                {/* Info Card */}
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="text-sm font-semibold mb-4">Informasi Area Parkir</h3>
                    <div className="grid gap-6 md:grid-cols-3">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Nama Area</p>
                            <p className="font-medium text-sm">{area.nama}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Lokasi</p>
                            <p className="font-medium text-sm">{area.lokasi}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Kapasitas</p>
                            <p className="font-medium text-sm">{area.kapasitas} slot</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Tipe Aturan Default</p>
                            <Badge variant="secondary" className="mt-1">
                                {ruleTypeLabel[area.default_rule_type] || area.default_rule_type}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Status</p>
                            <Badge variant={area.is_active ? "default" : "destructive"} className="mt-1">
                                {area.is_active ? "Aktif" : "Nonaktif"}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Petugas Assignment Section */}
                <form onSubmit={handleSave} className="space-y-4">
                    {/* Search & Filter */}
                    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center">
                            <div className="relative flex-1">
                                <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Cari petugas berdasarkan nama atau email..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleSelectAll}
                            >
                                {selectedPetugas.length === filteredPetugas.length
                                    ? "Deselect All"
                                    : "Select All"}
                            </Button>
                        </div>
                    </div>

                    {/* Petugas Table */}
                    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border bg-muted/50">
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground w-12">
                                            <input
                                                type="checkbox"
                                                checked={selectedPetugas.length === filteredPetugas.length && filteredPetugas.length > 0}
                                                onChange={handleSelectAll}
                                                className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                                            />
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Nama
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Status Assign
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredPetugas.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-sm text-muted-foreground">
                                                Tidak ada petugas yang ditemukan
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredPetugas.map((petugas) => (
                                            <tr
                                                key={petugas.id}
                                                className="group transition-colors hover:bg-muted/50"
                                            >
                                                <td className="px-6 py-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPetugas.includes(petugas.id)}
                                                        onChange={() => handleCheckboxChange(petugas.id)}
                                                        className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-sm">{petugas.name}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm text-muted-foreground">{petugas.email}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {petugas.is_assigned ? (
                                                        <Badge variant="default" className="gap-1">
                                                            <IconCheck className="h-3 w-3" />
                                                            Assigned
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">Unassigned</Badge>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Summary */}
                    {allPetugas.length > 0 && (
                        <div className="rounded-xl border border-border bg-muted/30 p-4">
                            <p className="text-sm">
                                Total dipilih: <span className="font-semibold">{selectedPetugas.length}</span> dari{" "}
                                <span className="font-semibold">{allPetugas.length}</span> petugas
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <Button type="submit" disabled={isLoading} className="flex-1">
                            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.visit("/admin/area-parkir")}
                        >
                            Batal
                        </Button>
                    </div>
                </form>
            </div>
        </SidebarLayout>
    );
}