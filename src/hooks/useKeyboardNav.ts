import { useEffect } from 'react';
import { useLayoutStore } from '../store/layoutStore';
import { findNeighbor, type Direction } from '../lib/spatialNav';

const DIR_KEYS: Record<string, Direction> = { h: 'left', j: 'down', k: 'up', l: 'right' };

function isEditable(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (el as HTMLElement).isContentEditable
  );
}

function moveFocus(dir: Direction) {
  const s = useLayoutStore.getState();
  const grid = s.layouts[s.activeLayoutId].grid;
  if (grid.length === 0) return;
  if (!s.focusedWidgetId || !grid.some((g) => g.i === s.focusedWidgetId)) {
    s.setFocus(grid[0].i);
    return;
  }
  const next = findNeighbor(
    s.focusedWidgetId,
    grid.map(({ i, x, y, w, h }) => ({ i, x, y, w, h })),
    dir
  );
  if (next) s.setFocus(next);
}

function enterFocusedWidget() {
  const s = useLayoutStore.getState();
  if (!s.focusedWidgetId) return;
  const host = document.querySelector(`[data-widget-id="${s.focusedWidgetId}"]`);
  const target = host?.querySelector<HTMLElement>(
    'input, textarea, select, button:not(.widget-close):not(.widget-max), [tabindex]'
  );
  target?.focus();
}

export function useKeyboardNav() {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const s = useLayoutStore.getState();

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        s.setPaletteOpen(!s.paletteOpen);
        return;
      }
      if (s.paletteOpen) return; // palette owns all other keys

      if (e.ctrlKey && !e.metaKey && !e.altKey && DIR_KEYS[e.key]) {
        e.preventDefault();
        moveFocus(DIR_KEYS[e.key]);
        return;
      }

      const insert = isEditable(document.activeElement);
      if (insert) {
        if (e.key === 'Escape') (document.activeElement as HTMLElement).blur();
        return;
      }

      if (e.key === 'Escape') {
        if (s.maximizedWidgetId) s.toggleMaximize(s.maximizedWidgetId);
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (DIR_KEYS[e.key]) {
        e.preventDefault();
        moveFocus(DIR_KEYS[e.key]);
      } else if (e.key === 'x' && s.focusedWidgetId) {
        s.closeWidget(s.focusedWidgetId);
      } else if (e.key === 'Enter' || e.key === 'i') {
        const activeTag = document.activeElement?.tagName;
        if (activeTag === 'BUTTON' || activeTag === 'A' || activeTag === 'SELECT') return;
        e.preventDefault();
        enterFocusedWidget();
      } else if (e.key === '/') {
        e.preventDefault();
        s.setPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}
