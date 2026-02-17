import DashboardHeader from "@/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarLayout } from "@/layout/SidebarLayout";
import { AreaParkir, Tarif as TarifType } from "@/types";
import tarifParkir from "@/routes/tarif-parkir";
import { Link, useForm } from "@inertiajs/react";
import { IconLoader2, IconPlus, IconTrash } from "@tabler/icons-react";
import { ArrowLeft } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";

interface ProgressiveRule {
    jam_ke: number;
    harga: number;
}

export default function Edit({ areaParkir, tarif }: { areaParkir: AreaParkir; tarif: TarifType }) {
    const parseProgressiveRules = (value: unknown): ProgressiveRule[] => {
        if (Array.isArray(value)) return value as ProgressiveRule[];
        if (typeof value === "string") {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        }
        return [];
    };

    const [progressiveRules, setProgressiveRules] = useState<ProgressiveRule[]>(() =>
        parseProgressiveRules(tarif.progressive_rules as unknown)
    );

    const { data, setData, put, processing, errors } = useForm({
        harga_awal: tarif.harga_awal || 0,
        harga_lanjutan: tarif.harga_lanjutan || null,
        interval_menit: tarif.interval_menit || null,
        progressive_rules: tarif.progressive_rules || null,
        maksimal_per_hari: tarif.maksimal_per_hari || null,
        berlaku_dari: tarif.berlaku_dari || null,
        berlaku_sampai: tarif.berlaku_sampai || null,
        is_active: tarif.is_active,
    });

    const handleAddProgressiveRule = () => {
        setProgressiveRules([...progressiveRules, { jam_ke: progressiveRules.length + 1, harga: 0 }]);
    };

    const handleUpdateProgressiveRule = (index: number, field: "jam_ke" | "harga", value: number) => {
        const updated = [...progressiveRules];
        updated[index] = { ...updated[index], [field]: value };
        setProgressiveRules(updated);
    };

    const handleRemoveProgressiveRule = (index: number) => {
        setProgressiveRules(progressiveRules.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (tarif.rule_type !== "progressive") {
            if (data.progressive_rules !== null) {
                setData("progressive_rules", null);
            }
            return;
        }

        const normalizedRules = progressiveRules.map((rule, index) => ({
            ...rule,
            jam_ke: index + 1,
        }));

        setData("progressive_rules", normalizedRules.length > 0 ? normalizedRules : null);

        if (normalizedRules.length > 0) {
            const firstHarga = normalizedRules[0]?.harga ?? 0;
            if (data.harga_awal !== firstHarga) {
                setData("harga_awal", firstHarga);
            }
        }
    }, [tarif.rule_type, progressiveRules, data.progressive_rules, data.harga_awal, setData]);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(tarifParkir.update(tarif.id).url);
    };

    return (
        <SidebarLayout>
            <div className="space-y-6">
                <DashboardHeader
                    title={`Edit Tarif - ${areaParkir.nama}`}
                    description={`Perbarui tarif parkir untuk area ${areaParkir.nama}`}
                >
                    <div className="flex gap-2">
                        <Link href={tarifParkir.area(areaParkir.id).url}>
                            <Button variant="secondary">
                                <ArrowLeft />Kembali
                            </Button>
                        </Link>
                    </div>
                </DashboardHeader>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Field>
                            <Label htmlFor="jenis_kendaraan">Jenis Kendaraan</Label>
                            <Select name="jenis_kendaraan" value={tarif.jenis_kendaraan} disabled>
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
                            <p className="text-xs text-muted-foreground mt-1">Jenis kendaraan tidak dapat diubah</p>
                        </Field>

                        <Field>
                            <Label htmlFor="rule_type">Tipe Harga</Label>
                            <Select name="rule_type" value={tarif.rule_type} disabled>
                                <SelectTrigger className="w-full" disabled>
                                    <SelectValue placeholder="Tipe Harga" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="flat">Flat (sekali bayar)</SelectItem>
                                        <SelectItem value="interval">Interval (per blok waktu)</SelectItem>
                                        <SelectItem value="progressive">Progresif (bertahap per jam)</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground mt-1">
                                Tipe harga tidak dapat diubah.
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Flat: sekali bayar, Interval: per blok waktu, Progresif: bertahap per jam.
                            </p>
                        </Field>

                        <Field>
                            <Label htmlFor="harga_awal">Harga Awal</Label>
                            <Input
                                id="harga_awal"
                                name="harga_awal"
                                type="number"
                                value={data.harga_awal}
                                onChange={(e) => {
                                    const nextHarga = parseInt(e.target.value) || 0;
                                    setData("harga_awal", nextHarga);
                                    if (tarif.rule_type === "progressive" && progressiveRules.length > 0) {
                                        const updated = [...progressiveRules];
                                        updated[0] = { ...updated[0], harga: nextHarga };
                                        setProgressiveRules(updated);
                                    }
                                }}
                                placeholder="Masukkan harga awal"
                                className={errors.harga_awal ? "border-destructive" : ""}
                                disabled={processing}
                            />
                            {errors.harga_awal && <p className="text-sm text-destructive mt-1">{errors.harga_awal}</p>}
                        </Field>

                        {tarif.rule_type === "interval" && (
                            <>
                                <Field>
                                    <Label htmlFor="interval_menit">Interval (Menit)</Label>
                                    <Input
                                        id="interval_menit"
                                        name="interval_menit"
                                        type="number"
                                        value={data.interval_menit || ""}
                                        onChange={(e) => setData("interval_menit", parseInt(e.target.value) || null)}
                                        placeholder="Contoh: 60 untuk 1 jam"
                                        className={errors.interval_menit ? "border-destructive" : ""}
                                        disabled={processing}
                                    />
                                    {errors.interval_menit && (
                                        <p className="text-sm text-destructive mt-1">{errors.interval_menit}</p>
                                    )}
                                </Field>
                                <Field>
                                    <Label htmlFor="harga_lanjutan">Harga Lanjutan</Label>
                                    <Input
                                        id="harga_lanjutan"
                                        name="harga_lanjutan"
                                        type="number"
                                        value={data.harga_lanjutan || ""}
                                        onChange={(e) => setData("harga_lanjutan", parseInt(e.target.value) || null)}
                                        placeholder="Harga untuk interval berikutnya"
                                        className={errors.harga_lanjutan ? "border-destructive" : ""}
                                        disabled={processing}
                                    />
                                    {errors.harga_lanjutan && (
                                        <p className="text-sm text-destructive mt-1">{errors.harga_lanjutan}</p>
                                    )}
                                </Field>
                            </>
                        )}

                        {tarif.rule_type === "progressive" && (
                            <div className="space-y-3 border rounded-lg p-4 bg-muted/20">
                                <div className="flex justify-between items-center">
                                    <Label>Progressive Rules</Label>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={handleAddProgressiveRule}
                                        disabled={processing}
                                    >
                                        <IconPlus className="h-4 w-4 mr-1" />
                                        Tambah
                                    </Button>
                                </div>

                                {progressiveRules.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">Belum ada rules. Klik "Tambah" untuk menambahkan.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {progressiveRules.map((rule, index) => (
                                            <div key={index} className="flex gap-2 items-end">
                                                <div className="flex-1">
                                                    <Label className="text-xs">Jam Ke-{index + 1}</Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={index + 1}
                                                        readOnly
                                                        placeholder="Jam ke-"
                                                        disabled={processing}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <Label className="text-xs">Harga</Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={rule.harga}
                                                        onChange={(e) => {
                                                            const nextHarga = parseInt(e.target.value) || 0;
                                                            handleUpdateProgressiveRule(index, "harga", nextHarga);
                                                            if (index === 0) {
                                                                setData("harga_awal", nextHarga);
                                                            }
                                                        }}
                                                        placeholder="Harga"
                                                        disabled={processing}
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="destructive"
                                                    onClick={() => handleRemoveProgressiveRule(index)}
                                                    disabled={processing}
                                                >
                                                    <IconTrash className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.progressive_rules && (
                                    <p className="text-sm text-destructive">{errors.progressive_rules}</p>
                                )}
                            </div>
                        )}

                        <Field>
                            <Label htmlFor="maksimal_per_hari">Maksimal Per Hari (Opsional)</Label>
                            <Input
                                id="maksimal_per_hari"
                                name="maksimal_per_hari"
                                type="number"
                                value={data.maksimal_per_hari || ""}
                                onChange={(e) => setData("maksimal_per_hari", parseInt(e.target.value) || null)}
                                placeholder="Batas maksimal tarif per hari"
                                className={errors.maksimal_per_hari ? "border-destructive" : ""}
                                disabled={processing}
                            />
                            {errors.maksimal_per_hari && (
                                <p className="text-sm text-destructive mt-1">{errors.maksimal_per_hari}</p>
                            )}
                        </Field>

                        <div className="border-t pt-4">
                            <p className="text-sm font-medium mb-3">Waktu Berlaku (Opsional)</p>
                            <div className="space-y-4">
                                <Field>
                                    <Label htmlFor="berlaku_dari">Berlaku Dari</Label>
                                    <Input
                                        id="berlaku_dari"
                                        name="berlaku_dari"
                                        type="time"
                                        value={data.berlaku_dari || ""}
                                        onChange={(e) =>
                                            setData("berlaku_dari", e.target.value ? e.target.value.substring(0, 5) : null)
                                        }
                                        className={errors.berlaku_dari ? "border-destructive" : ""}
                                        disabled={processing}
                                    />
                                    {errors.berlaku_dari && (
                                        <p className="text-sm text-destructive mt-1">{errors.berlaku_dari}</p>
                                    )}
                                </Field>
                                <Field>
                                    <Label htmlFor="berlaku_sampai">Berlaku Sampai</Label>
                                    <Input
                                        id="berlaku_sampai"
                                        name="berlaku_sampai"
                                        type="time"
                                        value={data.berlaku_sampai || ""}
                                        onChange={(e) =>
                                            setData("berlaku_sampai", e.target.value ? e.target.value.substring(0, 5) : null)
                                        }
                                        className={errors.berlaku_sampai ? "border-destructive" : ""}
                                        disabled={processing}
                                    />
                                    {errors.berlaku_sampai && (
                                        <p className="text-sm text-destructive mt-1">{errors.berlaku_sampai}</p>
                                    )}
                                </Field>
                            </div>
                        </div>

                        <Field>
                            <Label htmlFor="is_active">Status</Label>
                            <Select
                                name="is_active"
                                value={data.is_active ? "aktif" : "nonaktif"}
                                onValueChange={(value) => setData("is_active", value === "aktif")}
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
                            {errors.is_active && <p className="text-sm text-destructive mt-1">{errors.is_active}</p>}
                        </Field>

                        <div className="flex items-center justify-end gap-2 pt-2">
                            <Link href={tarifParkir.area(areaParkir.id).url}>
                                <Button type="button" variant="outline" disabled={processing}>
                                    Batal
                                </Button>
                            </Link>
                            <Button type="submit" disabled={processing}>
                                {processing && <IconLoader2 className="h-4 w-4 animate-spin mr-2" />}
                                {processing ? "Menyimpan..." : "Simpan"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </SidebarLayout>
    );
}
