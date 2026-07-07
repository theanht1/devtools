import { create } from 'zustand';
import { persist, type PersistStorage, type StorageValue } from 'zustand/middleware';
import type { LayoutItem } from 'react-grid-layout';
import { findFreePosition } from '../lib/gridPlacement';

export interface WidgetInstance {
  instanceId: string;
  toolId: string;
}

export interface SavedLayout {
  name: string;
  widgets: WidgetInstance[];
  grid: LayoutItem[];
}

export const initialLayouts: Record<string, SavedLayout> = {
  default: {
    name: 'Default',
    widgets: [
      { instanceId: 'seed-timestamp', toolId: 'timestamp-parser' },
      { instanceId: 'seed-json', toolId: 'json-converter' },
      { instanceId: 'seed-base64', toolId: 'base64' },
    ],
    grid: [
      { i: 'seed-timestamp', x: 0, y: 0, w: 5, h: 8 },
      { i: 'seed-json', x: 5, y: 0, w: 7, h: 10 },
      { i: 'seed-base64', x: 0, y: 8, w: 5, h: 7 },
    ],
  },
};

interface LayoutState {
  layouts: Record<string, SavedLayout>;
  activeLayoutId: string;
  focusedWidgetId: string | null;
  maximizedWidgetId: string | null;
  paletteOpen: boolean;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  drawerOpen: boolean;
  openWidget: (toolId: string, defaultSize: { w: number; h: number }) => string;
  closeWidget: (instanceId: string) => void;
  updateGrid: (grid: LayoutItem[]) => void;
  saveLayoutAs: (name: string) => void;
  switchLayout: (id: string) => void;
  deleteLayout: (id: string) => void;
  renameLayout: (id: string, name: string) => void;
  setFocus: (instanceId: string | null) => void;
  toggleMaximize: (instanceId: string) => void;
  setPaletteOpen: (open: boolean) => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setDrawerOpen: (open: boolean) => void;
  clearWidgets: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 10);

interface PersistedLayoutState {
  layouts: Record<string, SavedLayout>;
  activeLayoutId: string;
  theme: 'light' | 'dark';
  sidebarOpen?: boolean;
}

// localStorage.getItem can return a string that isn't valid JSON (e.g. a user
// manually edited devtools). The default zustand JSON storage lets JSON.parse
// throw, which aborts hydration before our `merge` fallback gets a chance to
// run. Swallow parse errors here so `merge` always sees a value it can vet.
const safeStorage: PersistStorage<PersistedLayoutState> = {
  getItem: (name) => {
    const raw = localStorage.getItem(name);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as StorageValue<PersistedLayoutState>;
    } catch {
      return null;
    }
  },
  setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
  removeItem: (name) => localStorage.removeItem(name),
};

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      layouts: structuredClone(initialLayouts),
      activeLayoutId: 'default',
      focusedWidgetId: null,
      maximizedWidgetId: null,
      paletteOpen: false,
      theme: 'light',
      sidebarOpen: true,
      drawerOpen: false,

      openWidget: (toolId, defaultSize) => {
        const instanceId = `${toolId}-${uid()}`;
        set((s) => {
          const layout = s.layouts[s.activeLayoutId];
          const { x, y } = findFreePosition(layout.grid, defaultSize.w, defaultSize.h);
          return {
            layouts: {
              ...s.layouts,
              [s.activeLayoutId]: {
                ...layout,
                widgets: [...layout.widgets, { instanceId, toolId }],
                grid: [...layout.grid, { i: instanceId, x, y, w: defaultSize.w, h: defaultSize.h }],
              },
            },
            focusedWidgetId: instanceId,
          };
        });
        return instanceId;
      },

      closeWidget: (instanceId) =>
        set((s) => {
          const layout = s.layouts[s.activeLayoutId];
          return {
            layouts: {
              ...s.layouts,
              [s.activeLayoutId]: {
                ...layout,
                widgets: layout.widgets.filter((w) => w.instanceId !== instanceId),
                grid: layout.grid.filter((g) => g.i !== instanceId),
              },
            },
            focusedWidgetId: s.focusedWidgetId === instanceId ? null : s.focusedWidgetId,
            maximizedWidgetId: s.maximizedWidgetId === instanceId ? null : s.maximizedWidgetId,
          };
        }),

      updateGrid: (grid) =>
        set((s) => ({
          layouts: {
            ...s.layouts,
            [s.activeLayoutId]: { ...s.layouts[s.activeLayoutId], grid },
          },
        })),

      saveLayoutAs: (name) => {
        const id = `layout-${uid()}`;
        set((s) => ({
          layouts: {
            ...s.layouts,
            [id]: { ...structuredClone(s.layouts[s.activeLayoutId]), name },
          },
          activeLayoutId: id,
          maximizedWidgetId: null,
        }));
      },

      switchLayout: (id) => {
        if (get().layouts[id]) set({ activeLayoutId: id, focusedWidgetId: null, maximizedWidgetId: null });
      },

      deleteLayout: (id) =>
        set((s) => {
          const remaining = Object.keys(s.layouts).filter((k) => k !== id);
          if (remaining.length === 0) return s; // never delete the last layout
          const layouts = { ...s.layouts };
          delete layouts[id];
          const isActive = s.activeLayoutId === id;
          return {
            layouts,
            activeLayoutId: isActive ? remaining[0] : s.activeLayoutId,
            maximizedWidgetId: isActive ? null : s.maximizedWidgetId,
          };
        }),

      renameLayout: (id, name) =>
        set((s) => {
          if (!s.layouts[id] || !name) return s;
          return {
            layouts: {
              ...s.layouts,
              [id]: { ...s.layouts[id], name },
            },
          };
        }),

      setFocus: (instanceId) => set({ focusedWidgetId: instanceId }),
      toggleMaximize: (instanceId) =>
        set((s) => ({ maximizedWidgetId: s.maximizedWidgetId === instanceId ? null : instanceId })),
      setPaletteOpen: (open) => set({ paletteOpen: open }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setDrawerOpen: (open) => set({ drawerOpen: open }),
      clearWidgets: () =>
        set((s) => ({
          layouts: {
            ...s.layouts,
            [s.activeLayoutId]: { ...s.layouts[s.activeLayoutId], widgets: [], grid: [] },
          },
          focusedWidgetId: null,
          maximizedWidgetId: null,
        })),
    }),
    {
      name: 'devtools-layout',
      version: 1,
      storage: safeStorage,
      partialize: (s) => ({
        layouts: s.layouts,
        activeLayoutId: s.activeLayoutId,
        theme: s.theme,
        sidebarOpen: s.sidebarOpen,
      }),
      merge: (persisted, current) => {
        const fallback = {
          ...current,
          layouts: structuredClone(initialLayouts),
          activeLayoutId: 'default',
          sidebarOpen: true,
        };

        if (!persisted || typeof persisted !== 'object') return fallback;
        const candidate = persisted as Partial<LayoutState>;

        const layouts = candidate.layouts;
        const isValidLayout = (l: unknown): l is SavedLayout =>
          !!l &&
          typeof l === 'object' &&
          typeof (l as SavedLayout).name === 'string' &&
          Array.isArray((l as SavedLayout).widgets) &&
          Array.isArray((l as SavedLayout).grid);

        const layoutsValid =
          !!layouts &&
          typeof layouts === 'object' &&
          Object.keys(layouts).length > 0 &&
          Object.values(layouts).every(isValidLayout);

        const activeLayoutId = candidate.activeLayoutId;
        const activeValid =
          layoutsValid &&
          typeof activeLayoutId === 'string' &&
          !!layouts &&
          Object.prototype.hasOwnProperty.call(layouts, activeLayoutId);

        if (!layoutsValid || !activeValid) return fallback;

        const theme = candidate.theme === 'light' || candidate.theme === 'dark' ? candidate.theme : current.theme;
        const sidebarOpen = typeof candidate.sidebarOpen === 'boolean' ? candidate.sidebarOpen : true;

        return {
          ...current,
          layouts: layouts as Record<string, SavedLayout>,
          activeLayoutId: activeLayoutId as string,
          theme,
          sidebarOpen,
        };
      },
    }
  )
);
