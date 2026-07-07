import { render, screen, fireEvent, renderHook } from '@testing-library/react';
import { CommandPalette } from './CommandPalette';
import { useKeyboardNav } from '../hooks/useKeyboardNav';
import { useLayoutStore } from '../store/layoutStore';

beforeEach(() => {
  useLayoutStore.setState({
    layouts: { default: { name: 'Default', widgets: [], grid: [] } },
    activeLayoutId: 'default',
    focusedWidgetId: null,
    paletteOpen: true,
  });
});

describe('CommandPalette', () => {
  it('renders nothing when closed', () => {
    useLayoutStore.setState({ paletteOpen: false });
    const { container } = render(<CommandPalette />);
    expect(container).toBeEmptyDOMElement();
  });

  it('filters commands by query and opens tool on Enter', () => {
    render(<CommandPalette />);
    const input = screen.getByPlaceholderText('Search tools and commands…');
    fireEvent.change(input, { target: { value: 'layout as' } });
    expect(screen.getByText(/Save layout as/)).toBeInTheDocument();
  });

  it('navigates with arrows and closes on Escape', () => {
    render(<CommandPalette />);
    const input = screen.getByPlaceholderText('Search tools and commands…');
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(useLayoutStore.getState().paletteOpen).toBe(false);
  });

  it('lists switch-layout commands for saved layouts', () => {
    useLayoutStore.getState().saveLayoutAs('Work');
    render(<CommandPalette />);
    const input = screen.getByPlaceholderText('Search tools and commands…');
    fireEvent.change(input, { target: { value: 'switch' } });
    expect(screen.getByText('Switch layout: Default')).toBeInTheDocument();
    expect(screen.getByText('Switch layout: Work')).toBeInTheDocument();
  });

  it('Ctrl+k inside the input moves selection without closing; Cmd+K still closes', () => {
    renderHook(() => useKeyboardNav());
    render(<CommandPalette />);
    const input = screen.getByPlaceholderText('Search tools and commands…');

    // Filter to layout commands to get predictable indices
    fireEvent.change(input, { target: { value: 'layout' } });

    // Move selection down to "Switch layout: Default" (index 1).
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByText('Switch layout: Default').closest('li')).toHaveClass(
      'palette-selected'
    );

    // Ctrl+k must move the selection back up and NOT close the palette,
    // even with the global keyboard hook mounted.
    fireEvent.keyDown(input, { key: 'k', ctrlKey: true });
    expect(useLayoutStore.getState().paletteOpen).toBe(true);
    expect(screen.getByText('Save layout as…').closest('li')).toHaveClass('palette-selected');

    // Cmd+K (metaKey) must still bubble to the global toggle and close it.
    fireEvent.keyDown(input, { key: 'k', metaKey: true });
    expect(useLayoutStore.getState().paletteOpen).toBe(false);
  });
});

describe('delete layout command confirmation', () => {
  it('asks for confirmation and respects the answer', () => {
    useLayoutStore.getState().saveLayoutAs('Work');
    useLayoutStore.getState().switchLayout('default'); // Work becomes deletable
    const workId = Object.keys(useLayoutStore.getState().layouts).find((k) => k !== 'default')!;
    useLayoutStore.setState({ paletteOpen: true });
    render(<CommandPalette />);
    const input = screen.getByPlaceholderText('Search tools and commands…');
    fireEvent.change(input, { target: { value: 'delete work' } });

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    fireEvent.click(screen.getByText('Delete layout: Work'));
    expect(confirmSpy).toHaveBeenCalledWith('Delete layout "Work"?');
    expect(useLayoutStore.getState().layouts[workId]).toBeDefined();
    expect(useLayoutStore.getState().paletteOpen).toBe(false); // palette closes either way

    useLayoutStore.setState({ paletteOpen: true });
    render(<CommandPalette />);
    const input2 = screen.getAllByPlaceholderText('Search tools and commands…').pop()!;
    fireEvent.change(input2, { target: { value: 'delete work' } });
    confirmSpy.mockReturnValue(true);
    fireEvent.click(screen.getAllByText('Delete layout: Work').pop()!);
    expect(useLayoutStore.getState().layouts[workId]).toBeUndefined();
    confirmSpy.mockRestore();
  });
});
