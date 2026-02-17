import { Sidebar, SidebarOpen } from 'lucide-react';
import { create } from 'zustand' 
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system';

interface AreaParkir {
  id: number;
  nama: string;
  lokasi?: string;
}

interface AppStore {
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
    toggleSidebar: () => void

    theme: Theme
    setTheme: (theme: Theme) => void
    effectiveTheme: 'light' | 'dark'
    setEffectiveTheme: (theme: 'light' | 'dark') => void
    initializeTheme: () => void

    cachedAreaParkir: AreaParkir[]
    setCachedAreaParkir: (areas: AreaParkir[]) => void
}

export const useAppStore = create<AppStore>() (
    persist(
        (set, get) => ({
            sidebarOpen: false,
            setSidebarOpen: (open) => set({ sidebarOpen: open}),
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen})),

            theme: 'system',
            effectiveTheme: 'dark',
            setTheme: (theme) => {
                set({ theme })
                get().initializeTheme()
            },
            setEffectiveTheme: (theme) => set({ effectiveTheme: theme }),
            initializeTheme: () => {
                const { theme } = get()
                const root = window.document.documentElement

                root.classList.remove('light', 'dark')

                let resolvedTheme: 'light' | 'dark' = 'dark'

                if(theme === 'system') {
                    resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light'
                } else {
                    resolvedTheme = theme
                }

                root.classList.add(resolvedTheme)
                set({ effectiveTheme: resolvedTheme})
            },

            cachedAreaParkir: [],
            setCachedAreaParkir: (areas) => set({ cachedAreaParkir: areas }),
        }),
        {
            name: 'parkirbang',
            partialize: (state) => ({
                sidebarOpen: state.sidebarOpen,
                theme: state.theme,
                cachedAreaParkir: state.cachedAreaParkir,
            })
        }
    )
)