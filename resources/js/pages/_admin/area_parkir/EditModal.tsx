import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import areaParkirRoute from "@/routes/area-parkir";
import { AreaParkir, User } from "@/types";
import { useForm } from "@inertiajs/react";
import { IconLoader2 } from "@tabler/icons-react";
import { Edit } from "lucide-react";
import { FormEventHandler, useState } from "react";


export default function EditModal({ area }: {area: AreaParkir}) {
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing, errors, reset} = useForm({
        nama: area.nama,
        lokasi: area.lokasi,
        kapasitas: area.kapasitas,
        is_active: area.is_active,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(areaParkirRoute.update(area.id).url, {
            onSuccess: () => {
                reset();
                setOpen(false);
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}><Edit/>Edit</DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Area Parkir</DialogTitle>
                        <DialogDescription>
                            Edit informasi area parkir dan simpan perubahan di bawah ini.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <Field>
                            <Label htmlFor="nama">Nama Lengkap</Label>
                            <Input id="nama" name="nama" value={data.nama} onChange={e => setData('nama', e.target.value)} placeholder="Masukkan nama lengkap" className={errors.nama ? 'border-destructive' : ''} disabled={processing} />
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
                                autoComplete="off"
                            />
                            {errors.kapasitas && (
                                <p className="text-sm text-destructive mt-1">{errors.kapasitas}</p>
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