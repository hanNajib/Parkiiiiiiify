import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, FileText, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface RekapTransaksiExportProps {
  areaList?: any[]
  petugasList?: any[]
}

interface FilterState {
  startDate: string
  endDate: string
  areaId: string
  format: 'pdf' | 'excel'
}

interface PreviewData {
  totalTransactions: number
  totalRevenue: number
  avgRevenue: number
  dateRange: string
  area: string
}

export default function RekapTransaksiExport({ areaList = [], petugasList = [] }: RekapTransaksiExportProps) {
  const today = new Date().toISOString().split('T')[0]
  const firstDayOfMonth = new Date(new Date().setDate(1)).toISOString().split('T')[0]

  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [preview, setPreview] = useState<PreviewData | null>(null)

  const [filters, setFilters] = useState<FilterState>({
    startDate: firstDayOfMonth,
    endDate: today,
    areaId: 'all',
    format: 'pdf',
  })

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    setPreview(null)
  }

  const handleAreaChange = (value: string) => {
    setFilters((prev) => ({ ...prev, areaId: value }))
    setPreview(null)
  }

  const validateDates = (): boolean => {
    if (!filters.startDate || !filters.endDate) {
      toast.error('Tanggal mulai dan akhir harus diisi')
      return false
    }

    if (new Date(filters.startDate) > new Date(filters.endDate)) {
      toast.error('Tanggal mulai tidak boleh lebih besar dari tanggal akhir')
      return false
    }

    const daysDiff = Math.floor(
      (new Date(filters.endDate).getTime() - new Date(filters.startDate).getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysDiff > 365) {
      toast.error('Range tanggal tidak boleh lebih dari 365 hari')
      return false
    }

    return true
  }

  const generatePreview = async () => {
    if (!validateDates()) return

    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        start_date: filters.startDate,
        end_date: filters.endDate,
        ...(filters.areaId !== 'all' && { area_id: filters.areaId }),
        preview: 'true',
      })

      const response = await fetch(`/api/preview-rekap?${params}`)
      if (!response.ok) throw new Error('Gagal mengambil preview')

      const data = await response.json()
      const selectedAreaName = filters.areaId === 'all' ? 'Semua Area' : areaList.find((a) => a.id.toString() === filters.areaId)?.nama

      setPreview({
        totalTransactions: data.totalTransactions,
        totalRevenue: data.totalRevenue,
        avgRevenue: data.avgRevenue,
        dateRange: `${filters.startDate} s/d ${filters.endDate}`,
        area: selectedAreaName || 'Semua Area',
      })
      setShowPreview(true)
    } catch (error) {
      toast.error('Gagal membuat preview')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!validateDates()) return

    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        start_date: filters.startDate,
        end_date: filters.endDate,
        format: filters.format,
        ...(filters.areaId !== 'all' && { area_id: filters.areaId }),
      })

      const response = await fetch(`/download-rekap?${params}`, {
        method: 'POST',
        headers: {
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
      })

      if (!response.ok) throw new Error('Gagal download file')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const timestamp = new Date().toISOString().split('T')[0]
      const ext = filters.format === 'pdf' ? 'pdf' : 'xlsx'
      a.download = `Rekap-Transaksi-${timestamp}.${ext}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success(`File ${filters.format.toUpperCase()} berhasil diunduh`)
      setIsOpen(false)
      setShowPreview(false)
    } catch (error) {
      toast.error('Gagal mengunduh file. Coba lagi.')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Rekap Transaksi</span>
          <span className="sm:hidden">Rekap</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Download Rekap Transaksi
          </DialogTitle>
          <DialogDescription>
            {showPreview ? 'Review data dan pilih format export' : 'Atur filter dan preview data sebelum download'}
          </DialogDescription>
        </DialogHeader>

        {/* Preview State */}
        {showPreview && preview ? (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-xs text-muted-foreground">Transaksi</div>
                  <div className="text-2xl font-bold">{preview.totalTransactions}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-xs text-muted-foreground">Total Revenue</div>
                  <div className="text-lg font-bold">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(preview.totalRevenue)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Details */}
            <div className="space-y-2 bg-muted/50 rounded-lg p-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Periode:</span>
                <span className="font-medium">{preview.dateRange}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Area:</span>
                <span className="font-medium">{preview.area}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rata-rata:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(preview.avgRevenue)}
                </span>
              </div>
            </div>

            {/* Format Selection */}
            <div className="space-y-2">
              <Label>Format Export</Label>
              <div className="flex gap-2">
                <Button
                  variant={filters.format === 'pdf' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setFilters((prev) => ({ ...prev, format: 'pdf' }))}
                >
                  PDF
                </Button>
                <Button
                  variant={filters.format === 'excel' ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => setFilters((prev) => ({ ...prev, format: 'excel' }))}
                >
                  Excel
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowPreview(false)} className="flex-1" disabled={isLoading}>
                Kembali
              </Button>
              <Button onClick={handleDownload} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download {filters.format.toUpperCase()}
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* Filter State */
          <div className="space-y-4">
            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="start-date">Dari Tanggal</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  max={filters.endDate}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">Hingga Tanggal</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  min={filters.startDate}
                />
              </div>
            </div>

            {/* Area Filter */}
            <div className="space-y-2">
              <Label htmlFor="area-select">Area Parkir</Label>
              <Select value={filters.areaId} onValueChange={handleAreaChange}>
                <SelectTrigger id="area-select">
                  <SelectValue placeholder="Pilih area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Area</SelectItem>
                  {areaList.map((area) => (
                    <SelectItem key={area.id} value={area.id.toString()}>
                      {area.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Info */}
            <div className="flex gap-2 bg-blue-50 text-blue-900 text-sm p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p>Pilih periode maksimal 365 hari untuk performa optimal</p>
            </div>

            {/* Preview Button */}
            <Button onClick={generatePreview} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memuat Preview...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Lihat Preview
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
