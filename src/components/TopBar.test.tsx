import { render, screen, fireEvent, act } from '@testing-library/react';
import { TopBar } from './TopBar';
import { useLayoutStore } from '../store/layoutStore';
import { vi } from 'vitest';

let mobileMatches = false;
const realMatchMedia = window.matchMedia;

beforeAll(() => {
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
});

afterAll(() => {
  window.matchMedia = realMatchMedia;
});

beforeEach(() => {
  mobileMatches = false;
  useLayoutStore.setState({
    layouts: { default: { name: 'Default', widgets: [], grid: [] } },
    activeLayoutId: 'default',
    focusedWidgetId: null,
    sidebarOpen: true,
    drawerOpen: false,
  });
});

describe('TopBar', () => {
  it('has no keyboard-shortcuts button anymore', () => {
    render(<TopBar />);
    expect(screen.queryByLabelText('Keyboard shortcuts')).not.toBeInTheDocument();
  });

  it('toggles the sidebar via ☰ on desktop', () => {
    render(<TopBar />);
    fireEvent.click(screen.getByLabelText('Toggle tool menu'));
    expect(useLayoutStore.getState().sidebarOpen).toBe(false);
    expect(useLayoutStore.getState().drawerOpen).toBe(false);
  });

  it('Clear all is disabled when empty, clears after confirm, keeps on cancel', () => {
    render(<TopBar />);
    expect((screen.getByText('Clear all') as HTMLButtonElement).disabled).toBe(true);

    act(() => {
      useLayoutStore.getState().openWidget('a', { w: 4, h: 4 });
    });
    expect((screen.getByText('Clear all') as HTMLButtonElement).disabled).toBe(false);

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    fireEvent.click(screen.getByText('Clear all'));
    expect(useLayoutStore.getState().layouts['default'].widgets).toHaveLength(1);

    confirmSpy.mockReturnValue(true);
    fireEvent.click(screen.getByText('Clear all'));
    expect(useLayoutStore.getState().layouts['default'].widgets).toHaveLength(0);
    confirmSpy.mockRestore();
  });

  describe('mobile', () => {
    beforeEach(() => {
      mobileMatches = true;
    });

    it('toggles drawerOpen via ☰, leaving sidebarOpen untouched', () => {
      render(<TopBar />);
      fireEvent.click(screen.getByLabelText('Toggle tool menu'));
      expect(useLayoutStore.getState().drawerOpen).toBe(true);
      expect(useLayoutStore.getState().sidebarOpen).toBe(true);

      fireEvent.click(screen.getByLabelText('Toggle tool menu'));
      expect(useLayoutStore.getState().drawerOpen).toBe(false);
      expect(useLayoutStore.getState().sidebarOpen).toBe(true);
    });
  });
});

describe('Delete layout confirmation', () => {
  it('keeps the layout when confirm is cancelled, deletes when accepted', () => {
    useLayoutStore.getState().saveLayoutAs('Work');
    const workId = useLayoutStore.getState().activeLayoutId;
    render(<TopBar />);

    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    fireEvent.click(screen.getByText('Delete'));
    expect(useLayoutStore.getState().layouts[workId]).toBeDefined();
    expect(confirmSpy).toHaveBeenCalledWith('Delete layout "Work"?');

    confirmSpy.mockReturnValue(true);
    fireEvent.click(screen.getByText('Delete'));
    expect(useLayoutStore.getState().layouts[workId]).toBeUndefined();
    confirmSpy.mockRestore();
  });
});
