import { render, screen, fireEvent } from '@testing-library/react';
import { GridCanvas } from './GridCanvas';
import { useLayoutStore } from '../store/layoutStore';

class RO {
  observe() {}
  unobserve() {}
  disconnect() {}
}

let mobileMatches = false;
const realMatchMedia = window.matchMedia;

beforeAll(() => {
  (globalThis as { ResizeObserver?: unknown }).ResizeObserver ??= RO;
});

beforeEach(() => {
  window.matchMedia = ((q: string) => ({
    matches: q === '(max-width: 767px)' ? mobileMatches : false,
    media: q,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    onchange: null,
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;

  useLayoutStore.setState({
    layouts: {
      default: {
        name: 'Default',
        widgets: [
          { instanceId: 'a', toolId: 'word-counter' },
          { instanceId: 'b', toolId: 'base64' },
        ],
        grid: [
          { i: 'b', x: 4, y: 0, w: 4, h: 4 },
          { i: 'a', x: 0, y: 0, w: 4, h: 4 },
        ],
      },
    },
    activeLayoutId: 'default',
    focusedWidgetId: null,
    maximizedWidgetId: null,
  });
});

afterAll(() => {
  window.matchMedia = realMatchMedia;
});

describe('GridCanvas', () => {
  it('desktop: renders RGL items with se, e and s resize handles', () => {
    mobileMatches = false;
    const { container } = render(<GridCanvas />);
    expect(container.querySelectorAll('.react-grid-item')).toHaveLength(2);
    expect(container.querySelectorAll('.react-resizable-handle-se')).toHaveLength(2);
    expect(container.querySelectorAll('.react-resizable-handle-e')).toHaveLength(2);
    expect(container.querySelectorAll('.react-resizable-handle-s')).toHaveLength(2);
  });

  it('mobile: renders a stacked list ordered by grid position and leaves the grid untouched', () => {
    mobileMatches = true;
    const { container } = render(<GridCanvas />);
    expect(container.querySelectorAll('.react-grid-item')).toHaveLength(0);
    const items = [...container.querySelectorAll('.grid-stack-item [data-widget-id]')].map((el) =>
      el.getAttribute('data-widget-id')
    );
    expect(items).toEqual(['a', 'b']); // sorted y then x, not store order
    expect(useLayoutStore.getState().layouts['default'].grid).toHaveLength(2); // unchanged
  });

  it('marks the maximized widget item with widget-maximized', () => {
    mobileMatches = false;
    useLayoutStore.setState({ maximizedWidgetId: 'a' });
    const { container } = render(<GridCanvas />);
    const item = container.querySelector('[data-widget-id="a"]')!.closest('.react-grid-item')!;
    expect(item.className).toContain('widget-maximized');
  });

  it('renders the empty-state card when the layout has no widgets', () => {
    mobileMatches = false;
    useLayoutStore.setState({
      layouts: { default: { name: 'Default', widgets: [], grid: [] } },
      activeLayoutId: 'default',
      paletteOpen: false,
    });
    const { container } = render(<GridCanvas />);
    expect(container.querySelector('.empty-state')).toBeInTheDocument();
    expect(container.querySelector('.react-grid-item')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Browse tools (⌘K)'));
    expect(useLayoutStore.getState().paletteOpen).toBe(true);
  });

  it('does not render the empty-state when widgets exist', () => {
    mobileMatches = false;
    const { container } = render(<GridCanvas />);
    expect(container.querySelector('.empty-state')).not.toBeInTheDocument();
  });
});
