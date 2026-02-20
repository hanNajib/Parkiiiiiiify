import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Kendaraan } from "@/types";
import { useForm } from "@inertiajs/react";
import { IconLoader2, IconInfoCircle } from "@tabler/icons-react";
import { Edit } from "lucide-react";
import { FormEventHandler, useState, useEffect } from "react";
import kendaraaanRoute from '@/routes/kendaraan';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

type EditFormData = {
    plat_nomor: string;
    jenis_kendaraan: "motor" | "mobil" | "lainnya";
    warna: string;
};

interface EditModalProps {
    kendaraan: Kendaraan;
    controlled?: boolean;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    fromScan?: boolean; 
}

export default function EditModal({ kendaraan, controlled = false, isOpen, onOpenChange, fromScan = false }: EditModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    
    // Gunakan controlled state jika ada, jika tidak gunakan internal state
    const open = controlled ? (isOpen ?? false) : internalOpen;
    const handleOpenChange = controlled ? onOpenChange : setInternalOpen;
    const { data, setData, put, processing, errors, reset} = useForm<EditFormData>({
        plat_nomor: kendaraan.plat_nomor,
        jenis_kendaraan: kendaraan.jenis_kendaraan,
        warna: kendaraan.warna,
    });

    // Reset form ketika kendaraan berubah (untuk controlled mode)
    useEffect(() => {
        if (controlled && isOpen) {
            setData({
                plat_nomor: kendaraan.plat_nomor,
                jenis_kendaraan: kendaraan.jenis_kendaraan,
                warna: kendaraan.warna,
            });
        }
    }, [kendaraan.id, isOpen, controlled]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(kendaraaanRoute.update(kendaraan.id).url, {
            onSuccess: () => {
                reset();
                if (handleOpenChange) {
                    handleOpenChange(false);
                }
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {!controlled && (
                <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}><Edit/>Edit</DropdownMenuItem>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Kendaraan</DialogTitle>
                        <DialogDescription>
                            {fromScan ? 'Kendaraan ini sudah terdaftar. Edit informasi kendaraan di bawah ini.' : 'Edit informasi kendaraan dan simpan perubahan di bawah ini.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {fromScan && (
                            <Alert>
                                <IconInfoCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Kendaraan dengan plat <strong>{kendaraan.plat_nomor}</strong> ditemukan di database!
                                </AlertDescription>
                            </Alert>
                        )}
                        <Field>
                            <Label htmlFor="plat_nomor">Plat Nomor</Label>
                            <Input id="plat_nomor" name="plat_nomor" value={data.plat_nomor} onChange={e => setData('plat_nomor', e.target.value.toUpperCase())} placeholder="Masukkan plat nomor" className={errors.plat_nomor ? 'border-destructive' : ''} disabled={processing} />
                            {errors.plat_nomor && (
                                <p className="text-sm text-destructive mt-1">{errors.plat_nomor}</p>
                            )}
                        </Field>

                        <Field>
                            <Label htmlFor="jenis_kendaraan">Jenis Kendaraan</Label>
                            <Select
                                value={data.jenis_kendaraan}
                                onValueChange={(value) => setData('jenis_kendaraan', value as "motor" | "mobil" | "lainnya")}
                                disabled={processing}
                            >
                                <SelectTrigger className={errors.jenis_kendaraan ? 'border-destructive' : ''}>
                                    <SelectValue placeholder="Pilih jenis kendaraan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mobil">Mobil</SelectItem>
                                    <SelectItem value="motor">Motor</SelectItem>
                                    <SelectItem value="lainnya">Lainnya</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.jenis_kendaraan && (
                                <p className="text-sm text-destructive mt-1">{errors.jenis_kendaraan}</p>
                            )}
                        </Field>

                        

                        <Field>
                            <Label htmlFor="warna">Warna</Label>
                            <Input 
                                id="warna" 
                                name="warna" 
                                type="text"
                                value={data.warna}
                                onChange={(e) => setData('warna', e.target.value)}
                                placeholder="Contoh: Hitam, Putih, Merah"
                                className={errors.warna ? 'border-destructive' : ''}
                                disabled={processing}
                            />
                            {errors.warna && (
                                <p className="text-sm text-destructive mt-1">{errors.warna}</p>
                            )}
                        </Field>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button" disabled={processing}>
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing && <IconLoader2 className="h-4 w-4 animate-spin mr-2" />}
                            {processing ? 'Menyimpan...' : (fromScan ? 'Update Kendaraan' : 'Simpan')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}