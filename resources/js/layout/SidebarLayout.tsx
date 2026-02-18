import { FlashMessage } from '@/components/flash-message';
import { NavUser } from '@/components/nav-user';
import {
  SidebarBody,
  SidebarLink,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { PropsWithChildren, useMemo, useEffect, useRef } from 'react';
import { links } from '@/data/sidebar.config';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useAppStore } from '@/stores/useAppStores';
import { Logo } from '@/components/logo-icon';
import transaksi from '@/routes/transaksi';
import { Ticket } from 'lucide-react';
import type { SidebarLink as SidebarLinkType } from '@/data/sidebar.config';
import Lenis from 'lenis';

export const SidebarLayout = ({ children }: PropsWithChildren) => {
  const { sidebarOpen, toggleSidebar, cachedAreaParkir, setCachedAreaParkir } = useAppStore();
  const { auth, areaParkir } = usePage<SharedData>().props;
  const role = auth.user.role;
  const scrollRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Update cache when areaParkir changes
  useEffect(() => {
    if (areaParkir?.length) {
      setCachedAreaParkir(areaParkir);
    }
  }, [areaParkir, setCachedAreaParkir]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!scrollRef.current || !contentRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: contentRef.current,
      lerp: 0.08,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.9,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [sidebarOpen]);

  // Use cached area parkir if current areaParkir is from server but prefer server data
  const displayAreas = areaParkir?.length ? areaParkir : cachedAreaParkir;

  const transaksiLink: SidebarLinkType = useMemo(() => {
    const areaItems = displayAreas?.length ? displayAreas.map((area) => ({
      label: area.nama,
      href: transaksi.index({ areaParkir: area.id }).url,
      role: ['petugas'] as string[],
    })) : [];

    // Add "Lihat Semua Area" at the top
    const items = [
      {
        label: "Lihat Semua Area",
        href: transaksi.selectArea().url,
        role: ['petugas'] as string[],
      },
      ...areaItems,
    ];
    
    return {
      label: "Transaksi",
      href: transaksi.selectArea().url,
      icon: (
        <Ticket className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      role: ['petugas'] as string[],
      items: items.length > 0 ? items : undefined,
      searchable: true,
    };
  }, [displayAreas]);

  const allLinks = [...links, transaksiLink];

  const filteredLinks = allLinks.filter((link) => {
    if (link.role === '*') return true;
    if (Array.isArray(link.role)) return link.role.includes(role);
    return link.role === role;
  });

  return (
    <SidebarProvider animate={true} open={sidebarOpen} setOpen={toggleSidebar}>
      <FlashMessage />
      <div className="flex w-full h-screen flex-1 flex-col overflow-hidden md:flex-row bg-muted/40">
        <SidebarBody className="justify-between gap-10" initial={false}>
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <div
              className={cn(
                'flex w-full items-center mb-8',
                sidebarOpen ? 'justify-between' : 'justify-center'
              )}
            >
              {sidebarOpen ? (
                <>
                  <Logo />
                  <SidebarTrigger className="hidden md:flex" />
                </>
              ) : (
                <SidebarTrigger className="hidden md:flex" />
              )}
            </div>

            <nav className="flex flex-col gap-1">
              {filteredLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </nav>
          </div>

          <div className="mt-auto">
            <NavUser />
          </div>
        </SidebarBody>

        <div className="flex flex-1 overflow-hidden">
          <main ref={scrollRef} className="flex p-7 h-full w-full flex-1 flex-col gap-2 overflow-y-auto rounded-tl-2xl border border-border bg-background shadow-sm md:p-10">
            <div ref={contentRef} className="min-h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};