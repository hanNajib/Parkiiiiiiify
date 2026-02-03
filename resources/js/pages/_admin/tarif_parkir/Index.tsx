import { SidebarLayout } from '@/layout/SidebarLayout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IconSearch } from '@tabler/icons-react'
import { AreaParkir, PaginatedData } from '@/types'
import DashboardHeader from '@/components/dashboard-header'
import { Box, CarFront, Database, Gauge, HardDrive, MapPinIcon, ParkingSquareIcon, UsersIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { Link } from '@inertiajs/react'
import areaParkir from '@/routes/area-parkir'
import tarifParkir from '@/routes/tarif-parkir'

interface Props {
    areaParkir: PaginatedData<AreaParkir>;
    filter: {
        s: string;
    }
}

export default function Index({ areaParkir, filter }: Props) {
    const [searchTerm, setSearchTerm] = useState(filter.s || '')
    return (
        <SidebarLayout>
            <div className="space-y-6">
                <DashboardHeader title="Manajemen Tarif Parkir" description="Kelola dan monitor semua tarif parkir di sistem. Pilih area parkir untuk melihat detail tarifnya, dan lengkapi semua informasi tarif">
                </DashboardHeader>

                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari area parkir berdasarkan nama atau lokasi..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {areaParkir.data.length > 0 ? areaParkir.data.map((area) => (
                      <AreaParkirCard area={area} />
                    )) : (
                      <p className="text-center text-muted-foreground col-span-3">Tidak ada area parkir ditemukan.</p>
                    )}
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">


                    {areaParkir.data.length > 0 && (
                        <div className="flex items-center justify-between border-t border-border bg-muted/50 px-6 py-4">
                            <p className="text-sm text-muted-foreground">
                                Showing <span className="font-medium">{areaParkir.data.length}</span> of{' '}
                                <span className="font-medium">{areaParkir.total}</span> area parkir
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" disabled>
                                    Previous
                                </Button>
                                <Button variant="outline" size="sm" disabled>
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SidebarLayout>
    )
}

function AreaParkirCard({area}: {area: AreaParkir}) {
  const isCompleted = area.tarif_lengkap;
  return (
    <Link href={tarifParkir.area(area.id).url} className="group cursor-pointer relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-card-foreground">
            {area.nama}
          </h3>

          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPinIcon className="h-4 w-4" />
            <span>{area.lokasi}</span>
          </div>
        </div>

        <div className="rounded-lg bg-primary/10 p-3 text-primary">
          <ParkingSquareIcon className="h-6 w-6" />
        </div>
      </div>

      <div className="my-4 h-px bg-border" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground" title='Kapasitas Parkir'>
          <CarFront className="h-4 w-4" />
          <span>
            {area.kapasitas}
          </span>
        </div>

        <Badge title={isCompleted ? "Segera Lengkapi Tarif Parkir" : "Semua Tarif Parkir Sudah Lengkap"}
          className={`rounded-full px-3 ${isCompleted ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
        >
          {isCompleted ? "Tarif Lengkap" : "Tarif Belum Lengkap"}
        </Badge>
      </div>
    </Link>
  )
}
