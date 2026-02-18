import { SidebarLayout } from '@/layout/SidebarLayout'
import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IconSearch } from '@tabler/icons-react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Transaksi, PaginatedData, AreaParkir, Kendaraan, PageProps } from '@/types'
import DashboardHeader from '@/components/dashboard-header'
import StatCard from '@/components/StatCard'
import { Trash, Clock, DollarSign, CheckCircle, Receipt, ArrowLeft, Calendar } from 'lucide-react'
import { ConfirmDelete } from '@/components/confirmModal'
import { router } from '@inertiajs/react'
import transaksiRoute from '@/routes/transaksi'
import CreateModal from './CreateModal'
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
  filter: {
    s?: string,
    status?: string,
    date_from?: string,
    date_to?: string,
  }
}

export default function Index({ transaksi, stats, areaParkir, kendaraanList, filter }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const [searchTerm, setSearchTerm] = useState(filter.s || '')
  const [statusFilter, setStatusFilter] = useState<string>(filter.status || 'all')
  const [dateFrom, setDateFrom] = useState(filter.date_from || '')
  const [dateTo, setDateTo] = useState(filter.date_to || '')
  const [showDateFilter, setShowDateFilter] = useState(filter.date_from ? true : false)
  const { props } = usePage<PageProps>()
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const isFirstRender = useRef(true)
  
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    applyFilter()
  }, [debouncedSearchTerm, statusFilter, dateFrom, dateTo])
  
  useEffect(() => {
    if (showDateFilter && !dateFrom && !dateTo) {
      setDateFrom(today)
      setDateTo(today)
    }
  }, [showDateFilter])

  useEffect(() => {
    const flash = props.flash as any
    
    if (flash?.print_struk_masuk) {
      const url = transaksiRoute.cetakStrukMasuk({ areaParkir: areaParkir.id, transaksi: flash.print_struk_masuk }).url
      window.open(url, '_blank')
      toast.success('Struk masuk berhasil dicetak! Periksa tab baru.')
    }
    
    if (flash?.print_struk_keluar) {
      const url = transaksiRoute.cetakStrukKeluar({ areaParkir: areaParkir.id, transaksi: flash.print_struk_keluar }).url
      window.open(url, '_blank')
      toast.success('Checkout berhasil! Struk keluar sedang dicetak...')
    }
  }, [props.flash])
  
  const applyFilter = (options?: { page?: number }) => {
    router.get(
        transaksiRoute.index({ areaParkir: areaParkir.id }).url,
        {
            s: debouncedSearchTerm,  // Use debounced value to prevent spam
            status: statusFilter !== 'all' ? statusFilter : undefined,
            date_from: dateFrom ? dateFrom : undefined,
            date_to: dateTo ? dateTo : undefined,
            page: options?.page,
        },
    )
  }

  const handleCheckout = (id: number) => {
    router.put(transaksiRoute.update({ areaParkir: areaParkir.id, transaksi: id }).url, {}, {
      preserveScroll: true,
      onSuccess: () => {
        toast.info('Memproses checkout...')
      },
      onError: (errors) => {
        toast.error(errors[Object.keys(errors)[0]] || 'Checkout gagal')
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

  const handleBarcodeScanned = async (code: string) => {
    const match = code.match(/TRX0*(\d+)/i)
    if (!match) {
      toast.error('Format barcode tidak valid')
      return
    }

    const transactionId = parseInt(match[1])
    
    const transaction = async () => {
      try {
        const res = await fetch(transaksiRoute.lookupBarcode({ areaParkir: areaParkir.id, code }).url)
        if (!res.ok) throw new Error('Transaksi tidak ditemukan')
        return await res.json() as Transaksi
      } catch(error) {
        return null
      }
    }
    
    const foundTransaction = await transaction()
    if (!foundTransaction) {
      toast.error(`Transaksi #${transactionId} tidak ditemukan di area ini`)
      return
    }

    if (foundTransaction.status !== 'ongoing') {
      toast.error('Transaksi ini sudah selesai')
      return
    }

    handleCheckout(foundTransaction.id)
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
            <CreateModal areaParkir={areaParkir} kendaraanList={kendaraanList} />
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

              <div className="w-full md:w-56">
                <label className="sr-only">Status</label>
                <Select value={statusFilter} onValueChange={(value) => {
                  setStatusFilter(value)
                  // applyFilter triggered automatically via useEffect
                }}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
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
              <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/30 p-4">
                <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Dari Tanggal</label>
                    <Input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => {
                        setDateFrom(e.target.value)
                        // applyFilter triggered automatically via useEffect
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Sampai Tanggal</label>
                    <Input
                      type="date"
                      value={dateTo}
                      onChange={(e) => {
                        setDateTo(e.target.value)
                      }}
                    />
                  </div>
                  <div className="flex gap-2 md:justify-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const today = new Date().toISOString().split('T')[0]
                        setStatusFilter('all')
                        setDateFrom(today)
                        setDateTo(today)
                      }}
                    >
                      Reset Filter
                    </Button>
                  </div>
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
                    Kode Transaksi
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
                  transaksi.data.map((item) => {
                    return (
                      <tr
                        key={item.id}
                        className="group transition-colors hover:bg-muted/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/10 text-primary">
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
                          {item.kode_transaksi + item.token}
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
                          <div className="flex justify-end gap-2">
                            {item.status === 'ongoing' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleCheckout(item.id)}
                                  title="Checkout kendaraan"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => window.open(
                                    transaksiRoute.cetakStrukMasuk({
                                      areaParkir: areaParkir.id,
                                      transaksi: item.id
                                    }).url,
                                    '_blank'
                                  )}
                                  title="Cetak struk masuk"
                                >
                                  <Receipt className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {item.status === 'completed' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(
                                  transaksiRoute.cetakStrukKeluar({
                                    areaParkir: areaParkir.id,
                                    transaksi: item.id
                                  }).url,
                                  '_blank'
                                )}
                                title="Cetak struk keluar"
                              >
                                <Receipt className="h-4 w-4" />
                              </Button>
                            )}
                            <ConfirmDelete
                              variant='default'
                              deleteUrl={transaksiRoute.destroy({
                                areaParkir: areaParkir.id,
                                transaksi: item.id
                              }).url}
                            >
                              <Button
                                size="sm"
                                variant="destructive"
                                title="Hapus transaksi"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </ConfirmDelete>
                          </div>
                        </td>
                      </tr>
                    )
                  })
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
