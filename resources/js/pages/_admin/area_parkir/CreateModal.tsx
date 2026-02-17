import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconPlus, IconLoader2 } from "@tabler/icons-react";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import areaParkirRoute from "@/routes/area-parkir";

export default function CreateModal() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        nama: '',
        lokasi: '',
        kapasitas: 0,
        default_rule_type: 'choose',
        is_active: '1',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(areaParkirRoute.store().url, {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={'default'} className="group/btn cursor-pointer from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                    <IconPlus className="h-4 w-4" />
                    Tambah Area Parkir
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Tambah Area Parkir</DialogTitle>
                        <DialogDescription>
                            Buat area parkir baru dengan mengisi form di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <Field>
                            <Label htmlFor="nama">Nama</Label>
                            <Input 
                                id="nama" 
                                name="nama" 
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                placeholder="Masukkan nama"
                                className={errors.nama ? 'border-destructive' : ''}
                                disabled={processing}
                                autoComplete="areaparkir"
                            />
                            {errors.nama && (
                                <p className="text-sm text-destructive mt-1">{errors.nama}</p>
                            )}
                        </Field>

                        <Field>
                            <Label htmlFor="lokasi">Lokasi</Label>
                            <Input 
                                id="lokasi" 
                                name="lokasi" 
                                type="text"
                                value={data.lokasi}
                                onChange={(e) => setData('lokasi', e.target.value)}
                                placeholder="Masukkan lokasi"
                                className={errors.lokasi ? 'border-destructive' : ''}
                                disabled={processing}
                            />
                            {errors.lokasi && (
                                <p className="text-sm text-destructive mt-1">{errors.lokasi}</p>
                            )}
                        </Field>

                        <Field>
                            <Label htmlFor="kapasitas">Kapasitas</Label>
                            <Input 
                                id="kapasitas" 
                                name="kapasitas" 
                                type="number"
                                value={data.kapasitas}
                                onChange={(e) => setData('kapasitas', parseInt(e.target.value) || 0)}
                                placeholder="Masukkan kapasitas"
                                className={errors.kapasitas ? 'border-destructive' : ''}
                                disabled={processing}
                            />
                            {errors.kapasitas && (
                                <p className="text-sm text-destructive mt-1">{errors.kapasitas}</p>
                            )}
                        </Field>

                        <Field>
                            <Label htmlFor="default_rule_type">Aturan Tarif Utama</Label>
                            <Select
                                name="default_rule_type"
                                value={data.default_rule_type}
                                onValueChange={(value) => setData('default_rule_type', value)}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih aturan tarif" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="choose">Pilih Saat Transaksi</SelectItem>
                                    <SelectItem value="flat">Flat (sekali bayar)</SelectItem>
                                    <SelectItem value="interval">Interval (per blok waktu)</SelectItem>
                                    <SelectItem value="progressive">Progresif (bertahap per jam)</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground mt-1">
                                Menentukan aturan tarif default saat membuat transaksi baru.
                            </p>
                            {errors.default_rule_type && (
                                <p className="text-sm text-destructive mt-1">{errors.default_rule_type}</p>
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
    )
}