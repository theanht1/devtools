import { Suspense } from 'react';
import { useLayoutStore } from '../store/layoutStore';
import { getTool } from '../registry/tools';
import { ErrorBoundary } from './ErrorBoundary';
import { IconButton, cx } from './ui';

export function WidgetFrame({ instanceId, toolId }: { instanceId: string; toolId: string }) {
  const focused = useLayoutStore((s) => s.focusedWidgetId === instanceId);
  const maximized = useLayoutStore((s) => s.maximizedWidgetId === instanceId);
  const closeWidget = useLayoutStore((s) => s.closeWidget);
  const setFocus = useLayoutStore((s) => s.setFocus);
  const toggleMaximize = useLayoutStore((s) => s.toggleMaximize);
  const tool = getTool(toolId);
  const Body = tool?.component;

  return (
    <div
      className={cx(
        'widget-frame flex h-full flex-col overflow-hidden rounded-md border border-border bg-panel shadow-sm',
        focused && 'widget-focused ring-2 ring-accent/60'
      )}
      data-widget-id={instanceId}
      onMouseDown={() => setFocus(instanceId)}
    >
      <div className="widget-titlebar flex cursor-grab select-none items-center justify-between gap-1 border-b border-border bg-black/[.03] px-2 py-1 dark:bg-white/[.04]">
        <span className="widget-title flex-1 min-w-0 truncate text-xs font-semibold">{tool?.title ?? toolId}</span>
        <div className="flex items-center gap-0.5">
          <IconButton
            className="widget-max h-5 w-5 text-[12px] opacity-60 hover:opacity-100"
            aria-label={maximized ? 'Restore widget' : 'Maximize widget'}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => toggleMaximize(instanceId)}
          >
            {maximized ? '🗗' : '⛶'}
          </IconButton>
          <IconButton
            className="widget-close h-5 w-5 text-[14px] opacity-60 hover:opacity-100"
            aria-label="Close widget"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => closeWidget(instanceId)}
          >
            ×
          </IconButton>
        </div>
      </div>
      <div className="widget-body flex min-h-0 flex-1 flex-col gap-1.5 overflow-auto p-2">
        <ErrorBoundary>
          {Body ? (
            <Suspense fallback={<div className="widget-loading text-muted">Loading…</div>}>
              <Body />
            </Suspense>
          ) : (
            <div className="widget-error text-danger">Unknown tool: {toolId}</div>
          )}
        </ErrorBoundary>
      </div>
    </div>
  );
}
