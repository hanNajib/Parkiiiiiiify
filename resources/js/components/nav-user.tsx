import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import { motion } from 'motion/react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/useIsMobile';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const { open, animate } = useSidebar();
    const isMobile = useIsMobile();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div
                    className={cn(
                        "flex items-center justify-start gap-2 group/sidebar py-2 text-sidebar-foreground hover:text-sidebar-primary transition-colors cursor-pointer overflow-hidden",
                    )}
                >
                    <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                        <AvatarFallback className="rounded-lg">
                            {auth.user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <motion.div
                        animate={{
                            display: animate ? (open ? "flex" : "none") : "flex",
                            opacity: animate ? (open ? 1 : 0) : 1,
                        }}
                        className="flex-1 text-left text-sm leading-tight grid group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre"
                    >
                        <div className="flex-flex-col">
                        <span className="truncate font-semibold">{auth.user.name}</span>
                        <div className="truncate font-light opacity-75">{auth.user.role}</div>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{
                            display: animate ? (open ? "flex" : "none") : "flex",
                            opacity: animate ? (open ? 1 : 0) : 1,
                        }}
                    >
                        <ChevronsUpDown className="ml-auto size-4" />
                    </motion.div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                align="end"
                side={
                    isMobile
                        ? 'bottom'
                        : !open
                            ? 'left'
                            : 'bottom'
                }
            >
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}