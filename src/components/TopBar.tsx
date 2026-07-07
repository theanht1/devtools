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
      <IconButton onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </IconButton>
    </header>
  );
}
