import { SidebarLayout } from '@/layout/SidebarLayout'
import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IconCar, IconSearch, IconUser } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Kendaraan, PaginatedData, User } from '@/types'
import DashboardHeader from '@/components/dashboard-header'
import StatCard from '@/components/StatCard'
import { DropdownMenu, DropdownMenuLabel, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuGroup } from '@/components/ui/dropdown-menu'
import { CarFront, EllipsisVertical, Motorbike, Trash, Truck } from 'lucide-react'
import { ConfirmDelete } from '@/components/confirmModal'
import usersRoute from '@/routes/users'
import { router } from '@inertiajs/react'
import kendaraanRoute from '@/routes/kendaraan'
import CreateModal from './CreateModal'
import EditModal from './EditModal'
import useDebounce from '@/hooks/useDebounce'

interface Props {
  kendaraan: PaginatedData<Kendaraan>
  stats: {
    total_kendaraan: number,
    total_mobil: number,
    total_motor: number,
    total_lainnya: number,
  }
  filter: {
    s?: string,
    jenis_kendaraan?: string,
  }
}

export default function Index({ kendaraan, stats, filter }: Props) {
  const [searchTerm, setSearchTerm] = useState(filter.s || '')
  const [jenisKendaraanFilter, setJenisKendaraanFilter] = useState<string>(filter.jenis_kendaraan || 'all')
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const isFirstRender = useRef(true)
  
  // Auto-sync filters: whenever filter state changes, apply filter
  useEffect(() => {
    // Skip first render to avoid duplicate request on mount
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    // Apply filter whenever debounced search or other filters change
    applyFilter()
  }, [debouncedSearchTerm, jenisKendaraanFilter])
  
  const applyFilter = () => {
    router.get(
        kendaraanRoute.index().url,
        {
            s: debouncedSearchTerm,
            jenis_kendaraan: jenisKendaraanFilter !== 'all' ? jenisKendaraanFilter : undefined,
        },
    )
  }

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <DashboardHeader title="Manajemen Kendaraan" description="Kelola dan monitor semua kendaraan di sistem">
          <CreateModal />
        </DashboardHeader>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari kendaraan berdasarkan plat nomor atau jenis kendaraan..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={jenisKendaraanFilter} onValueChange={(value) => {
                setJenisKendaraanFilter(value)
                // applyFilter triggered automatically via useEffect
              }}>
                <SelectTrigger className='w-full max-w-48'>
                  <SelectValue placeholder="Pilih jenis kendaraan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Jenis Kendaraan</SelectLabel>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="motor" >Motor</SelectItem>
                    <SelectItem value="mobil" >Mobil</SelectItem>
                    <SelectItem value="lainnya" >Lainnya</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Total Kendaraan"
            value={stats.total_kendaraan}
            icon={<CarFront className="h-6 w-6" />}
          />
          <StatCard
            title="Total Mobil"
            value={stats.total_mobil}
            icon={<IconCar className="h-6 w-6" />}
          />
          <StatCard
            title="Total Motor"
            value={stats.total_motor}
            icon={<Motorbike className="h-6 w-6" />}
          />
          <StatCard
            title="Total Kendaraan Lainnya"
            value={stats.total_lainnya}
            icon={<Truck className="h-6 w-6" />}
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Kendaraan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Jenis Kendaraan
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
                {kendaraan.data.length > 0 ? (
                  kendaraan.data.map((kendaraan) => (
                    <tr
                      key={kendaraan.id}
                      className="group transition-colors hover:bg-muted/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/10 text-primary">
                            {kendaraan.plat_nomor.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {kendaraan.plat_nomor}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {kendaraan.pemilik}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                          kendaraan.jenis_kendaraan === 'motor' && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                          kendaraan.jenis_kendaraan === 'mobil' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                          kendaraan.jenis_kendaraan === 'lainnya' && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        )}>
                          {kendaraan.jenis_kendaraan.charAt(0).toUpperCase() + kendaraan.jenis_kendaraan.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(kendaraan.created_at).toLocaleDateString('en-US', {
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
                              <EditModal kendaraan={kendaraan}></EditModal>
                              <ConfirmDelete deleteUrl={usersRoute.destroy(kendaraan.id).url}>
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
                          No users found
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {kendaraan.data.length > 0 && (
            <div className="flex items-center justify-between border-t border-border bg-muted/50 px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{kendaraan.data.length}</span> of{' '}
                <span className="font-medium">{kendaraan.data.length}</span> users
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
