import { SidebarLayout } from '@/layout/SidebarLayout'
import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IconSearch } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Transaksi, PaginatedData, AreaParkir, Kendaraan, Tarif, PageProps } from '@/types'
import DashboardHeader from '@/components/dashboard-header'
import StatCard from '@/components/StatCard'
import { DropdownMenu, DropdownMenuLabel, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuGroup } from '@/components/ui/dropdown-menu'
import { EllipsisVertical, Trash, Clock, DollarSign, CheckCircle, Receipt, MapPin, ArrowLeft, Calendar } from 'lucide-react'
import { ConfirmDelete } from '@/components/confirmModal'
import { router } from '@inertiajs/react'
import transaksiRoute from '@/routes/transaksi'
import CreateModal from './CreateModal'
import EditModal from './EditModal'
import { Badge } from '@/components/ui/badge'
import BarcodeScanner from '@/components/BarcodeScanner'
import { toast } from 'sonner'
import { usePage } from '@inertiajs/react'
import useDebounce from '@/hooks/useDebounce'

interface Props {
  transaksi: PaginatedData<Transaksi>
  stats: {
    total_transaksi: number,
    total_ongoing: number,
    total_completed: number,
    total_revenue: number,
  }
  areaParkir: AreaParkir
  kendaraanList: Kendaraan[]
  tarifList: Tarif[]
  filter: {
    s?: string,
    status?: string,
    date_from?: string,
    date_to?: string,
  }
}

export default function Index({ transaksi, stats, areaParkir, kendaraanList, tarifList, filter }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [searchTerm, setSearchTerm] = useState(filter.s || '')
  const [statusFilter, setStatusFilter] = useState<string>(filter.status || 'all')
  const [dateFrom, setDateFrom] = useState(filter.date_from || today)
  const [dateTo, setDateTo] = useState(filter.date_to || today)
  const [showDateFilter, setShowDateFilter] = useState(false)
  const { props } = usePage<PageProps>()
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const isFirstRender = useRef(true)
  
  useEffect(() => {
    if (showDateFilter && !filter.date_from && !filter.date_to) {
      if (!dateFrom) setDateFrom(today)
      if (!dateTo) setDateTo(today)
    }
  }, [showDateFilter])
  
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    applyFilter({ s: debouncedSearchTerm })
  }, [debouncedSearchTerm])

  useEffect(() => {
    const flash = props.flash as any
    
    if (flash?.print_struk_masuk) {
      const url = transaksiRoute.cetakStrukMasuk({ areaParkir: areaParkir.id, transaksi: flash.print_struk_masuk }).url
      window.open(url, '_blank')
    }
    
    if (flash?.print_struk_keluar) {
      const url = transaksiRoute.cetakStrukKeluar({ areaParkir: areaParkir.id, transaksi: flash.print_struk_keluar }).url
      window.open(url, '_blank')
    }
  }, [props.flash])
  
  const applyFilter = (extra = {}) => {
    router.get(
        transaksiRoute.index({ areaParkir: areaParkir.id }).url,
        {
            s: searchTerm,
            status: statusFilter !== 'all' ? statusFilter : undefined,
            date_from: dateFrom || undefined,
            date_to: dateTo || undefined,
            ...extra
        },
    )
  }

  const handleCheckout = (id: number) => {
    router.put(transaksiRoute.update({ areaParkir: areaParkir.id, transaksi: id }).url, {}, {
      onSuccess: () => {
        
      }
    })
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDuration = (minutes: number | null) => {
    if (minutes === null) return '-'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}j ${mins}m`
  }

  const handleBarcodeScanned = (code: string) => {
    const match = code.match(/TRX0*(\d+)/i)
    if (!match) {
      toast.error('Format barcode tidak valid')
      return
    }

    const transactionId = parseInt(match[1])
    
    const transaction = transaksi.data.find(t => t.id === transactionId)
    
    if (!transaction) {
      toast.error(`Transaksi #${transactionId} tidak ditemukan di area ini`)
      return
    }

    if (transaction.status !== 'ongoing') {
      toast.error('Transaksi ini sudah selesai')
      return
    }

    handleCheckout(transactionId)
  }

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <DashboardHeader 
          title={`Transaksi - ${areaParkir.nama}`} 
          description={`Kelola transaksi parkir di ${areaParkir.lokasi}`}
        >
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => router.get(transaksiRoute.selectArea().url)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <BarcodeScanner 
              onScanComplete={handleBarcodeScanned}
              title="Scan Barcode untuk Checkout"
              description="Scan barcode dari struk masuk untuk checkout kendaraan"
            />
            <CreateModal areaParkirId={areaParkir.id} kendaraanList={kendaraanList} tarifList={tarifList} />
          </div>
        </DashboardHeader>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cari berdasarkan plat nomor atau pemilik kendaraan..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  variant={showDateFilter ? "default" : "outline"}
                  size="icon"
                  onClick={() => setShowDateFilter(!showDateFilter)}
                  title={showDateFilter ? "Sembunyikan filter" : "Tampilkan filter"}
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {showDateFilter && (
              <div className="flex flex-col gap-4 p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                    <Select value={statusFilter} onValueChange={(value) => {
                      setStatusFilter(value)
                      applyFilter({ status: value })
                    }}>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="all">Semua</SelectItem>
                          <SelectItem value="ongoing">Sedang Parkir</SelectItem>
                          <SelectItem value="completed">Selesai</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Dari Tanggal</label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => {
                        setDateFrom(e.target.value)
                        applyFilter({ date_from: e.target.value, date_to: dateTo })
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground mb-1 block">Sampai Tanggal</label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => {
                        setDateTo(e.target.value)
                        applyFilter({ date_from: dateFrom, date_to: e.target.value })
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0]
                      setStatusFilter('all')
                      setDateFrom(today)
                      setDateTo(today)
                      applyFilter({ status: undefined, date_from: today, date_to: today })
                    }}
                  >
                    Reset Filter
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Total Transaksi"
            value={stats.total_transaksi}
            icon={<Receipt className="h-6 w-6" />}
          />
          <StatCard
            title="Sedang Parkir"
            value={stats.total_ongoing}
            icon={<Clock className="h-6 w-6" />}
          />
          <StatCard
            title="Selesai"
            value={stats.total_completed}
            icon={<CheckCircle className="h-6 w-6" />}
          />
          <StatCard
            title="Total Pendapatan"
            value={stats.total_revenue}
            icon={<DollarSign className="h-6 w-6" />}
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
                    Waktu Masuk
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Durasi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Total Biaya
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transaksi.data.length > 0 ? (
                  transaksi.data.map((item) => (
                    <tr
                      key={item.id}
                      className="group transition-colors hover:bg-muted/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                            {item.kendaraan?.plat_nomor?.charAt(0) || 'K'}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {item.kendaraan?.plat_nomor || '-'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {item.kendaraan?.pemilik || '-'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(item.waktu_masuk).toLocaleString('id-ID', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDuration(item.durasi)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {formatCurrency(item.total_biaya)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={item.status === 'ongoing' ? 'default' : 'secondary'}>
                          {item.status === 'ongoing' ? 'Parkir' : 'Selesai'}
                        </Badge>
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
                              {item.status === 'ongoing' && (
                                <>
                                  <DropdownMenuItem 
                                    onClick={() => handleCheckout(item.id)}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Checkout
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => window.open(transaksiRoute.cetakStrukMasuk({ areaParkir: areaParkir.id, transaksi: item.id }).url, '_blank')}
                                  >
                                    <Receipt className="mr-2 h-4 w-4" />
                                    Cetak Struk Masuk
                                  </DropdownMenuItem>
                                </>
                              )}
                              {item.status === 'completed' && (
                                <DropdownMenuItem 
                                  onClick={() => window.open(transaksiRoute.cetakStrukKeluar({ areaParkir: areaParkir.id, transaksi: item.id }).url, '_blank')}
                                >
                                  <Receipt className="mr-2 h-4 w-4" />
                                  Cetak Struk Keluar
                                </DropdownMenuItem>
                              )}
                              <ConfirmDelete deleteUrl={transaksiRoute.destroy({ areaParkir: areaParkir.id, transaksi: item.id }).url}>
                                <DropdownMenuItem variant='destructive' onSelect={(e) => e.preventDefault()}>
                                  <Trash className="mr-2 h-4 w-4" />Hapus
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
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <IconSearch className="h-12 w-12 text-muted-foreground/50" />
                        <p className="text-sm font-medium text-muted-foreground">
                          Tidak ada transaksi ditemukan
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Coba sesuaikan pencarian atau filter Anda
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {transaksi.data.length > 0 && (
            <div className="flex items-center justify-between border-t border-border bg-muted/50 px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{transaksi.from}</span> to{' '}
                <span className="font-medium">{transaksi.to}</span> of{' '}
                <span className="font-medium">{transaksi.total}</span> transaksi
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={transaksi.current_page === 1}
                  onClick={() => applyFilter({ page: transaksi.current_page - 1 })}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={transaksi.current_page === transaksi.last_page}
                  onClick={() => applyFilter({ page: transaksi.current_page + 1 })}
                >
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
