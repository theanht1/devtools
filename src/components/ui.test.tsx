import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Textarea } from './ui';

function Harness({ initial = 'abcd' }: { initial?: string }) {
  const [v, setV] = useState(initial);
  return <Textarea data-testid="ta" value={v} onChange={(e) => setV(e.target.value)} />;
}

describe('Textarea', () => {
  it('is vertically resizable', () => {
    render(<Harness />);
    expect((screen.getByTestId('ta') as HTMLTextAreaElement).className).toContain('resize-y');
  });

  it('Tab inserts two spaces at the caret and updates state', () => {
    render(<Harness />);
    const ta = screen.getByTestId('ta') as HTMLTextAreaElement;
    ta.focus();
    ta.setSelectionRange(2, 2);
    fireEvent.keyDown(ta, { key: 'Tab' });
    expect(ta.value).toBe('ab  cd');
    expect(ta.selectionStart).toBe(4);
    expect(ta.selectionEnd).toBe(4);
  });

  it('Tab replaces a selection with two spaces', () => {
    render(<Harness />);
    const ta = screen.getByTestId('ta') as HTMLTextAreaElement;
    ta.focus();
    ta.setSelectionRange(1, 3); // 'bc'
    fireEvent.keyDown(ta, { key: 'Tab' });
    expect(ta.value).toBe('a  d');
  });

  it('Shift+Tab is not intercepted', () => {
    render(<Harness />);
    const ta = screen.getByTestId('ta') as HTMLTextAreaElement;
    ta.focus();
    ta.setSelectionRange(2, 2);
    fireEvent.keyDown(ta, { key: 'Tab', shiftKey: true });
    expect(ta.value).toBe('abcd');
  });

  it('consumer onKeyDown can preventDefault to opt out', () => {
    function OptOut() {
      const [v, setV] = useState('xy');
      return (
        <Textarea
          data-testid="opt"
          value={v}
          onChange={(e) => setV(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Tab') e.preventDefault(); }}
        />
      );
    }
    render(<OptOut />);
    const ta = screen.getByTestId('opt') as HTMLTextAreaElement;
    ta.focus();
    ta.setSelectionRange(1, 1);
    fireEvent.keyDown(ta, { key: 'Tab' });
    expect(ta.value).toBe('xy'); // consumer swallowed it; no insertion
  });
});
