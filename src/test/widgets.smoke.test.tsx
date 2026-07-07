import { Suspense } from 'react';
import { render, act } from '@testing-library/react';
import { TOOLS } from '../registry/tools';

describe('every registered widget renders', () => {
  it('has 17 tools registered', () => {
    expect(TOOLS).toHaveLength(17);
  });

  for (const tool of TOOLS) {
    it(`renders ${tool.id}`, async () => {
      vi.useFakeTimers();
      const Body = tool.component;
      const { unmount } = render(
        <Suspense fallback="loading">
          <Body />
        </Suspense>
      );
      await act(async () => {
        await vi.advanceTimersByTimeAsync(0);
      });
      unmount();
      vi.useRealTimers();
    });
  }
});
