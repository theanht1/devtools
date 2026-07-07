import { useLayoutStore } from '../store/layoutStore';
import { useIsMobile } from '../hooks/useIsMobile';
import { Button, IconButton, Select } from './ui';

export function TopBar() {
  const layouts = useLayoutStore((s) => s.layouts);
  const activeLayoutId = useLayoutStore((s) => s.activeLayoutId);
  const widgetCount = useLayoutStore((s) => s.layouts[s.activeLayoutId].widgets.length);
  const {
    setPaletteOpen, switchLayout, saveLayoutAs, deleteLayout, renameLayout,
    toggleTheme, toggleSidebar, clearWidgets,
  } = useLayoutStore.getState();
  const theme = useLayoutStore((s) => s.theme);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    if (isMobile) {
      const { drawerOpen, setDrawerOpen } = useLayoutStore.getState();
      setDrawerOpen(!drawerOpen);
    } else {
      toggleSidebar();
    }
  };

  return (
    <header className="topbar relative z-[81] flex h-11 flex-wrap items-center gap-1.5 border-b border-border bg-panel px-2.5">
      <IconButton onClick={toggleMenu} aria-label="Toggle tool menu">☰</IconButton>
      <span className="px-1 text-[13px] font-semibold tracking-tight">DevTools</span>
      <Button onClick={() => setPaletteOpen(true)}>+ Add tool <kbd className="ml-1 rounded bg-black/5 px-1 text-[10px] dark:bg-white/10">⌘K</kbd></Button>
      <div className="flex-1" />
      <div className="flex items-center gap-1.5 border-r border-border pr-1.5 max-md:hidden">
        <label className="flex items-center gap-1.5 text-muted">
          Layout
          <Select value={activeLayoutId} onChange={(e) => switchLayout(e.target.value)}>
            {Object.entries(layouts).map(([id, l]) => (
              <option key={id} value={id}>{l.name}</option>
            ))}
          </Select>
        </label>
        <Button onClick={() => { const name = window.prompt('Layout name'); if (name) saveLayoutAs(name); }}>
          Save as…
        </Button>
        <Button onClick={() => {
          const current = layouts[activeLayoutId]?.name ?? '';
          const name = window.prompt('Layout name', current);
          if (name) renameLayout(activeLayoutId, name);
        }}>
          Rename…
        </Button>
        <Button
          onClick={() => {
            const name = layouts[activeLayoutId]?.name ?? '';
            if (window.confirm(`Delete layout "${name}"?`)) deleteLayout(activeLayoutId);
          }}
          disabled={Object.keys(layouts).length <= 1}
        >
          Delete
        </Button>
        <Button
          className="hover:border-danger hover:text-danger"
          onClick={() => { if (window.confirm('Remove all widgets from this layout?')) clearWidgets(); }}
          disabled={widgetCount === 0}
        >
          Clear all
        </Button>
      </div>
      <a
        href="https://github.com/theanht1/devtools/issues"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Report a bug"
        title="Report a bug"
        className="grid h-7 w-7 place-items-center rounded-md transition-colors hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden>
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
        </svg>
      </a>
      <IconButton onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </IconButton>
    </header>
  );
}
