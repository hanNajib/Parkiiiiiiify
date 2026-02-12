import { SidebarLayout } from '@/layout/SidebarLayout'
import { AreaParkir } from '@/types'
import DashboardHeader from '@/components/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { router } from '@inertiajs/react'
import transaksiRoute from '@/routes/transaksi'
import { MapPin, Car, CheckCircle2, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  areaParkir: AreaParkir[]
}

export default function SelectArea({ areaParkir }: Props) {
  const handleSelectArea = (areaId: number) => {
    router.get(transaksiRoute.index(areaId).url)
  }

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <DashboardHeader 
          title="Pilih Area Parkir" 
          description="Pilih area parkir yang ingin Anda kelola transaksinya"
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {areaParkir.length > 0 ? (
            areaParkir.map((area) => (
              <Card 
                key={area.id} 
                className={cn(
                  "cursor-pointer transition-all hover:shadow-lg",
                  !area.is_active && "opacity-60"
                )}
                onClick={() => area.is_active && handleSelectArea(area.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        {area.nama}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {area.lokasi}
                      </CardDescription>
                    </div>
                    {area.is_active ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg bg-muted p-3">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Kapasitas</span>
                      </div>
                      <span className="text-sm font-bold">
                        {area.terisi || 0} / {area.kapasitas}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Tarif: {area.tarif_lengkap ? 'Lengkap' : 'Belum Lengkap'}
                      </span>
                      {area.tarif_lengkap ? (
                        <span className="text-xs text-green-600 dark:text-green-400">✓ Siap</span>
                      ) : (
                        <span className="text-xs text-orange-600 dark:text-orange-400">! Periksa</span>
                      )}
                    </div>

                    {area.is_active && (
                      <Button 
                        className="w-full mt-2" 
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectArea(area.id)
                        }}
                      >
                        Kelola Transaksi
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm font-medium text-muted-foreground">
                Tidak ada area parkir yang tersedia
              </p>
              <p className="text-xs text-muted-foreground">
                Hubungi admin untuk menambahkan area parkir
              </p>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  )
}
