"use client";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Link, usePage } from "@inertiajs/react";
import { Tooltip, TooltipContent } from "./tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

interface Links {
  label: string;
  href: string;
  icon?: React.JSX.Element | React.ReactNode;
  items?: Links[];
  searchable?: boolean;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (
  props: React.ComponentProps<typeof motion.div> & { children?: React.ReactNode }
) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div> & { children?: React.ReactNode }) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "min-h-screen px-4 py-4 hidden md:flex md:flex-col bg-sidebar border-r border-sidebar-border shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "250px" : "70px") : "250px",
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div> & { children?: React.ReactNode }) => {
  const { open, setOpen } = useSidebar();
  return (
    <motion.div
      className="h-16 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-sidebar border-b border-sidebar-border w-full"
      {...props}
    >
      <div className="flex justify-end z-20 w-full">
        <IconMenu2
          className="text-sidebar-foreground cursor-pointer"
          onClick={() => setOpen(!open)}
        />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className={cn(
              "fixed h-full w-full inset-0 bg-background p-10 z-100 flex flex-col justify-between",
              className
            )}
          >
            <div
              className="absolute right-10 top-10 z-50 text-foreground cursor-pointer"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  const { url } = usePage();
  const isActive = url === link.href || url.startsWith(link.href + "/");
  
  const hasActiveSubItem = link.items?.some(
    (subLink) => url === subLink.href || url.startsWith(subLink.href + "/")
  );
  
  const [isOpen, setIsOpen] = useState(hasActiveSubItem || false);
  const [searchTerm, setSearchTerm] = useState("");

  React.useEffect(() => {
    if (hasActiveSubItem) {
      setIsOpen(true);
    }
  }, [hasActiveSubItem]);

  const filteredItems = React.useMemo(() => {
    if (!link.items || !searchTerm || !link.searchable) return link.items;
    
    return link.items.filter((item) =>
      item.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [link.items, searchTerm, link.searchable]);

  const motionProps = {
    animate: {
      display: animate ? (open ? "inline-block" : "none") : "inline-block",
      opacity: animate ? (open ? 1 : 0) : 1,
    },
  };

  const linkBaseClasses = cn(
    "flex items-center gap-2 group/sidebar py-2 px-2 rounded-md",
    "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
  );

  if (link.items && link.items.length > 0) {
    return (
      <div className={cn("overflow-hidden", className)} {...props}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(linkBaseClasses, "justify-between w-full")}
        >
          <div className="flex items-center gap-2">
            {link.icon}
            <motion.span
              {...motionProps}
              className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre p-0! m-0!"
            >
              {link.label}
            </motion.span>
          </div>
          <motion.span
            animate={{
              ...motionProps.animate,
              rotate: isOpen ? 180 : 0,
            }}
            className="text-neutral-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M6 9l6 6l6 -6" />
            </svg>
          </motion.span>
        </button>
        <AnimatePresence>
          {isOpen && open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-1 pl-6 mt-1"
            >
              {link.searchable && (
                <div className="mb-2 px-2">
                  <input
                    type="text"
                    placeholder="Cari area..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-2 py-1 text-xs border border-border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              )}
              {filteredItems && filteredItems.length > 0 ? (
                filteredItems.map((subLink, idx) => (
                  <SidebarLink key={idx} link={subLink} className="text-sm" />
                ))
              ) : (
                link.searchable && searchTerm && (
                  <div className="px-2 py-1 text-xs text-muted-foreground">
                    Tidak ada area ditemukan
                  </div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={link.href}
          className={cn(
            linkBaseClasses,
            "justify-start",
            isActive && "font-medium bg-sidebar-accent text-primary shadow-none",
            className
          )}
          {...props}
        >
          {link.icon}
          <motion.span
            {...motionProps}
            className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre p-0! m-0!"
          >
            {link.label}
          </motion.span>
        </Link>
      </TooltipTrigger>
      {!open && (
        <TooltipContent side="right">
          <p>{link.label}</p>
        </TooltipContent>
      )}
    </Tooltip>
  );
};

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("flex flex-col gap-2 w-full", className)}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("relative", className)} {...props} />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
    size?: "default" | "sm" | "lg";
  }
>(
  (
    { className, asChild = false, isActive = false, size = "default", ...props },
    ref
  ) => {
    const Comp = "button";
    return (
      <Comp
        ref={ref}
        data-active={isActive}
        className={cn(
          "flex w-full items-center gap-2 overflow-hidden rounded-md p-2",
          "text-left text-sm outline-none ring-sidebar-ring",
          "transition-[width,height,padding]",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          "focus-visible:ring-2",
          "active:bg-sidebar-accent active:text-sidebar-accent-foreground",
          "disabled:pointer-events-none disabled:opacity-50",
          "aria-disabled:pointer-events-none aria-disabled:opacity-50",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground",
          "data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground",
          "group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2!",
          "[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
          size === "default" && "h-8 text-sm",
          size === "sm" && "h-7 text-xs",
          size === "lg" && "h-12 text-sm group-data-[collapsible=icon]:p-0!",
          className
        )}
        {...props}
      />
    );
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";

export const SidebarTrigger = ({
  className,
  ...props
}: React.ComponentProps<"button">) => {
  const { open, setOpen } = useSidebar();
  return (
    <button
      className={cn(
        "h-7 w-7 text-sidebar-foreground rounded-md flex items-center justify-center transition-colors",
        "hover:bg-sidebar-accent hover:text-primary",
        className
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      <IconMenu2 className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
};