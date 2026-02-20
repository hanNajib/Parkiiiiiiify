import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconPlus, IconLoader2 } from "@tabler/icons-react";
import { useState } from "react";
import { toast } from "sonner";
import { Kendaraan } from "@/types";

interface RegisterVehicleModalProps {
    onVehicleRegistered: (kendaraan: Kendaraan) => void;
}

export default function RegisterVehicleModal({ onVehicleRegistered }: RegisterVehicleModalProps) {
    const [open, setOpen] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [formData, setFormData] = useState({
        plat_nomor: '',
        jenis_kendaraan: '',
        warna: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        try {
            const response = await fetch('/petugas/kendaraan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                toast.success('Kendaraan berhasil didaftarkan!');
                onVehicleRegistered(result.data);
                setOpen(false);
                setFormData({
                    plat_nomor: '',
                    jenis_kendaraan: '',
                    warna: '',
                });
                setErrors({});
            } else {
                if (result.errors) {
                    setErrors(result.errors);
                    const firstError = Object.values(result.errors)[0];
                    toast.error(Array.isArray(firstError) ? firstError[0] : String(firstError));
                } else {
                    toast.error(result.message || 'Gagal mendaftarkan kendaraan');
                }
            }
        } catch (error) {
            console.error('Error registering vehicle:', error);
            toast.error('Terjadi kesalahan saat mendaftarkan kendaraan');
        } finally {
            setProcessing(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setFormData({
                plat_nomor: '',
                jenis_kendaraan: '',
                warna: '',
            });
            setErrors({});
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" type="button" className="w-full">
                    <IconPlus className="mr-2 h-4 w-4" />
                    Daftar Kendaraan Baru
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>Daftar Kendaraan Baru</DialogTitle>
                    <DialogDescription>
                        Daftarkan kendaraan baru untuk memulai transaksi parkir
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        {/* Plat Nomor */}
                        <div>
                            <Label htmlFor="plat_nomor">Plat Nomor *</Label>
                            <Input
                                id="plat_nomor"
                                placeholder="Contoh: B 1234 ABC"
                                value={formData.plat_nomor}
                                onChange={(e) => setFormData({ ...formData, plat_nomor: e.target.value.toUpperCase() })}
                                className={errors.plat_nomor ? 'border-destructive' : ''}
                                disabled={processing}
                            />
                            {errors.plat_nomor && (
                                <p className="text-sm text-destructive mt-1">{errors.plat_nomor}</p>
                            )}
                        </div>

                        {/* Jenis Kendaraan */}
                        <div>
                            <Label htmlFor="jenis_kendaraan">Jenis Kendaraan *</Label>
                            <Select
                                value={formData.jenis_kendaraan}
                                onValueChange={(value) => setFormData({ ...formData, jenis_kendaraan: value })}
                                disabled={processing}
                            >
                                <SelectTrigger className={errors.jenis_kendaraan ? 'border-destructive' : ''}>
                                    <SelectValue placeholder="Pilih jenis kendaraan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="motor">Motor</SelectItem>
                                    <SelectItem value="mobil">Mobil</SelectItem>
                                    <SelectItem value="lainnya">Lainnya</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.jenis_kendaraan && (
                                <p className="text-sm text-destructive mt-1">{errors.jenis_kendaraan}</p>
                            )}
                        </div>


                        {/* Warna */}
                        <div>
                            <Label htmlFor="warna">Warna Kendaraan *</Label>
                            <Input
                                id="warna"
                                placeholder="Contoh: Hitam, Putih, Merah"
                                value={formData.warna}
                                onChange={(e) => setFormData({ ...formData, warna: e.target.value })}
                                className={errors.warna ? 'border-destructive' : ''}
                                disabled={processing}
                            />
                            {errors.warna && (
                                <p className="text-sm text-destructive mt-1">{errors.warna}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline" disabled={processing}>
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Daftar Kendaraan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
