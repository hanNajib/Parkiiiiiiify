import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconPlus, IconLoader2 } from "@tabler/icons-react";
import { useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import usersRoute from "@/routes/users";

export default function CreateModal() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'petugas',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        post(usersRoute.store().url, {
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
                    Tambah User
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Tambah User Baru</DialogTitle>
                        <DialogDescription>
                            Buat akun user baru dengan mengisi form di bawah ini.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <Field>
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input 
                                id="name" 
                                name="name" 
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Masukkan nama lengkap"
                                className={errors.name ? 'border-destructive' : ''}
                                disabled={processing}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive mt-1">{errors.name}</p>
                            )}
                        </Field>

                        <Field>
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                name="email" 
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="user@example.com"
                                className={errors.email ? 'border-destructive' : ''}
                                disabled={processing}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive mt-1">{errors.email}</p>
                            )}
                        </Field>

                        <Field>
                            <Label htmlFor="password">Password</Label>
                            <Input 
                                id="password" 
                                name="password" 
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Minimal 8 karakter"
                                className={errors.password ? 'border-destructive' : ''}
                                disabled={processing}
                            />
                            {errors.password && (
                                <p className="text-sm text-destructive mt-1">{errors.password}</p>
                            )}
                        </Field>

                        <Field>
                            <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                            <Input 
                                id="password_confirmation" 
                                name="password_confirmation" 
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Masukkan ulang password"
                                className={errors.password_confirmation ? 'border-destructive' : ''}
                                disabled={processing}
                            />
                            {errors.password_confirmation && (
                                <p className="text-sm text-destructive mt-1">{errors.password_confirmation}</p>
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