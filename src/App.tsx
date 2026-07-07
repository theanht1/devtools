import { useEffect } from 'react';
import { useLayoutStore } from './store/layoutStore';
import { TopBar } from './components/TopBar';
import { GridCanvas } from './components/GridCanvas';
import { SideMenu } from './components/SideMenu';
import { CommandPalette } from './components/CommandPalette';
import { useKeyboardNav } from './hooks/useKeyboardNav';

export default function App() {
  useKeyboardNav();
  const theme = useLayoutStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="app flex h-screen flex-col">
      <TopBar />
      <div className="app-body flex min-h-0 flex-1">
        <SideMenu />
        <GridCanvas />
      </div>
      <CommandPalette />
    </div>
  );
}
