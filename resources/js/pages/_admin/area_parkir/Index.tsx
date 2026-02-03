import { SidebarLayout } from '@/layout/SidebarLayout'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IconSearch, IconUser } from '@tabler/icons-react'
import { AreaParkir, PaginatedData } from '@/types'
import DashboardHeader from '@/components/dashboard-header'
import StatCard from '@/components/StatCard'
import CreateModal from './CreateModal'
import { DropdownMenu, DropdownMenuLabel, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuGroup } from '@/components/ui/dropdown-menu'
import { Box, CheckCircle, CircleDashed, DollarSignIcon, EllipsisVertical, Grid, ParkingCircle, ParkingSquare, Trash } from 'lucide-react'
import EditModal from './EditModal'
import { ConfirmDelete } from '@/components/confirmModal'
import areaParkirRoute from '@/routes/area-parkir'
import { Badge } from '@/components/ui/badge'

interface Props {
  areaParkir: PaginatedData<AreaParkir>
  stats:  {
    total_area_parkir: number,
    total_kapasitas: number,
    total_terisi: number,
    total_kosong: number
  }
  filter: {
    s?: string,
    role?: string
  }
}

export default function Index({ areaParkir, stats, filter }: Props) {
  const [searchTerm, setSearchTerm] = useState(filter.s || '')

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <DashboardHeader title="Manajemen Area Parkir" description="Kelola dan monitor semua area parkir di sistem">
          <CreateModal />
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

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Total Area Parkir"
            value={stats.total_area_parkir}
            icon={<ParkingSquare className="h-6 w-6" />}
          />
          <StatCard
            title="Total Kapasitas"
            value={stats.total_kapasitas}
            icon={<Box className="h-6 w-6" />}
          />
          <StatCard
            title="Total Terisi"
            value={stats.total_terisi}
            icon={<CheckCircle className="h-6 w-6" />}
          />
          <StatCard
            title="Total Kosong"
            value={stats.total_kosong}
            icon={<CircleDashed className="h-6 w-6" />}
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    No.
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Nama
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Lokasi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Terisi/Kapasitas
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tarif Parkir
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tanggal Dibuat
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {areaParkir.data.length > 0 ? (
                  areaParkir.data.map((area: AreaParkir) => (
                    <tr
                      key={area.id}
                      className="group transition-colors hover:bg-muted/50"
                    >
                      <td className="px-6 py-4">
                        {areaParkir.data.indexOf(area) + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{area.nama}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {area.lokasi}
                      </td>
                      <td className="px-6 py-4">
                        {area.terisi} / {area.kapasitas}
                      </td>
                      <td className="px-6 py-4">
                        {area.tarif_lengkap ? (
                          <Badge className='bg-green-500 text-white cursor-pointer' title='Tarif Parkir Sudah Lengkap'>Lengkap</Badge>
                        ) : (
                        <Badge className='bg-red-500 text-white cursor-pointer' title='Silahkan Lengkapi Tarif Parkir'>Belum Lengkap</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(area.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon' className='float-right cursor-pointer'>
                              <EllipsisVertical />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                              <EditModal area={area}></EditModal>
                              <DropdownMenuItem>
                                <DollarSignIcon/>Tarif Parkir
                              </DropdownMenuItem>
                              <ConfirmDelete deleteUrl={areaParkirRoute.destroy(area.id).url}>
                                <DropdownMenuItem variant='destructive' onSelect={(e) => e.preventDefault()}>
                                  <Trash/>Hapus
                                </DropdownMenuItem>
                              </ConfirmDelete>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <IconSearch className="h-12 w-12 text-muted-foreground/50" />
                        <p className="text-sm font-medium text-muted-foreground">
                          Tidak ada area parkir yang ditemukan
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Coba sesuaikan kata kunci pencarian atau filter Anda.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
