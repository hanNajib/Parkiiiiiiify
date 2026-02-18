import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { IconPlus, IconLoader2 } from "@tabler/icons-react";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState, useMemo } from "react";
import transaksiRoute from "@/routes/transaksi";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Kendaraan, AreaParkir } from "@/types";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import RegisterVehicleModal from "./RegisterVehicleModal";

interface CreateModalProps {
    areaParkir: AreaParkir;
    kendaraanList: Kendaraan[];
}

export default function CreateModal({ areaParkir, kendaraanList: initialKendaraanList }: CreateModalProps) {
    const [open, setOpen] = useState(false);
    const [searchKendaraan, setSearchKendaraan] = useState('');
    const [selectedKendaraan, setSelectedKendaraan] = useState<Kendaraan | null>(null);
    const [openKendaraan, setOpenKendaraan] = useState(false);
    const [kendaraanList, setKendaraanList] = useState<Kendaraan[]>(initialKendaraanList);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        kendaraan_id: '',
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

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(transaksiRoute.store({ areaParkir: areaParkir.id }).url, {
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

    const handleVehicleRegistered = (newKendaraan: Kendaraan) => {
        // Add to list and auto-select
        setKendaraanList(prev => [newKendaraan, ...prev]);
        setSelectedKendaraan(newKendaraan);
        setData('kendaraan_id', newKendaraan.id.toString());
        setSearchKendaraan(''); // Clear search
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <IconPlus className="mr-2 h-4 w-4" />
                    Tambah Transaksi
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>Tambah Transaksi Baru</DialogTitle>
                    <DialogDescription>
                        Pilih kendaraan untuk memulai transaksi. Tarif akan dipilih otomatis sesuai jenis kendaraan dan pengaturan area.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        {/* Kendaraan Selection */}
                        <div>
                            <Label htmlFor="kendaraan">Kendaraan</Label>
                            <Popover open={openKendaraan} onOpenChange={setOpenKendaraan}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={openKendaraan}
                                        className={cn("w-full justify-between", errors.kendaraan_id && "border-destructive")}
                                    >
                                        {selectedKendaraan
                                            ? `${selectedKendaraan.plat_nomor} - ${selectedKendaraan.pemilik}`
                                            : "Cari kendaraan..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-100 p-0">
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
                            {errors.kendaraan_id && (
                                <p className="text-sm text-destructive mt-1">{errors.kendaraan_id}</p>
                            )}
                        </div>

                        {/* Register New Vehicle */}
                        <RegisterVehicleModal onVehicleRegistered={handleVehicleRegistered} />

                        {/* Tarif Auto-Select Info */}
                        {selectedKendaraan && (
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertDescription>
                                    <div className="text-sm space-y-1">
                                        <p className="font-medium">Informasi Kendaraan:</p>
                                        <p><strong>Plat Nomor:</strong> {selectedKendaraan.plat_nomor}</p>
                                        <p><strong>Jenis:</strong> {selectedKendaraan.jenis_kendaraan}</p>
                                        <p><strong>Pemilik:</strong> {selectedKendaraan.pemilik}</p>
                                        <p><strong>Warna:</strong> {selectedKendaraan.warna}</p>
                                        <div className="mt-2 pt-2 border-t">
                                            <p className="text-xs text-muted-foreground">
                                                Tarif akan dipilih otomatis berdasarkan jenis kendaraan dan pengaturan area parkir.
                                            </p>
                                        </div>
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
                        <Button type="submit" disabled={processing || !data.kendaraan_id}>
                            {processing && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Simpan
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
