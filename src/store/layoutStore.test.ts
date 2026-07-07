import { initialLayouts, useLayoutStore } from './layoutStore';

const STORAGE_KEY = 'devtools-layout';

beforeEach(() => {
  useLayoutStore.setState({
    layouts: { default: { name: 'Default', widgets: [], grid: [] } },
    activeLayoutId: 'default',
    focusedWidgetId: null,
    paletteOpen: false,
    sidebarOpen: true,
    maximizedWidgetId: null,
  });
  localStorage.clear();
});

describe('layoutStore', () => {
  it('opens a widget into the active layout and focuses it', () => {
    const id = useLayoutStore.getState().openWidget('regex-tester', { w: 4, h: 6 });
    const s = useLayoutStore.getState();
    const layout = s.layouts[s.activeLayoutId];
    expect(layout.widgets).toEqual([{ instanceId: id, toolId: 'regex-tester' }]);
    expect(layout.grid).toEqual([{ i: id, x: 0, y: 0, w: 4, h: 6 }]);
    expect(s.focusedWidgetId).toBe(id);
  });

  it('places a second widget in the first free spot beside the first', () => {
    const st = useLayoutStore.getState();
    st.openWidget('a', { w: 4, h: 6 });
    const id2 = useLayoutStore.getState().openWidget('b', { w: 4, h: 4 });
    const grid = useLayoutStore.getState().layouts['default'].grid;
    expect(grid.find((g) => g.i === id2)).toMatchObject({ x: 4, y: 0 });
  });

  it('places a widget below when no row has room', () => {
    const st = useLayoutStore.getState();
    st.openWidget('wide', { w: 12, h: 5 });
    const id2 = useLayoutStore.getState().openWidget('b', { w: 4, h: 4 });
    const grid = useLayoutStore.getState().layouts['default'].grid;
    expect(grid.find((g) => g.i === id2)).toMatchObject({ x: 0, y: 5 });
  });

  it('closes a widget and clears focus', () => {
    const id = useLayoutStore.getState().openWidget('a', { w: 4, h: 6 });
    useLayoutStore.getState().closeWidget(id);
    const s = useLayoutStore.getState();
    expect(s.layouts['default'].widgets).toHaveLength(0);
    expect(s.layouts['default'].grid).toHaveLength(0);
    expect(s.focusedWidgetId).toBeNull();
  });

  it('saves layout as a new named layout and switches to it', () => {
    useLayoutStore.getState().openWidget('a', { w: 4, h: 6 });
    useLayoutStore.getState().saveLayoutAs('Work');
    const s = useLayoutStore.getState();
    expect(s.activeLayoutId).not.toBe('default');
    expect(s.layouts[s.activeLayoutId].name).toBe('Work');
    expect(s.layouts[s.activeLayoutId].widgets).toHaveLength(1);
  });

  it('switches and deletes layouts; deleting active falls back to another', () => {
    useLayoutStore.getState().saveLayoutAs('Work');
    const workId = useLayoutStore.getState().activeLayoutId;
    useLayoutStore.getState().switchLayout('default');
    expect(useLayoutStore.getState().activeLayoutId).toBe('default');
    useLayoutStore.getState().switchLayout(workId);
    useLayoutStore.getState().deleteLayout(workId);
    const s = useLayoutStore.getState();
    expect(s.layouts[workId]).toBeUndefined();
    expect(s.activeLayoutId).toBe('default');
  });

  it('cannot delete the last remaining layout', () => {
    useLayoutStore.getState().deleteLayout('default');
    expect(useLayoutStore.getState().layouts['default']).toBeDefined();
  });

  it('deleting a background (non-active) layout preserves maximizedWidgetId', () => {
    useLayoutStore.getState().saveLayoutAs('Work');
    const workId = useLayoutStore.getState().activeLayoutId;
    useLayoutStore.getState().switchLayout('default');
    const id = useLayoutStore.getState().openWidget('a', { w: 4, h: 6 });
    useLayoutStore.getState().toggleMaximize(id);
    expect(useLayoutStore.getState().maximizedWidgetId).toBe(id);

    useLayoutStore.getState().deleteLayout(workId);
    const s = useLayoutStore.getState();
    expect(s.layouts[workId]).toBeUndefined();
    expect(s.activeLayoutId).toBe('default');
    expect(s.maximizedWidgetId).toBe(id);
  });

  it('deleting the active layout still resets maximizedWidgetId', () => {
    useLayoutStore.getState().saveLayoutAs('Work');
    const workId = useLayoutStore.getState().activeLayoutId;
    const id = useLayoutStore.getState().openWidget('a', { w: 4, h: 6 });
    useLayoutStore.getState().toggleMaximize(id);
    expect(useLayoutStore.getState().maximizedWidgetId).toBe(id);

    useLayoutStore.getState().deleteLayout(workId);
    const s = useLayoutStore.getState();
    expect(s.activeLayoutId).toBe('default');
    expect(s.maximizedWidgetId).toBeNull();
  });

  it('updateGrid replaces grid of active layout', () => {
    const id = useLayoutStore.getState().openWidget('a', { w: 4, h: 6 });
    useLayoutStore.getState().updateGrid([{ i: id, x: 2, y: 1, w: 5, h: 7 }]);
    expect(useLayoutStore.getState().layouts['default'].grid[0]).toMatchObject({ x: 2, y: 1, w: 5, h: 7 });
  });

  it('renames a layout', () => {
    useLayoutStore.getState().renameLayout('default', 'My Layout');
    expect(useLayoutStore.getState().layouts['default'].name).toBe('My Layout');
  });

  it('renameLayout is a no-op for a missing id', () => {
    useLayoutStore.getState().renameLayout('nonexistent', 'New Name');
    expect(useLayoutStore.getState().layouts['nonexistent']).toBeUndefined();
    expect(useLayoutStore.getState().layouts['default'].name).toBe('Default');
  });

  it('renameLayout is a no-op for an empty name', () => {
    useLayoutStore.getState().renameLayout('default', '');
    expect(useLayoutStore.getState().layouts['default'].name).toBe('Default');
  });

  describe('clearWidgets', () => {
    it('empties only the active layout and clears focus', () => {
      const st = useLayoutStore.getState();
      st.openWidget('a', { w: 4, h: 4 });
      st.saveLayoutAs('Other'); // active is now Other with 1 widget
      useLayoutStore.getState().openWidget('b', { w: 4, h: 4 });
      useLayoutStore.getState().clearWidgets();
      const s = useLayoutStore.getState();
      expect(s.layouts[s.activeLayoutId].widgets).toHaveLength(0);
      expect(s.layouts[s.activeLayoutId].grid).toHaveLength(0);
      expect(s.focusedWidgetId).toBeNull();
      expect(s.layouts['default'].widgets).toHaveLength(1); // untouched
    });
  });

  describe('sidebarOpen', () => {
    it('defaults true and toggles', () => {
      expect(useLayoutStore.getState().sidebarOpen).toBe(true);
      useLayoutStore.getState().toggleSidebar();
      expect(useLayoutStore.getState().sidebarOpen).toBe(false);
      useLayoutStore.getState().setSidebarOpen(true);
      expect(useLayoutStore.getState().sidebarOpen).toBe(true);
    });

    it('hydrates to true from old persisted blobs without the field', async () => {
      localStorage.setItem(
        'devtools-layout',
        JSON.stringify({
          state: {
            layouts: { default: { name: 'Default', widgets: [], grid: [] } },
            activeLayoutId: 'default',
            theme: 'dark',
          },
          version: 1,
        })
      );
      await useLayoutStore.persist.rehydrate();
      expect(useLayoutStore.getState().sidebarOpen).toBe(true);
      expect(useLayoutStore.getState().theme).toBe('dark');
    });
  });
});

describe('maximize', () => {
  it('toggles and switches between widgets', () => {
    useLayoutStore.getState().toggleMaximize('a');
    expect(useLayoutStore.getState().maximizedWidgetId).toBe('a');
    useLayoutStore.getState().toggleMaximize('b');
    expect(useLayoutStore.getState().maximizedWidgetId).toBe('b');
    useLayoutStore.getState().toggleMaximize('b');
    expect(useLayoutStore.getState().maximizedWidgetId).toBeNull();
  });

  it('resets when the maximized widget is closed', () => {
    const id = useLayoutStore.getState().openWidget('a', { w: 4, h: 4 });
    useLayoutStore.getState().toggleMaximize(id);
    useLayoutStore.getState().closeWidget(id);
    expect(useLayoutStore.getState().maximizedWidgetId).toBeNull();
  });

  it('survives closing a different widget', () => {
    const id1 = useLayoutStore.getState().openWidget('a', { w: 4, h: 4 });
    const id2 = useLayoutStore.getState().openWidget('b', { w: 4, h: 4 });
    useLayoutStore.getState().toggleMaximize(id1);
    useLayoutStore.getState().closeWidget(id2);
    expect(useLayoutStore.getState().maximizedWidgetId).toBe(id1);
  });

  it('resets on switchLayout and clearWidgets', () => {
    useLayoutStore.getState().toggleMaximize('a');
    useLayoutStore.getState().saveLayoutAs('Other');
    expect(useLayoutStore.getState().maximizedWidgetId).toBeNull(); // saveAs switches
    useLayoutStore.getState().toggleMaximize('a');
    useLayoutStore.getState().clearWidgets();
    expect(useLayoutStore.getState().maximizedWidgetId).toBeNull();
  });
});

describe('layoutStore persistence', () => {
  it('hydrates a valid persisted blob (happy path)', () => {
    const persisted = {
      state: {
        layouts: {
          default: { name: 'Default', widgets: [], grid: [] },
          work: { name: 'Work', widgets: [{ instanceId: 'w1', toolId: 'base64' }], grid: [] },
        },
        activeLayoutId: 'work',
        theme: 'dark',
      },
      version: 1,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));

    useLayoutStore.persist.rehydrate();

    const s = useLayoutStore.getState();
    expect(s.activeLayoutId).toBe('work');
    expect(s.layouts.work.name).toBe('Work');
    expect(s.theme).toBe('dark');
  });

  it('falls back to defaults when persisted shape is corrupt (empty layouts)', () => {
    const persisted = {
      state: { layouts: {}, activeLayoutId: 'default' },
      version: 1,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));

    useLayoutStore.persist.rehydrate();

    const s = useLayoutStore.getState();
    expect(s.activeLayoutId).toBe('default');
    expect(s.layouts.default).toEqual(initialLayouts.default);
  });

  it('falls back to defaults when persisted shape points activeLayoutId at a missing layout', () => {
    const persisted = {
      state: {
        layouts: { default: { name: 'Default', widgets: [], grid: [] } },
        activeLayoutId: 'missing',
      },
      version: 1,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));

    useLayoutStore.persist.rehydrate();

    const s = useLayoutStore.getState();
    expect(s.activeLayoutId).toBe('default');
    expect(s.layouts.default).toEqual(initialLayouts.default);
  });

  it('falls back to defaults on garbage JSON', () => {
    localStorage.setItem(STORAGE_KEY, 'not json');

    useLayoutStore.persist.rehydrate();

    const s = useLayoutStore.getState();
    expect(s.activeLayoutId).toBe('default');
    expect(s.layouts.default).toEqual(initialLayouts.default);
  });
});
