import DashboardHeader from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarLayout } from "@/layout/SidebarLayout"
import { AreaParkir, Tarif as TarifType, PaginatedData } from "@/types"
import { Link } from "@inertiajs/react"
import { IconSearch } from "@tabler/icons-react"
import { useState } from "react"
import CreateModal from "./CreateModal"
import { ArrowLeft, CaseUpper, MapPinIcon, ParkingSquareIcon } from "lucide-react"
import tarifParkir from "@/routes/tarif-parkir"

export default function Tarif({ areaParkir, tarif, allTarif }: { areaParkir: AreaParkir, tarif: PaginatedData<TarifType>, allTarif: TarifType[] }) {
    const [searchTerm, setSearchTerm] = useState<string>('')
    console.log(tarif);
    return (
        <SidebarLayout>
            <div className="space-y-6">
                <DashboardHeader title={`Data Tarif - ${areaParkir.nama}`} description={`Kelola dan kelola tarif parkir untuk area ${areaParkir.nama}`}>
                    <div className="flex gap-2 space-x-2">
                        <Link href={tarifParkir.index().url}><Button variant={'secondary'}><ArrowLeft />Kembali</Button></Link>
                        <CreateModal idArea={areaParkir.id} existingTarif={allTarif} />
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
    const isFull = true

    const ruleType = {
        'per_jam': 'Per Jam',
        'flat': 'Flat'
    }

    return (
        <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">

            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-card-foreground">
                        Masyarakat
                    </h3>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPinIcon className="h-4 w-4" />
                        <span>timurnya sungai</span>
                    </div>
                </div>

                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                    <ParkingSquareIcon className="h-6 w-6" />
                </div>
            </div>

            <div className="my-4 h-px bg-border" />

            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Jenis Kendaraan</span>
                    <span className="font-medium">{tarif.jenis_kendaraan.toString().charAt(0).toUpperCase() + tarif.jenis_kendaraan.toString().slice(1)}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-muted-foreground">Tipe Harga</span>
                    <span className="font-medium">{ruleType[tarif.rule_type]}</span>
                </div>

                <div className="flex justify-between">
                    <span className="text-muted-foreground">Harga</span>
                    <span className="font-semibold text-primary">
                        Rp {tarif.price.toLocaleString("id-ID")}
                    </span>
                </div>
            </div>
        </div>
    )
}
