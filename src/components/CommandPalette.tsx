import { useEffect, useMemo, useRef, useState } from 'react';
import { TOOLS } from '../registry/tools';
import { useLayoutStore } from '../store/layoutStore';
import { matchesQuery } from '../lib/searchTools';
import { Input, cx } from './ui';

interface Command {
  id: string;
  label: string;
  hint: string;
  keywords: string;
  run: () => void;
}

export function CommandPalette() {
  const open = useLayoutStore((s) => s.paletteOpen);
  const layouts = useLayoutStore((s) => s.layouts);
  const activeLayoutId = useLayoutStore((s) => s.activeLayoutId);
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = useMemo<Command[]>(() => {
    const s = useLayoutStore.getState();
    const close = () => s.setPaletteOpen(false);
    const toolCmds = TOOLS.map((t) => ({
      id: `open-${t.id}`,
      label: `Open: ${t.title}`,
      hint: t.category,
      keywords: t.keywords.join(' '),
      run: () => {
        s.openWidget(t.id, t.defaultSize);
        close();
      },
    }));
    const layoutCmds: Command[] = [
      {
        id: 'save-layout',
        label: 'Save layout as…',
        hint: 'layout',
        keywords: 'save layout new',
        run: () => {
          const name = window.prompt('Layout name');
          if (name) s.saveLayoutAs(name);
          close();
        },
      },
      ...Object.entries(layouts).map(([id, l]) => ({
        id: `switch-${id}`,
        label: `Switch layout: ${l.name}`,
        hint: 'layout',
        keywords: 'switch layout',
        run: () => {
          s.switchLayout(id);
          close();
        },
      })),
      ...Object.entries(layouts).map(([id, l]) => ({
        id: `rename-${id}`,
        label: `Rename layout: ${l.name}`,
        hint: 'layout',
        keywords: 'rename layout',
        run: () => {
          const name = window.prompt('Layout name', l.name);
          if (name) s.renameLayout(id, name);
          close();
        },
      })),
      ...Object.entries(layouts)
        .filter(([id]) => id !== activeLayoutId)
        .map(([id, l]) => ({
          id: `delete-${id}`,
          label: `Delete layout: ${l.name}`,
          hint: 'layout',
          keywords: 'delete remove layout',
          run: () => {
            if (window.confirm(`Delete layout "${l.name}"?`)) s.deleteLayout(id);
            close();
          },
        })),
    ];
    return [...toolCmds, ...layoutCmds];
  }, [layouts, activeLayoutId]);

  const filtered = useMemo(
    () => (query ? commands.filter((c) => matchesQuery(`${c.label} ${c.keywords}`, query)) : commands),
    [commands, query]
  );

  useEffect(() => {
    if (open) {
      setQuery('');
      setSel(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => setSel(0), [query]);

  if (!open) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    const s = useLayoutStore.getState();
    // While the palette is open, palette bindings win: stop handled keys from
    // bubbling to the global window listener (useKeyboardNav). Cmd+K (metaKey)
    // is deliberately NOT handled here so the global toggle can still close us.
    const handled =
      !e.metaKey &&
      (e.key === 'Escape' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowUp' ||
        e.key === 'Enter' ||
        (e.ctrlKey && (e.key === 'j' || e.key === 'k')));
    if (!handled) return;
    e.stopPropagation();
    if (e.key === 'Escape') {
      s.setPaletteOpen(false);
    } else if (e.key === 'ArrowDown' || (e.ctrlKey && e.key === 'j')) {
      e.preventDefault();
      setSel((v) => Math.min(v + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp' || (e.ctrlKey && e.key === 'k')) {
      e.preventDefault();
      setSel((v) => Math.max(v - 1, 0));
    } else if (e.key === 'Enter' && filtered[sel]) {
      filtered[sel].run();
    }
  };

  return (
    <div
      className="palette-backdrop fixed inset-0 z-100 flex justify-center bg-black/30 pt-[12vh] backdrop-blur-sm"
      onClick={() => useLayoutStore.getState().setPaletteOpen(false)}
    >
      <div
        className="palette flex max-h-[60vh] w-[min(560px,92vw)] flex-col overflow-hidden rounded-lg border border-border bg-panel shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2">
          <Input
            ref={inputRef}
            className="w-full"
            placeholder="Search tools and commands…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
        <ul className="palette-list flex-1 overflow-y-auto px-1.5 pb-1.5">
          {filtered.map((c, i) => (
            <li
              key={c.id}
              className={cx(
                'flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5',
                i === sel && 'palette-selected bg-accent text-white dark:text-zinc-950'
              )}
              onMouseEnter={() => setSel(i)}
              onClick={c.run}
            >
              <span>{c.label}</span>
              <span className="palette-hint text-[11px] opacity-60">{c.hint}</span>
            </li>
          ))}
          {filtered.length === 0 && <li className="palette-empty text-muted">No matches</li>}
        </ul>
        <div className="palette-footer border-t border-border px-2.5 py-1.5 text-[11px] text-muted">
          ↑↓/^j ^k navigate · ⏎ run · esc close — grid: esc then h/j/k/l or arrows move · i enter · x close
        </div>
      </div>
    </div>
  );
}
