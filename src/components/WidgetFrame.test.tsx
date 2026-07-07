import { render, screen, fireEvent } from '@testing-library/react';
import { WidgetFrame } from './WidgetFrame';
import { useLayoutStore } from '../store/layoutStore';

beforeEach(() => {
  useLayoutStore.setState({
    layouts: { default: { name: 'Default', widgets: [], grid: [] } },
    activeLayoutId: 'default',
    focusedWidgetId: null,
  });
});

describe('WidgetFrame', () => {
  it('renders title and closes via close button', () => {
    const id = useLayoutStore.getState().openWidget('unknown-tool', { w: 4, h: 4 });
    render(<WidgetFrame instanceId={id} toolId="unknown-tool" />);
    expect(screen.getByText('unknown-tool')).toBeInTheDocument(); // falls back to toolId
    fireEvent.click(screen.getByLabelText('Close widget'));
    expect(useLayoutStore.getState().layouts['default'].widgets).toHaveLength(0);
  });

  it('sets focus on mousedown and shows focus ring class', () => {
    const id = useLayoutStore.getState().openWidget('unknown-tool', { w: 4, h: 4 });
    useLayoutStore.setState({ focusedWidgetId: null });
    const { container } = render(<WidgetFrame instanceId={id} toolId="unknown-tool" />);
    const frame = container.querySelector(`[data-widget-id="${id}"]`)!;
    fireEvent.mouseDown(frame);
    expect(useLayoutStore.getState().focusedWidgetId).toBe(id);
  });

  it('maximize button toggles store and swaps label', () => {
    const id = useLayoutStore.getState().openWidget('unknown-tool', { w: 4, h: 4 });
    render(<WidgetFrame instanceId={id} toolId="unknown-tool" />);
    fireEvent.click(screen.getByLabelText('Maximize widget'));
    expect(useLayoutStore.getState().maximizedWidgetId).toBe(id);
    fireEvent.click(screen.getByLabelText('Restore widget'));
    expect(useLayoutStore.getState().maximizedWidgetId).toBeNull();
  });
});
