import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconPlus, IconLoader2 } from "@tabler/icons-react";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import kendaraanRoute from "@/routes/kendaraan";
import VehicleScanner from "@/components/VehicleScanner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import EditModal from "./EditModal";
import { Kendaraan } from "@/types";

export default function CreateModal() {
    const [open, setOpen] = useState(false);
    const [scanMessage, setScanMessage] = useState<string>('');
    const [existingVehicle, setExistingVehicle] = useState<Kendaraan | null>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        plat_nomor: '',
        jenis_kendaraan: 'mobil',
        warna: '',
    });

    const handleScanComplete = (scanData: {
        plat_nomor: string;
        jenis_kendaraan?: string;
        exists?: boolean;
        existingData?: any;
    }) => {
        if (scanData.exists) {
            // Kendaraan sudah terdaftar - buka EditModal
            setScanMessage('');
            setOpen(false); // Tutup CreateModal
            setExistingVehicle(scanData.existingData); // Set data untuk EditModal
        } else {
            // Kendaraan baru - auto-fill form
            setScanMessage(`Plat nomor ${scanData.plat_nomor} berhasil dideteksi!`);
            setData({
                ...data,
                plat_nomor: scanData.plat_nomor,
                jenis_kendaraan: scanData.jenis_kendaraan || 'mobil',
            });
        }
    };

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(kendaraanRoute.store().url, {
            onSuccess: () => {
                reset();
                setScanMessage('');
                setOpen(false);
            },
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setScanMessage('');
        }
    };

    return (
        <>
            {/* EditModal untuk kendaraan yang sudah ada */}
            {existingVehicle && (
                <EditModal
                    kendaraan={existingVehicle}
                    controlled={true}
                    isOpen={true}
                    fromScan={true}
                    onOpenChange={(isOpen: boolean) => {
                        if (!isOpen) {
                            setExistingVehicle(null);
                        }
                    }}
                />
            )}
            
            {/* CreateModal untuk kendaraan baru */}
            <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant={'default'} className="group/btn cursor-pointer from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    <IconPlus className="h-4 w-4" />
                    Tambah Kendaraan
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Tambah Kendaraan</DialogTitle>
                        <DialogDescription>
                            Scan plat nomor kendaraan atau isi form secara manual.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        {/* Vehicle Scanner Button */}
                        <VehicleScanner onScanComplete={handleScanComplete} />

                        {/* Scan Result Message */}
                        {scanMessage && (
                            <Alert>
                                <AlertDescription>{scanMessage}</AlertDescription>
                            </Alert>
                        )}

                        {/* Plat Nomor */}
                        <Field>
                            <Label htmlFor="plat_nomor">Plat Nomor</Label>
                            <Input 
                                id="plat_nomor" 
                                name="plat_nomor" 
                                value={data.plat_nomor}
                                onChange={(e) => setData('plat_nomor', e.target.value.toUpperCase())}
                                placeholder="Contoh: B1234XYZ"
                                className={errors.plat_nomor ? 'border-destructive' : ''}
                                disabled={processing}
                                autoComplete="off"
                            />
                            {errors.plat_nomor && (
                                <p className="text-sm text-destructive mt-1">{errors.plat_nomor}</p>
                            )}
                        </Field>

                        <Field>
                            <Label htmlFor="jenis_kendaraan">Jenis Kendaraan</Label>
                            <Select
                                value={data.jenis_kendaraan}
                                onValueChange={(value) => setData('jenis_kendaraan', value)}
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
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
        </>
    )
}
