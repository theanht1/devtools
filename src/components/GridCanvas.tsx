import GridLayout, { WidthProvider } from 'react-grid-layout/legacy';
import { useLayoutStore } from '../store/layoutStore';
import { getTool } from '../registry/tools';
import { WidgetFrame } from './WidgetFrame';
import { useIsMobile } from '../hooks/useIsMobile';
import { Button } from './ui';
import 'react-grid-layout/css/styles.css';

const RGL = WidthProvider(GridLayout);

export function GridCanvas() {
  const layout = useLayoutStore((s) => s.layouts[s.activeLayoutId]);
  const updateGrid = useLayoutStore((s) => s.updateGrid);
  const maximizedWidgetId = useLayoutStore((s) => s.maximizedWidgetId);
  const isMobile = useIsMobile();
  const setPaletteOpen = useLayoutStore((s) => s.setPaletteOpen);

  if (layout.widgets.length === 0) {
    return (
      <div className="empty-state flex flex-1 items-center justify-center overflow-y-auto p-4">
        <div className="flex max-w-xs flex-col items-center gap-2 rounded-lg border border-border bg-panel p-6 text-center shadow-sm">
          <span className="text-2xl" aria-hidden>⌨</span>
          <h2 className="text-sm font-semibold">No tools open</h2>
          <p className="text-muted">Open a tool from the sidebar, or press ⌘K to search.</p>
          <Button onClick={() => setPaletteOpen(true)}>Browse tools (⌘K)</Button>
        </div>
      </div>
    );
  }

  if (isMobile) {
    const pos = new Map(layout.grid.map((g) => [g.i, g]));
    const ordered = [...layout.widgets].sort((a, b) => {
      const ga = pos.get(a.instanceId);
      const gb = pos.get(b.instanceId);
      return (ga?.y ?? 0) - (gb?.y ?? 0) || (ga?.x ?? 0) - (gb?.x ?? 0);
    });
    return (
      <div className="grid-stack flex min-w-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
        {ordered.map((w) => (
          <div
            key={w.instanceId}
            className={`grid-stack-item h-[360px] flex-none${w.instanceId === maximizedWidgetId ? ' widget-maximized' : ''}`}
          >
            <WidgetFrame instanceId={w.instanceId} toolId={w.toolId} />
          </div>
        ))}
      </div>
    );
  }

  const gridWithMins = layout.grid.map((g) => {
    const tool = getTool(layout.widgets.find((w) => w.instanceId === g.i)?.toolId ?? '');
    return {
      ...g,
      minW: tool?.minSize?.w ?? 2,
      minH: tool?.minSize?.h ?? 3,
      static: g.i === maximizedWidgetId,
    };
  });

  return (
    <RGL
      className="grid-canvas flex-1 overflow-y-auto"
      cols={12}
      rowHeight={40}
      margin={[8, 8]}
      layout={gridWithMins}
      draggableHandle=".widget-titlebar"
      resizeHandles={['se', 'e', 's']}
      onLayoutChange={(next) => updateGrid(next.map(({ i, x, y, w, h }) => ({ i, x, y, w, h })))}
    >
      {layout.widgets.map((w) => (
        <div key={w.instanceId} className={w.instanceId === maximizedWidgetId ? 'widget-maximized' : undefined}>
          <WidgetFrame instanceId={w.instanceId} toolId={w.toolId} />
        </div>
      ))}
    </RGL>
  );
}
