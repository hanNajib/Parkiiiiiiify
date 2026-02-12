import { SidebarLayout } from '@/layout/SidebarLayout'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IconSearch, IconActivity, IconUser, IconShieldCheck } from '@tabler/icons-react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LogAktivitas, PaginatedData } from '@/types'
import DashboardHeader from '@/components/dashboard-header'
import StatCard from '@/components/StatCard'
import { router } from '@inertiajs/react'
import logAktivitasRoute from '@/routes/log-aktivitas'
import { Badge } from '@/components/ui/badge'

interface Props {
  logAktivitas: PaginatedData<LogAktivitas>
  stats: {
    total_logs: number,
    total_today: number,
    total_admin: number,
    total_user: number,
  }
  filter: {
    s?: string,
    role?: string,
    action?: string,
  }
}

export default function Index({ logAktivitas, stats, filter }: Props) {
  const [searchTerm, setSearchTerm] = useState(filter.s || '')
  const [roleFilter, setRoleFilter] = useState<string>(filter.role || 'all')
  const [actionFilter, setActionFilter] = useState<string>(filter.action || 'all')
  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'baru saja'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} minggu yang lalu`
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  
  const applyFilter = (extra = {}) => {
    router.get(
        logAktivitasRoute.index().url,
        {
            s: searchTerm,
            role: roleFilter !== 'all' ? roleFilter : undefined,
            action: actionFilter !== 'all' ? actionFilter : undefined,
            ...extra
        },
    )
  }

  const getActionBadgeVariant = (action: string) => {
    const actionMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      'create': 'default',
      'update': 'secondary',
      'delete': 'destructive',
      'login': 'outline',
      'logout': 'outline',
    }
    return actionMap[action.toLowerCase()] || 'outline'
  }

  const getRoleBadgeVariant = (role: string | null) => {
    if (!role) return 'outline'
    return role === 'admin' ? 'default' : 'secondary'
  }

  return (
    <SidebarLayout>
      <div className="space-y-6">
        <DashboardHeader title="Log Aktivitas" description="Monitor semua aktivitas pengguna dalam sistem">
        </DashboardHeader>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Total Aktivitas"
            value={stats.total_logs}
            icon={<IconActivity className="h-6 w-6" />}
          />
          <StatCard
            title="Aktivitas Hari Ini"
            value={stats.total_today}
            icon={<IconActivity className="h-6 w-6" />}
          />
          <StatCard
            title="Admin"
            value={stats.total_admin}
            icon={<IconShieldCheck className="h-6 w-6" />}
          />
          <StatCard
            title="User"
            value={stats.total_user}
            icon={<IconUser className="h-6 w-6" />}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari berdasarkan deskripsi atau IP address..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) =>{
                    setSearchTerm(e.target.value)
                    applyFilter({ s: e.target.value})
                }}
              />
            </div>

            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={(value) => {
                setRoleFilter(value)
                applyFilter({ role: value })
              }}>
                <SelectTrigger className='w-full max-w-48'>
                  <SelectValue placeholder="Filter Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Select value={actionFilter} onValueChange={(value) => {
                setActionFilter(value)
                applyFilter({ action: value })
              }}>
                <SelectTrigger className='w-full max-w-48'>
                  <SelectValue placeholder="Filter Aksi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Aksi</SelectLabel>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="login">Login</SelectItem>
                    <SelectItem value="logout">Logout</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Aksi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Deskripsi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Target
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    IP Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Waktu
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logAktivitas.data.length > 0 ? (
                  logAktivitas.data.map((log, index) => (
                    <tr
                      key={log.id}
                      className="group transition-colors hover:bg-muted/50"
                    >
                      <td className="px-6 py-4 text-sm">
                        {logAktivitas.from + index}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/10 text-primary text-xs font-semibold">
                            {log.user?.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="font-medium text-sm">
                              {log.user?.name || 'Unknown User'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {log.user?.email || '-'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getRoleBadgeVariant(log.role)}>
                          {log.role || 'N/A'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getActionBadgeVariant(log.action)}>
                          {log.action}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground max-w-xs truncate">
                        {log.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {log.target_type ? (
                          <div>
                            <div className="font-medium text-foreground">{log.target_type}</div>
                            <div className="text-xs">ID: {log.target_id}</div>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {log.ip_address || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <div className="flex flex-col">
                          <span>{formatTimeAgo(log.created_at)}</span>
                          <span className="text-xs text-muted-foreground/70">
                            {new Date(log.created_at).toLocaleString('id-ID', { 
                              day: '2-digit', 
                              month: '2-digit', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <IconActivity className="h-12 w-12 text-muted-foreground/50" />
                        <p className="text-sm font-medium text-muted-foreground">
                          Tidak ada log aktivitas
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Coba sesuaikan pencarian atau filter Anda
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {logAktivitas.data.length > 0 && (
            <div className="flex items-center justify-between border-t border-border bg-muted/50 px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Menampilkan <span className="font-medium">{logAktivitas.from}</span> - <span className="font-medium">{logAktivitas.to}</span> dari{' '}
                <span className="font-medium">{logAktivitas.total}</span> log aktivitas
              </p>
              <div className="flex gap-2">
                {logAktivitas.links.map((link, index) => {
                  if (link.label === '&laquo; Previous') {
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        disabled={!link.url}
                        onClick={() => link.url && router.get(link.url)}
                      >
                        Previous
                      </Button>
                    )
                  }
                  if (link.label === 'Next &raquo;') {
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        disabled={!link.url}
                        onClick={() => link.url && router.get(link.url)}
                      >
                        Next
                      </Button>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  )
}
