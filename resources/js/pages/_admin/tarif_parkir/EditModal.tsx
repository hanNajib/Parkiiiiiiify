import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import tarifParkir from "@/routes/tarif-parkir";
import { Tarif } from "@/types";
import { useForm } from "@inertiajs/react";
import { IconLoader2 } from "@tabler/icons-react";
import { Edit } from "lucide-react";
import { FormEventHandler, useState } from "react";

export default function EditModal({ tarif }: { tarif: Tarif }) {
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing, errors, reset } = useForm({
        price: tarif.price,
        rule_type: tarif.rule_type,
        jenis_kendaraan: tarif.jenis_kendaraan,
        is_active: tarif.is_active,
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(tarifParkir.update(tarif.id).url, {
            onSuccess: () => {
                reset();
                setOpen(false);
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Tarif</DialogTitle>
                        <DialogDescription>
                            Edit tarif parkir dan simpan perubahan di bawah ini.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <Field>
                            <Label htmlFor="jenis_kendaraan">Jenis Kendaraan</Label>
                            <Select 
                                name="jenis_kendaraan" 
                                value={data.jenis_kendaraan} 
                                onValueChange={(value) => setData('jenis_kendaraan', value)}
                                disabled
                            >
                                <SelectTrigger className="w-full" disabled>
                                    <SelectValue placeholder="Jenis Kendaraan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="motor">Motor</SelectItem>
                                        <SelectItem value="mobil">Mobil</SelectItem>
                                        <SelectItem value="lainnya">Lainnya</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground mt-1">
                                Jenis kendaraan tidak dapat diubah
                            </p>
                        </Field>

                        <Field>
                            <Label htmlFor="rule_type">Tipe Harga</Label>
                            <Select 
                                name="rule_type" 
                                value={data.rule_type} 
                                onValueChange={(value) => setData('rule_type', value)}
                                disabled
                            >
                                <SelectTrigger className="w-full" disabled>
                                    <SelectValue placeholder="Tipe Harga" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="flat">Flat</SelectItem>
                                        <SelectItem value="per_jam">Per Jam</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground mt-1">
                                Tipe harga tidak dapat diubah
                            </p>
                        </Field>

                        <Field>
                            <Label htmlFor="price">Harga</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', parseInt(e.target.value) || 0)}
                                placeholder="Masukkan harga"
                                className={errors.price ? 'border-destructive' : ''}
                                disabled={processing}
                            />
                            {errors.price && (
                                <p className="text-sm text-destructive mt-1">{errors.price}</p>
                            )}
                        </Field>

                        <Field>
                            <Label htmlFor="is_active">Status</Label>
                            <Select 
                                name="is_active" 
                                value={data.is_active ? 'aktif' : 'nonaktif'} 
                                onValueChange={(value) => setData('is_active', value === 'aktif')}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="aktif">Aktif</SelectItem>
                                        <SelectItem value="nonaktif">Non-aktif</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.is_active && (
                                <p className="text-sm text-destructive mt-1">{errors.is_active}</p>
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
