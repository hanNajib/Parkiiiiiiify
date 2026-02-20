import AuthLayout from '@/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface PendingApprovalProps {
  userRole?: string;
}

export default function PendingApproval({ userRole }: PendingApprovalProps) {
  return (
    <AuthLayout title="Menunggu Persetujuan">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-semibold">Pendaftaran sedang diproses</h1>
        <p className="text-sm text-muted-foreground">
          Akun dan instansi kamu sedang menunggu persetujuan superadmin. Kamu akan
          mendapat akses setelah tenant disetujui.
        </p>
        <div className="pt-2">
          <Link href="/">
            <Button>Ke Beranda</Button>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
