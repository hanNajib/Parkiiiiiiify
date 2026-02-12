import { Transaksi } from '@/types'
import { useEffect } from 'react'

interface Props {
  transaksi: Transaksi
}

export default function StrukKeluar({ transaksi }: Props) {
  useEffect(() => {
    window.print()
  }, [])

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
    return `${hours} jam ${mins} menit`
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
          <h1 className="text-2xl font-bold">STRUK PEMBAYARAN PARKIR</h1>
          <p className="text-sm text-gray-600 mt-1">{transaksi.areaParkir?.nama}</p>
          <p className="text-xs text-gray-500">{transaksi.areaParkir?.lokasi}</p>
        </div>

        {/* Transaction Info */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-sm font-medium">No. Transaksi:</span>
            <span className="text-sm">#{transaksi.id.toString().padStart(6, '0')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Status:</span>
            <span className="text-sm font-bold text-green-600">LUNAS</span>
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="border-t-2 border-dashed border-gray-300 pt-4 mb-4">
          <h2 className="text-sm font-bold mb-2">INFORMASI KENDARAAN</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Plat Nomor:</span>
              <span className="text-sm font-bold">{transaksi.kendaraan?.plat_nomor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Jenis:</span>
              <span className="text-sm capitalize">{transaksi.kendaraan?.jenis_kendaraan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Warna:</span>
              <span className="text-sm">{transaksi.kendaraan?.warna}</span>
            </div>
          </div>
        </div>

        {/* Time Info */}
        <div className="border-t-2 border-dashed border-gray-300 pt-4 mb-4">
          <h2 className="text-sm font-bold mb-2">WAKTU PARKIR</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Masuk:</span>
              <span className="text-sm">
                {new Date(transaksi.waktu_masuk).toLocaleString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Keluar:</span>
              <span className="text-sm">
                {transaksi.waktu_keluar && new Date(transaksi.waktu_keluar).toLocaleString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-bold">Durasi:</span>
              <span className="text-sm font-bold">{formatDuration(transaksi.durasi)}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="border-t-2 border-dashed border-gray-300 pt-4 mb-4">
          <h2 className="text-sm font-bold mb-2">RINCIAN PEMBAYARAN</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Jenis Tarif:</span>
              <span className="text-sm">{transaksi.tarif?.rule_type === 'flat' ? 'Tarif Flat' : 'Per Jam'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Harga Satuan:</span>
              <span className="text-sm">{formatCurrency(transaksi.tarif?.price || 0)}</span>
            </div>
            {transaksi.tarif?.rule_type === 'per_jam' && (
              <div className="flex justify-between">
                <span className="text-sm font-medium">Durasi (dibulatkan):</span>
                <span className="text-sm">{Math.ceil((transaksi.durasi || 0) / 60)} jam</span>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-gray-800 pt-2 mt-2">
              <span className="text-lg font-bold">TOTAL:</span>
              <span className="text-lg font-bold">{formatCurrency(transaksi.total_biaya)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-6">
          <p className="text-xs text-center text-gray-500">
            Petugas: {transaksi.petugas?.name}
          </p>
          <p className="text-xs text-center text-gray-500 mt-1">
            Dicetak: {new Date().toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-center text-gray-400 mt-4">
            Terima kasih atas kunjungan Anda
          </p>
          <p className="text-xs text-center text-gray-400">
            Sampai jumpa kembali!
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>
    </div>
  )
}
