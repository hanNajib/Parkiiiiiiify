import React from "react";
import { CarFront, FileText, LayoutDashboard, ParkingSquare, User, Building2 } from "lucide-react";
import { dashboard } from "@/routes";
import users from "@/routes/users";
import kendaraan from "@/routes/kendaraan";
import areaParkir from "@/routes/area-parkir";
import tarifParkir from "@/routes/tarif-parkir";
import logAktivitas from "@/routes/log-aktivitas";
import tenants from "@/routes/tenants";

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
    role: ['admin', 'petugas', 'owner'],
  },
  {
    label: "Manajemen Tenant",
    href: tenants.approvals.index().url,
    icon: (
      <Building2 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
    role: ['superadmin'],
  },
  {
    label: "Users",
    href: users.index().url,
    icon: (
      <User className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
    role: ['superadmin', 'admin', 'owner'],
  },
  {
    label: "Data Parkir",
    href: users.index().url,
    icon: (
      <ParkingSquare className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
    role: ['admin'],
    items: [
      {
        label: "Area Parkir",
        href: areaParkir.index().url,
        role: ['admin'],
      },
      {
        label: "Tarif Parkir",
        href: tarifParkir.index().url,
        role: ['admin'],
      },
    ]
  },
  {
    label: "Kendaraan",
    href: kendaraan.index().url,
    icon: (
      <CarFront className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
    role: ['superadmin', 'admin', 'owner'],
  },
  {
    label: "Log Aktivitas",
    href: logAktivitas.index().url,
    icon: (
      <FileText className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
    ),
    role: ['admin', 'owner'],
  },
];
