import React from "react";
import { IconBrandTabler } from "@tabler/icons-react";
import { CarFront, FileText, LayoutDashboard, ParkingSquare, User } from "lucide-react";
import { dashboard } from "@/routes";
import users from "@/routes/users";
import kendaraan from "@/routes/kendaraan";
import areaParkir from "@/routes/area-parkir";
import tarifParkir from "@/routes/tarif-parkir";
import logAktivitas from "@/routes/log-aktivitas";

export interface SidebarLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  role: string[] | string;
  items?: SidebarLink[];
  searchable?: boolean;
}

export const links: SidebarLink[] = [
  {
    label: "Dashboard",
    href: dashboard().url,
    icon: (
      <LayoutDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
    role: '*',
  },
  {
    label: "Users",
    href: users.index().url,
    icon: (
      <User className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
    role: ['superadmin', 'admin'],
  },
  {
    label: "Data Parkir",
    href: users.index().url,
    icon: (
      <ParkingSquare className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
    role: ['superadmin', 'admin'],
    items: [
      {
        label: "Area Parkir",
        href: areaParkir.index().url,
        role: ['superadmin', 'admin'],
      },
      {
        label: "Tarif Parkir",
        href: tarifParkir.index().url,
        role: ['superadmin', 'admin'],
      },
    ]
  },
  {
    label: "Kendaraan",
    href: kendaraan.index().url,
    icon: (
      <CarFront className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
    role: ['superadmin', 'admin'],
  },
  {
    label: "Log Aktivitas",
    href: logAktivitas.index().url,
    icon: (
      <FileText className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
    role: ['superadmin'],
  },
];
