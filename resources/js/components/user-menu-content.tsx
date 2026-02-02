import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { logout } from "@/routes"
import { User } from "@/types"
import { Link } from "@inertiajs/react"
import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from "lucide-react"

export function UserMenuContent({ user }: { user: User }) {
    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user.name}</span>
                        <span className="truncate text-xs">{user.email}</span>
                    </div>
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem>
                    <Sparkles className="mr-2 size-4" />
                    Upgrade to Pro
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem>
                    <BadgeCheck className="mr-2 size-4" />
                    Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <CreditCard className="mr-2 size-4" />
                    Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Bell className="mr-2 size-4" />
                    Notifications
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href={logout()} method="post" as="button" className="w-full flex items-center cursor-default">
                    <LogOut className="mr-2 size-4" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    )
}
