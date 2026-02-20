import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import usersRoute from "@/routes/users";
import { User } from "@/types";
import { useForm, usePage } from "@inertiajs/react";
import { IconLoader2 } from "@tabler/icons-react";
import { Edit } from "lucide-react";
import { FormEventHandler, useState } from "react";

export default function EditModal({ user }: {user: User}) {
    const [open, setOpen] = useState(false);
    const { props } = usePage();
    const currentRole = (props as any)?.auth?.user?.role as string | undefined;
    const allowedRoles = currentRole === 'owner'
        ? ['admin', 'petugas']
        : currentRole === 'admin'
            ? ['petugas']
            : currentRole === 'superadmin'
                ? ['owner', 'admin', 'petugas']
                : [];

    const { data, setData, put, processing, errors, reset} = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        put(usersRoute.update(user.id).url, {
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
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Edit informasi user dan simpan perubahan di bawah ini.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <Field>
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input id="name" name="name" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Masukkan nama lengkap" className={errors.name ? 'border-destructive' : ''} disabled={processing} />
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
                                autoComplete="new-password"
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
                                autoComplete="new-password"
                            />
                            {errors.password_confirmation && (
                                <p className="text-sm text-destructive mt-1">{errors.password_confirmation}</p>
                            )}
                        </Field>

                        <Field>
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={data.role}
                                onValueChange={(value) => setData('role', value)}
                            >
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Pilih role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allowedRoles.map((role) => (
                                        <SelectItem key={role} value={role}>
                                            {role}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.role && (
                                <p className="text-sm text-destructive mt-1">{errors.role}</p>
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