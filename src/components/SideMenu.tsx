import { useState } from 'react';
import { TOOLS } from '../registry/tools';
import type { ToolCategory, ToolDefinition } from '../registry/types';
import { matchesQuery } from '../lib/searchTools';
import { useLayoutStore } from '../store/layoutStore';
import { useIsMobile } from '../hooks/useIsMobile';
import { Input } from './ui';

const CATEGORIES = ['text', 'coding', 'web', 'image', 'utility'] as const satisfies readonly ToolCategory[];
// Compile-time guard: fails to typecheck if a ToolCategory member is added
// without also adding it to CATEGORIES above.
type _Exhaustive = Exclude<ToolCategory, (typeof CATEGORIES)[number]> extends never ? true : never;
const _exhaustive: _Exhaustive = true;
void _exhaustive;

const label = (c: ToolCategory) => c.charAt(0).toUpperCase() + c.slice(1);

export function SideMenu() {
  const sidebarOpen = useLayoutStore((s) => s.sidebarOpen);
  const drawerOpen = useLayoutStore((s) => s.drawerOpen);
  const setDrawerOpen = useLayoutStore((s) => s.setDrawerOpen);
  const openWidget = useLayoutStore((s) => s.openWidget);
  const isMobile = useIsMobile();
  const [query, setQuery] = useState('');

  const open = isMobile ? drawerOpen : sidebarOpen;
  if (!open) return null;

  const pick = (tool: ToolDefinition) => {
    openWidget(tool.id, tool.defaultSize);
    if (isMobile) setDrawerOpen(false);
  };

  const groups = CATEGORIES.map((cat) => ({
    cat,
    tools: TOOLS.filter(
      (t) => t.category === cat && matchesQuery(`${t.title} ${t.keywords.join(' ')}`, query)
    ),
  })).filter((g) => g.tools.length > 0);

  const content = (
    <>
      <Input
        placeholder="Search tools…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {groups.map(({ cat, tools }) => (
        <div key={cat} className="sidemenu-group flex flex-col items-stretch">
          <div className="px-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
            {label(cat)}
          </div>
          {tools.map((t) => (
            <button
              key={t.id}
              className="sidemenu-item rounded-md px-2 py-1 text-left transition-colors hover:bg-accent/10 hover:text-accent truncate"
              onClick={() => pick(t)}
            >
              {t.title}
            </button>
          ))}
        </div>
      ))}
      {groups.length === 0 && <div className="p-2 text-muted">No tools match</div>}
    </>
  );

  if (isMobile) {
    return (
      <div
        className="sidemenu-backdrop fixed inset-0 z-90 bg-black/40 backdrop-blur-[2px]"
        onClick={() => setDrawerOpen(false)}
      >
        <nav
          className="sidemenu fixed bottom-0 left-0 top-0 flex w-64 flex-none flex-col gap-2 overflow-y-auto border-r border-border bg-panel p-2"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </nav>
      </div>
    );
  }
  return (
    <nav className="sidemenu flex w-56 flex-none flex-col gap-2 overflow-y-auto border-r border-border bg-panel p-2">
      {content}
    </nav>
  );
}
