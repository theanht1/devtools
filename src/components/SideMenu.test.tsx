import { render, screen, fireEvent } from '@testing-library/react';
import { SideMenu } from './SideMenu';
import { useLayoutStore } from '../store/layoutStore';

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

describe('SideMenu', () => {
  it('renders category groups with tools', () => {
    render(<SideMenu />);
    expect(screen.getByText('Text')).toBeInTheDocument();
    expect(screen.getByText('Utility')).toBeInTheDocument();
    expect(screen.getByText('Regex Tester')).toBeInTheDocument();
  });

  it('filters tools by search and hides empty groups', () => {
    render(<SideMenu />);
    fireEvent.change(screen.getByPlaceholderText('Search tools…'), { target: { value: 'regex' } });
    expect(screen.getByText('Regex Tester')).toBeInTheDocument();
    expect(screen.queryByText('Utility')).not.toBeInTheDocument();
  });

  it('shows empty state when nothing matches', () => {
    render(<SideMenu />);
    fireEvent.change(screen.getByPlaceholderText('Search tools…'), { target: { value: 'zzzz' } });
    expect(screen.getByText('No tools match')).toBeInTheDocument();
  });

  it('opens a widget on click', () => {
    render(<SideMenu />);
    fireEvent.click(screen.getByText('Word Counter'));
    const s = useLayoutStore.getState();
    expect(s.layouts['default'].widgets[0].toolId).toBe('word-counter');
  });

  it('renders nothing when collapsed', () => {
    useLayoutStore.setState({ sidebarOpen: false });
    const { container } = render(<SideMenu />);
    expect(container).toBeEmptyDOMElement();
  });

  describe('mobile', () => {
    beforeEach(() => {
      mobileMatches = true;
    });

    it('renders as a drawer when drawerOpen is true, ignoring sidebarOpen', () => {
      useLayoutStore.setState({ sidebarOpen: false, drawerOpen: true });
      const { container } = render(<SideMenu />);
      expect(container.querySelector('.sidemenu-backdrop')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('renders nothing when drawerOpen is false even if sidebarOpen is true', () => {
      useLayoutStore.setState({ sidebarOpen: true, drawerOpen: false });
      const { container } = render(<SideMenu />);
      expect(container).toBeEmptyDOMElement();
    });

    it('backdrop click closes the drawer without touching sidebarOpen', () => {
      useLayoutStore.setState({ sidebarOpen: true, drawerOpen: true });
      const { container } = render(<SideMenu />);
      fireEvent.click(container.querySelector('.sidemenu-backdrop')!);
      expect(useLayoutStore.getState().drawerOpen).toBe(false);
      expect(useLayoutStore.getState().sidebarOpen).toBe(true);
    });

    it('tapping a tool opens the widget and closes the drawer, leaving sidebarOpen untouched', () => {
      useLayoutStore.setState({ sidebarOpen: true, drawerOpen: true });
      render(<SideMenu />);
      fireEvent.click(screen.getByText('Word Counter'));
      const s = useLayoutStore.getState();
      expect(s.layouts['default'].widgets[0].toolId).toBe('word-counter');
      expect(s.drawerOpen).toBe(false);
      expect(s.sidebarOpen).toBe(true);
    });

    it('mounting and closing the mobile drawer never changes sidebarOpen', () => {
      useLayoutStore.setState({ sidebarOpen: true, drawerOpen: false });
      const { rerender, container } = render(<SideMenu />);
      expect(useLayoutStore.getState().sidebarOpen).toBe(true);

      useLayoutStore.setState({ drawerOpen: true });
      rerender(<SideMenu />);
      expect(useLayoutStore.getState().sidebarOpen).toBe(true);

      fireEvent.click(container.querySelector('.sidemenu-backdrop')!);
      expect(useLayoutStore.getState().sidebarOpen).toBe(true);
      expect(useLayoutStore.getState().drawerOpen).toBe(false);
    });
  });
});
