import { SidebarLayout } from '@/layout/SidebarLayout';
import DashboardHeader from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { router, usePage } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import tenants from '@/routes/tenants';
import { CheckCircle2, XCircle, Clock, Power, PowerOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tenant {
  id: number;
  name: string;
  slug: string;
  domain: string;
  status: 'pending' | 'approved' | 'rejected';
  is_active: boolean;
  institution_name: string | null;
  institution_address: string | null;
  requested_at: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  created_at: string;
  owner?: {
    id: number;
    name: string;
    email: string;
  } | null;
}

interface Props {
  tenants: Tenant[];
  filters: {
    status: string;
  };
}

export default function Index({ tenants: tenantsList, filters }: Props) {
  const stats = {
    all: tenantsList.length,
    pending: tenantsList.filter(t => t.status === 'pending').length,
    approved: tenantsList.filter(t => t.status === 'approved').length,
    rejected: tenantsList.filter(t => t.status === 'rejected').length,
  };

  const handleApprove = (tenantId: number) => {
    if (confirm('Yakin ingin menyetujui tenant ini?')) {
      router.post(tenants.approvals.approve(tenantId).url);
    }
  };

  const handleReject = (tenantId: number) => {
    if (confirm('Yakin ingin menolak tenant ini?')) {
      router.post(tenants.approvals.reject(tenantId).url);
    }
  };

  const handleToggleActive = (tenantId: number, isActive: boolean) => {
    const action = isActive ? 'nonaktifkan' : 'aktifkan';
    if (confirm(`Yakin ingin ${action} tenant ini?`)) {
      router.post(tenants.approvals.toggleActive(tenantId).url);
    }
  };

  const changeFilter = (status: string) => {
    router.get(tenants.approvals.index().url, { status }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const getStatusBadge = (tenant: Tenant) => {
    if (tenant.status === 'pending') {
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    }
    if (tenant.status === 'approved') {
      return (
        <Badge variant="default" className="gap-1 bg-green-500 hover:bg-green-600">
          <CheckCircle2 className="h-3 w-3" />
          Approved
        </Badge>
      );
    }
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" />
        Rejected
      </Badge>
    );
  };

  const getActiveBadge = (isActive: boolean) => {
    if (isActive) {
      return (
        <Badge variant="default" className="gap-1 bg-blue-500 hover:bg-blue-600">
          <Power className="h-3 w-3" />
          Active
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="gap-1">
        <PowerOff className="h-3 w-3" />
        Inactive
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <DashboardHeader
          title="Manajemen Tenant"
          description="Kelola semua tenant termasuk persetujuan dan status aktif"
        />

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { key: 'all', label: 'Semua', count: stats.all },
            { key: 'pending', label: 'Pending', count: stats.pending },
            { key: 'approved', label: 'Approved', count: stats.approved },
            { key: 'rejected', label: 'Rejected', count: stats.rejected },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => changeFilter(tab.key)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                filters.status === tab.key
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card hover:bg-accent'
              )}
            >
              {tab.label}
              <span className={cn(
                'rounded-full px-2 py-0.5 text-xs',
                filters.status === tab.key
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Instansi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Pemilik
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Domain
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tenantsList.length > 0 ? (
                  tenantsList.map((tenant) => (
                    <tr key={tenant.id} className="group transition-colors hover:bg-muted/50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-foreground">
                            {tenant.institution_name ?? tenant.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {tenant.institution_address ?? '-'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-foreground">
                            {tenant.owner?.name ?? '-'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {tenant.owner?.email ?? '-'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="font-mono text-foreground">{tenant.domain}</div>
                          <div className="text-xs text-muted-foreground">slug: {tenant.slug}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          {getStatusBadge(tenant)}
                          {tenant.status === 'approved' && getActiveBadge(tenant.is_active)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <div className="space-y-1">
                          {tenant.status === 'pending' && (
                            <div>
                              <span className="font-medium">Requested:</span> {formatDate(tenant.requested_at)}
                            </div>
                          )}
                          {tenant.status === 'approved' && (
                            <div>
                              <span className="font-medium">Approved:</span> {formatDate(tenant.approved_at)}
                            </div>
                          )}
                          {tenant.status === 'rejected' && (
                            <div>
                              <span className="font-medium">Rejected:</span> {formatDate(tenant.rejected_at)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {tenant.status === 'pending' && (
                            <>
                              <Button size="sm" onClick={() => handleApprove(tenant.id)}>
                                Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleReject(tenant.id)}>
                                Reject
                              </Button>
                            </>
                          )}
                          {tenant.status === 'approved' && (
                            <Button 
                              size="sm" 
                              variant={tenant.is_active ? "outline" : "default"}
                              onClick={() => handleToggleActive(tenant.id, tenant.is_active)}
                            >
                              {tenant.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-muted-foreground">
                      Tidak ada tenant {filters.status !== 'all' && `dengan status ${filters.status}`}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
