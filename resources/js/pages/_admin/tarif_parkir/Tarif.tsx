import DashboardHeader from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarLayout } from "@/layout/SidebarLayout"
import { AreaParkir, Tarif as TarifType, PaginatedData } from "@/types"
import { Link } from "@inertiajs/react"
import { IconSearch } from "@tabler/icons-react"
import { useState } from "react"
import { ArrowLeft, EllipsisVertical, Trash, Edit } from "lucide-react"
import tarifParkir from "@/routes/tarif-parkir"
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu"
import { ConfirmDelete } from "@/components/confirmModal"
import { Badge } from "@/components/ui/badge"

export default function Tarif({ areaParkir, tarif, allTarif }: { areaParkir: AreaParkir, tarif: PaginatedData<TarifType>, allTarif: TarifType[] }) {
    const [searchTerm, setSearchTerm] = useState<string>('')
    console.log(tarif);
    return (
        <SidebarLayout>
            <div className="space-y-6">
                <DashboardHeader title={`Data Tarif - ${areaParkir.nama}`} description={`Kelola dan kelola tarif parkir untuk area ${areaParkir.nama}`}>
                    <div className="flex gap-2 space-x-2">
                        <Link href={tarifParkir.index().url}><Button variant={'secondary'}><ArrowLeft />Kembali</Button></Link>
                        <Link href={`/admin/tarif-parkir/area/${areaParkir.id}/create`}>
                            <Button variant={'default'}>Tambah Tarif</Button>
                        </Link>
                    </div>
                </DashboardHeader>

                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari"
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    {tarif.data.map((tarif) => (
                        <TarifCard tarif={tarif} />
                    ))}
                </div>
            </div>
        </SidebarLayout>
    )
}


function TarifCard({ tarif }: { tarif: TarifType}) {
    const ruleType: Record<string, string> = {
        'flat': 'Flat',
        'interval': 'Per Interval',
        'progressive': 'Progressive'
    }

    const formatTime = (time: string | null) => {
        if (!time) return '-';
        return time.substring(0, 5);
    };

    return (
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-card-foreground">
                        {tarif.jenis_kendaraan.toString().charAt(0).toUpperCase() + tarif.jenis_kendaraan.toString().slice(1)}
                    </h3>

                    <div className="flex items-center gap-2">
                        <Badge variant={tarif.is_active ? 'default' : 'secondary'}>
                            {tarif.is_active ? 'Aktif' : 'Non-aktif'}
                        </Badge>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <EllipsisVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link href={tarifParkir.edit(tarif.id).url} className="flex items-center">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Link>
                            </DropdownMenuItem>
                            <ConfirmDelete
                                deleteUrl={tarifParkir.destroy(tarif.id).url}
                            >
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash className="h-4 w-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </ConfirmDelete>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="my-4 h-px bg-border" />

            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipe Harga</span>
                    <span className="font-medium">{ruleType[tarif.rule_type]}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-muted-foreground">Harga Awal</span>
                    <span className="font-semibold text-primary">
                        Rp {tarif.harga_awal ? tarif.harga_awal.toLocaleString("id-ID") : '-'}
                    </span>
                </div>

                {tarif.rule_type === 'interval' && tarif.interval_menit && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Interval</span>
                        <span className="font-medium">{tarif.interval_menit} menit</span>
                    </div>
                )}

                {tarif.rule_type === 'interval' && tarif.harga_lanjutan && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Harga Lanjutan</span>
                        <span className="font-semibold text-primary">
                            Rp {tarif.harga_lanjutan.toLocaleString("id-ID")}
                        </span>
                    </div>
                )}

                {tarif.rule_type === 'progressive' && (() => {
                    const rawRules = tarif.progressive_rules as unknown;
                    let rules: any[] = [];
                    if (Array.isArray(rawRules)) {
                        rules = rawRules;
                    } else if (typeof rawRules === 'string') {
                        try {
                            const parsed = JSON.parse(rawRules);
                            rules = Array.isArray(parsed) ? parsed : [];
                        } catch {
                            rules = [];
                        }
                    }

                    if (rules.length === 0) return null;

                    const visibleRules = rules.slice(0, 3);
                    const hasMore = rules.length > 3;

                    return (
                        <div className="space-y-2">
                            <span className="text-muted-foreground text-xs font-medium block">Progressive Rules:</span>
                            <div className="bg-muted/50 rounded p-2 space-y-1">
                                {visibleRules.map((rule: any, idx: number) => (
                                    <div key={idx} className="flex justify-between text-xs">
                                        <span>Jam {rule.jam_ke}:</span>
                                        <span className="font-medium">Rp {Number(rule.harga).toLocaleString("id-ID")}</span>
                                    </div>
                                ))}
                                {hasMore && (
                                    <div className="text-xs text-muted-foreground">...</div>
                                )}
                            </div>
                        </div>
                    );
                })()}

                {tarif.maksimal_per_hari && (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Maks/Hari</span>
                        <span className="font-medium">
                            Rp {tarif.maksimal_per_hari.toLocaleString("id-ID")}
                        </span>
                    </div>
                )}

                {tarif.berlaku_dari || tarif.berlaku_sampai ? (
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Waktu Berlaku</span>
                        <span className="font-medium">
                            {formatTime(tarif.berlaku_dari)} - {formatTime(tarif.berlaku_sampai)}
                        </span>
                    </div>
                ) : null}
            </div>
        </div>
    )
}
