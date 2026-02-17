import { Transaksi } from '@/types'
import { useEffect } from 'react'
import Barcode from 'react-barcode'

interface Props {
  transaksi: Transaksi
}

export default function StrukMasuk({ transaksi }: Props) {
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

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="text-center border-b-2 border-dashed border-gray-300 pb-4 mb-4">
          <h1 className="text-2xl font-bold">STRUK MASUK PARKIR</h1>
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
            <span className="text-sm font-medium">Tanggal Masuk:</span>
            <span className="text-sm">
              {new Date(transaksi.waktu_masuk).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Waktu Masuk:</span>
            <span className="text-sm font-bold">
              {new Date(transaksi.waktu_masuk).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* Barcode */}
        <div className="flex justify-center my-4 border-y-2 border-dashed border-gray-300 py-4">
          <Barcode 
            value={`TRX${transaksi.id.toString().padStart(6, '0')}${transaksi.token}`}
            width={1.5}
            height={60}
            fontSize={12}
            background="transparent"
            displayValue={true}
          />
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

        {/* Tariff Info */}
        <div className="border-t-2 border-dashed border-gray-300 pt-4 mb-4">
          <h2 className="text-sm font-bold mb-2">INFORMASI TARIF</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Jenis Tarif:</span>
              <span className="text-sm">{transaksi.tarif?.rule_type === 'flat' ? 'Tarif Flat' : 'Per Jam'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Harga:</span>
              <span className="text-sm">{formatCurrency(transaksi.tarif?.price || 0)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-dashed border-gray-300 pt-4 mt-6">
          <p className="text-xs text-center text-gray-500">
            Simpan struk ini untuk pengeluaran kendaraan
          </p>
          <p className="text-xs text-center text-gray-500 mt-1">
            Scan barcode di atas untuk checkout
          </p>
          <p className="text-xs text-center text-gray-500 mt-1">
            Petugas: {transaksi.petugas?.name}
          </p>
          <p className="text-xs text-center text-gray-400 mt-2">
            Terima kasih atas kunjungan Anda
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
