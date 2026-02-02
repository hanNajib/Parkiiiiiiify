import DashboardHeader from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarLayout } from "@/layout/SidebarLayout";
import kendaraan from "@/routes/kendaraan";
import { Kendaraan, PaginatedData } from "@/types";
import { Link } from "@inertiajs/react";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useState } from "react";

interface Props {
    data: PaginatedData<Kendaraan>
    filter: {
        s?: string
    }
}

export default function Index({ data, filter }: Props) {
    const [searchTerm, setSearchTerm] = useState<string>('')
    return (
        <SidebarLayout>
            <div className="space-y-6">
                <DashboardHeader title="Data Kendaraan" description="Kelola dan monitor semua kendaraan yang terdaftar di sistem">
                    <Link href={kendaraan.create().url}>
                        <Button variant={'default'} className="group/btn cursor-pointer from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                            <IconPlus className="h-4 w-4" />
                            Tambah Kendaraan Baru
                        </Button>
                    </Link>
                </DashboardHeader>

                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Cari kendaraan berdasarkan jenis atau plat nomor..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Select>
                                <SelectTrigger className='w-full max-w-48'>
                                    <SelectValue placeholder="Pilih jenis kendaraan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Role</SelectLabel>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="motor">Motor</SelectItem>
                                        <SelectItem value="mobil">Mobil</SelectItem>
                                        <SelectItem value="lainnya">Lainnya</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarLayout>

    )
}