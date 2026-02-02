import { SidebarLayout } from '@/layout/SidebarLayout'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IconSearch, IconUser } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PaginatedData, User } from '@/types'
import DashboardHeader from '@/components/dashboard-header'
import StatCard from '@/components/StatCard'
import CreateModal from './CreateModal'
import { DropdownMenu, DropdownMenuLabel, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuGroup } from '@/components/ui/dropdown-menu'
import { EllipsisVertical, Trash } from 'lucide-react'
import EditModal from './EditModal'
import { ConfirmDelete } from '@/components/confirmModal'
import usersRoute from '@/routes/users'

interface Props {
  users: PaginatedData<User>
  filter: {
    s?: string,
    role?: string
  }
}

export default function Index({ users, filter }: Props) {
  const [searchTerm, setSearchTerm] = useState(filter.s || '')
  const [roleFilter, setRoleFilter] = useState(filter.role || 'all')


  const filteredUsers = users.data.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })



  return (
    <SidebarLayout>
      <div className="space-y-6">
        <DashboardHeader title="Manajemen User" description="Kelola dan monitor semua user di sistem">
          <CreateModal />
        </DashboardHeader>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari user berdasarkan nama atau email..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select onValueChange={(value) => setRoleFilter(value)}>
                <SelectTrigger className='w-full max-w-48'>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Role</SelectLabel>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="petugas">Petugas</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            title="Total User"
            value={users.data.length}
            icon={<IconUser className="h-6 w-6" />}
          />
          <StatCard
            title="Total Admin"
            value={users.data.filter(u => u.role === 'admin').length}
            icon={<IconUser className="h-6 w-6" />}
          />
          <StatCard
            title="Total Petugas"
            value={users.data.filter(u => u.role === 'petugas').length}
            icon={<IconUser className="h-6 w-6" />}
          />
          <StatCard
            title="Total Owner"
            value={users.data.filter(u => u.role === 'owner').length}
            icon={<IconUser className="h-6 w-6" />}
          />
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tanggal Dibuat
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="group transition-colors hover:bg-muted/50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-foreground">
                              {user.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                          user.role === 'Admin' && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                          user.role === 'Moderator' && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                          user.role === 'User' && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        )}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon' className='float-right cursor-pointer'>
                              <EllipsisVertical />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                              <EditModal user={user}></EditModal>
                              <ConfirmDelete deleteUrl={usersRoute.destroy(user.id).url}>
                                <DropdownMenuItem variant='destructive' onSelect={(e) => e.preventDefault()}>
                                  <Trash/>Hapus
                                </DropdownMenuItem>
                              </ConfirmDelete>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <IconSearch className="h-12 w-12 text-muted-foreground/50" />
                        <p className="text-sm font-medium text-muted-foreground">
                          No users found
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Try adjusting your search or filter criteria
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="flex items-center justify-between border-t border-border bg-muted/50 px-6 py-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{filteredUsers.length}</span> of{' '}
                <span className="font-medium">{users.data.length}</span> users
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  )
}
