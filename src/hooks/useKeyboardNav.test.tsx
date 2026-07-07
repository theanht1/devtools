import { renderHook } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { useKeyboardNav } from './useKeyboardNav';
import { useLayoutStore } from '../store/layoutStore';

function setup(widgets: { id: string; x: number; y: number }[]) {
  useLayoutStore.setState({
    layouts: {
      default: {
        name: 'Default',
        widgets: widgets.map((w) => ({ instanceId: w.id, toolId: 't' })),
        grid: widgets.map((w) => ({ i: w.id, x: w.x, y: w.y, w: 4, h: 4 })),
      },
    },
    activeLayoutId: 'default',
    focusedWidgetId: widgets[0]?.id ?? null,
    paletteOpen: false,
  });
  return renderHook(() => useKeyboardNav());
}

afterEach(() => {
  useLayoutStore.setState({
    layouts: { default: { name: 'Default', widgets: [], grid: [] } },
    activeLayoutId: 'default',
    focusedWidgetId: null,
    paletteOpen: false,
  });
  document.body.innerHTML = '';
});

describe('useKeyboardNav', () => {
  it('l moves focus right in normal mode', () => {
    setup([{ id: 'a', x: 0, y: 0 }, { id: 'b', x: 4, y: 0 }]);
    fireEvent.keyDown(window, { key: 'l' });
    expect(useLayoutStore.getState().focusedWidgetId).toBe('b');
  });

  it('plain hjkl is ignored while typing (Esc first, then navigate)', () => {
    setup([{ id: 'a', x: 0, y: 0 }, { id: 'b', x: 4, y: 0 }]);
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    fireEvent.keyDown(window, { key: 'l' });
    expect(useLayoutStore.getState().focusedWidgetId).toBe('a');
    fireEvent.keyDown(window, { key: 'Escape' }); // blur -> normal mode
    fireEvent.keyDown(window, { key: 'l' });
    expect(useLayoutStore.getState().focusedWidgetId).toBe('b');
  });

  it('x closes the focused widget in normal mode', () => {
    setup([{ id: 'a', x: 0, y: 0 }]);
    fireEvent.keyDown(window, { key: 'x' });
    expect(useLayoutStore.getState().layouts['default'].widgets).toHaveLength(0);
  });

  it('Cmd+K toggles the palette; / opens it in normal mode', () => {
    setup([{ id: 'a', x: 0, y: 0 }]);
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(useLayoutStore.getState().paletteOpen).toBe(true);
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(useLayoutStore.getState().paletteOpen).toBe(false);
    fireEvent.keyDown(window, { key: '/' });
    expect(useLayoutStore.getState().paletteOpen).toBe(true);
  });

  it('does nothing (except cmd+k) while the palette is open', () => {
    setup([{ id: 'a', x: 0, y: 0 }, { id: 'b', x: 4, y: 0 }]);
    useLayoutStore.setState({ paletteOpen: true });
    fireEvent.keyDown(window, { key: 'l' });
    expect(useLayoutStore.getState().focusedWidgetId).toBe('a');
    fireEvent.keyDown(window, { key: 'x' });
    expect(useLayoutStore.getState().layouts['default'].widgets).toHaveLength(2);
  });

  it('Escape blurs an active input (insert -> normal)', () => {
    setup([{ id: 'a', x: 0, y: 0 }]);
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    expect(document.activeElement).toBe(input);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(document.activeElement).not.toBe(input);
  });

  it('Enter focuses first focusable element inside the focused widget', () => {
    setup([{ id: 'a', x: 0, y: 0 }]);
    const host = document.createElement('div');
    host.setAttribute('data-widget-id', 'a');
    const ta = document.createElement('textarea');
    host.appendChild(ta);
    document.body.appendChild(host);
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(document.activeElement).toBe(ta);
  });

  it('Enter does not preventDefault when a button has DOM focus, so native activation still fires', () => {
    setup([{ id: 'a', x: 0, y: 0 }]);
    const button = document.createElement('button');
    document.body.appendChild(button);
    button.focus();
    expect(document.activeElement).toBe(button);
    const ev = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    window.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(false);
  });

  it('Enter is still prevented (and hijacked) when no button is focused and a widget is focused', () => {
    setup([{ id: 'a', x: 0, y: 0 }]);
    const host = document.createElement('div');
    host.setAttribute('data-widget-id', 'a');
    const ta = document.createElement('textarea');
    host.appendChild(ta);
    document.body.appendChild(host);
    const ev = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    window.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
  });
});

describe('round-5 navigation changes', () => {
  it('arrow keys move focus in normal mode', () => {
    setup([{ id: 'a', x: 0, y: 0 }, { id: 'b', x: 4, y: 0 }]);
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(useLayoutStore.getState().focusedWidgetId).toBe('b');
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(useLayoutStore.getState().focusedWidgetId).toBe('a');
  });

  it('arrow keys are ignored while typing', () => {
    setup([{ id: 'a', x: 0, y: 0 }, { id: 'b', x: 4, y: 0 }]);
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(useLayoutStore.getState().focusedWidgetId).toBe('a');
  });

  it('Ctrl+l no longer navigates', () => {
    setup([{ id: 'a', x: 0, y: 0 }, { id: 'b', x: 4, y: 0 }]);
    fireEvent.keyDown(window, { key: 'l', ctrlKey: true });
    expect(useLayoutStore.getState().focusedWidgetId).toBe('a');
  });

  it('Escape closes the palette even when focus is outside the palette input', () => {
    setup([{ id: 'a', x: 0, y: 0 }]);
    useLayoutStore.setState({ paletteOpen: true });
    // focus is on body (e.g. user clicked the palette footer)
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(useLayoutStore.getState().paletteOpen).toBe(false);
  });
});
