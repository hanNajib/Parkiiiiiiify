import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconPlus, IconLoader2 } from "@tabler/icons-react";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState, useMemo } from "react";
import areaParkirRoute from "@/routes/area-parkir";
import tarifParkir from "@/routes/tarif-parkir";
import { Tarif } from "@/types";

export default function CreateModal({idArea, existingTarif} : {idArea: number, existingTarif: Tarif[]}) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        rule_type: '',
        price: 0,
        jenis_kendaraan: '',
        is_active: true,
        area_parkir_id: idArea
    });
    
    // Menghitung kombinasi yang sudah ada
    const existingCombinations = useMemo(() => {
        return existingTarif.map(t => `${t.jenis_kendaraan}-${t.rule_type}`);
    }, [existingTarif]);
    
    // Cek apakah kombinasi sudah digunakan
    const isDisabled = (jenisKendaraan: string, ruleType: string) => {
        return existingCombinations.includes(`${jenisKendaraan}-${ruleType}`);
    };
    
    // Cek apakah kombinasi saat ini sudah ada
    const currentCombinationExists = useMemo(() => {
        if (!data.jenis_kendaraan || !data.rule_type) return false;
        return existingCombinations.includes(`${data.jenis_kendaraan}-${data.rule_type}`);
    }, [data.jenis_kendaraan, data.rule_type, existingCombinations]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(tarifParkir.store().url, {
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
                    Tambah Tarif
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Tambah Tarif</DialogTitle>
                        <DialogDescription>
                            Lengkapi tarif parkir untuk semua jenis kendaraan
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <Field>
                            <Label htmlFor="price">Harga</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                value={data.price}
                                onChange={(e) => setData('price', parseInt(e.target.value) || 0)}
                                placeholder="Masukkan price"
                                className={errors.price ? 'border-destructive' : ''}
                                disabled={processing}
                            />
                            {errors.price && (
                                <p className="text-sm text-destructive mt-1">{errors.price}</p>
                            )}
                        </Field>
                        <Field>
                            <Label htmlFor="rule_type">Tipe Harga</Label>
                            <Select name="rule_type" value={data.rule_type} onValueChange={(e) => setData('rule_type', e)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Tipe Harga" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem 
                                            value="flat" 
                                            disabled={data.jenis_kendaraan ? isDisabled(data.jenis_kendaraan, 'flat') : false}
                                        >
                                            Flat {data.jenis_kendaraan && isDisabled(data.jenis_kendaraan, 'flat') && '(Sudah ada)'}
                                        </SelectItem>
                                        <SelectItem 
                                            value="per_jam" 
                                            disabled={data.jenis_kendaraan ? isDisabled(data.jenis_kendaraan, 'per_jam') : false}
                                        >
                                            Per Jam {data.jenis_kendaraan && isDisabled(data.jenis_kendaraan, 'per_jam') && '(Sudah ada)'}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.rule_type && (
                                <p className="text-sm text-destructive mt-1">{errors.rule_type}</p>
                            )}
                        </Field>
                        <Field>
                            <Label htmlFor="jenis_kendaraan">Jenis Kendaraan</Label>
                            <Select name="jenis_kendaraan" value={data.jenis_kendaraan} onValueChange={(value) => setData('jenis_kendaraan', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Jenis Kendaraan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem 
                                            value="motor" 
                                            disabled={data.rule_type ? isDisabled('motor', data.rule_type) : false}
                                        >
                                            Motor {data.rule_type && isDisabled('motor', data.rule_type) && '(Sudah ada)'}
                                        </SelectItem>
                                        <SelectItem 
                                            value="mobil" 
                                            disabled={data.rule_type ? isDisabled('mobil', data.rule_type) : false}
                                        >
                                            Mobil {data.rule_type && isDisabled('mobil', data.rule_type) && '(Sudah ada)'}
                                        </SelectItem>
                                        <SelectItem 
                                            value="lainnya" 
                                            disabled={data.rule_type ? isDisabled('lainnya', data.rule_type) : false}
                                        >
                                            Lainnya {data.rule_type && isDisabled('lainnya', data.rule_type) && '(Sudah ada)'}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {errors.jenis_kendaraan && (
                                <p className="text-sm text-destructive mt-1">{errors.jenis_kendaraan}</p>
                            )}
                        </Field>
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button" disabled={processing}>
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing || currentCombinationExists}>
                            {processing && <IconLoader2 className="h-4 w-4 animate-spin mr-2" />}
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                    {currentCombinationExists && (
                        <p className="text-sm text-destructive text-center mt-2">
                            Kombinasi jenis kendaraan dan tipe harga ini sudah ada
                        </p>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    )
}