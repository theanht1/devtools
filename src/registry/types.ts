import type { ComponentType, LazyExoticComponent } from 'react';

export type ToolCategory = 'text' | 'coding' | 'web' | 'image' | 'utility';

export interface ToolDefinition {
  id: string;
  title: string;
  category: ToolCategory;
  keywords: string[];
  defaultSize: { w: number; h: number };
  minSize?: { w: number; h: number };
  component: LazyExoticComponent<ComponentType>;
}
