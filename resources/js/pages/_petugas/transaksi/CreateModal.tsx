import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconPlus, IconLoader2 } from "@tabler/icons-react";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState, useMemo } from "react";
import transaksiRoute from "@/routes/transaksi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Kendaraan, Tarif } from "@/types";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateModalProps {
    areaParkirId: number;
    kendaraanList: Kendaraan[];
    tarifList: Tarif[];
}

export default function CreateModal({ areaParkirId, kendaraanList, tarifList }: CreateModalProps) {
    const [open, setOpen] = useState(false);
    const [searchKendaraan, setSearchKendaraan] = useState('');
    const [selectedKendaraan, setSelectedKendaraan] = useState<Kendaraan | null>(null);
    const [openKendaraan, setOpenKendaraan] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        kendaraan_id: '',
        tarif_id: '',
    });

    // Filter kendaraan based on search - client side filtering
    const filteredKendaraan = useMemo(() => {
        if (searchKendaraan.length < 2) return [];
        const search = searchKendaraan.toLowerCase();
        return kendaraanList.filter(
            k => k.plat_nomor.toLowerCase().includes(search) || 
                 k.pemilik.toLowerCase().includes(search)
        );
    }, [searchKendaraan, kendaraanList]);

    // Filter tarif based on selected kendaraan's jenis_kendaraan
    const filteredTarif = useMemo(() => {
        if (!selectedKendaraan) return [];
        return tarifList.filter(t => t.jenis_kendaraan === selectedKendaraan.jenis_kendaraan);
    }, [selectedKendaraan, tarifList]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(transaksiRoute.store({ areaParkir: areaParkirId }).url, {
            onSuccess: () => {
                setOpen(false);
                reset();
                setSelectedKendaraan(null);
                setSearchKendaraan('');
            }
        });
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            reset();
            setSelectedKendaraan(null);
            setSearchKendaraan('');
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Tambah Transaksi
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Tambah Transaksi Baru</DialogTitle>
                    <DialogDescription>
                        Pilih kendaraan dan tarif untuk memulai transaksi parkir
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        {/* Kendaraan Selection */}
                        <Field error={errors.kendaraan_id}>
                            <Label htmlFor="kendaraan">Kendaraan</Label>
                            <Popover open={openKendaraan} onOpenChange={setOpenKendaraan}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openKendaraan}
                                        className="w-full justify-between"
                                    >
                                        {selectedKendaraan
                                            ? `${selectedKendaraan.plat_nomor} - ${selectedKendaraan.pemilik}`
                                            : "Cari kendaraan..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[400px] p-0">
                                    <Command shouldFilter={false}>
                                        <CommandInput 
                                            placeholder="Cari plat nomor atau pemilik..." 
                                            value={searchKendaraan}
                                            onValueChange={setSearchKendaraan}
                                        />
                                        <CommandList>
                                            {filteredKendaraan.length === 0 && searchKendaraan.length >= 2 && (
                                                <CommandEmpty>Kendaraan tidak ditemukan.</CommandEmpty>
                                            )}
                                            {filteredKendaraan.length === 0 && searchKendaraan.length < 2 && (
                                                <CommandEmpty>Ketik minimal 2 karakter...</CommandEmpty>
                                            )}
                                            {filteredKendaraan.length > 0 && (
                                                <CommandGroup>
                                                    {filteredKendaraan.map((kendaraan) => (
                                                                <CommandItem
                                                                    key={kendaraan.id}
                                                                    value={kendaraan.id.toString()}
                                                                    onSelect={() => {
                                                                        setSelectedKendaraan(kendaraan);
                                                                        setData('kendaraan_id', kendaraan.id.toString());
                                                                        setOpenKendaraan(false);
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            selectedKendaraan?.id === kendaraan.id ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium">{kendaraan.plat_nomor}</span>
                                                                        <span className="text-xs text-muted-foreground">
                                                                            {kendaraan.pemilik} - {kendaraan.jenis_kendaraan}
                                                                        </span>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    )}
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </Field>

                        {/* Tarif Selection */}
                        {selectedKendaraan && (
                            <Field error={errors.tarif_id}>
                                <Label htmlFor="tarif">Tarif Parkir</Label>
                                <Select
                                    value={data.tarif_id}
                                    onValueChange={(value) => setData('tarif_id', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Pilih tarif parkir" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredTarif.length === 0 ? (
                                            <div className="p-2 text-sm text-muted-foreground">
                                                Tidak ada tarif tersedia
                                            </div>
                                        ) : (
                                            filteredTarif.map((tarif) => (
                                                <SelectItem key={tarif.id} value={tarif.id.toString()}>
                                                    {tarif.rule_type === 'flat' ? 'Tarif Flat' : 'Per Jam'} - Rp {tarif.price.toLocaleString('id-ID')}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </Field>
                        )}

                        {selectedKendaraan && (
                            <Alert>
                                <AlertDescription>
                                    <div className="text-sm">
                                        <p><strong>Plat Nomor:</strong> {selectedKendaraan.plat_nomor}</p>
                                        <p><strong>Jenis:</strong> {selectedKendaraan.jenis_kendaraan}</p>
                                        <p><strong>Pemilik:</strong> {selectedKendaraan.pemilik}</p>
                                        <p><strong>Warna:</strong> {selectedKendaraan.warna}</p>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing || !data.kendaraan_id || !data.tarif_id}>
                            {processing && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
