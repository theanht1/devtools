import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JsonConverter from './JsonConverter';
import Generators from './Generators';

describe('Cmd+Enter submit', () => {
  it('JsonConverter converts on Cmd+Enter', async () => {
    render(<JsonConverter />);
    const input = screen.getByPlaceholderText('Input…');
    fireEvent.change(input, { target: { value: '{"a":"1"}' } });
    fireEvent.keyDown(input, { key: 'Enter', metaKey: true });
    await waitFor(() => expect(screen.getByText(/a: "1"/)).toBeInTheDocument());
  });

  it('Generators generates on Ctrl+Enter', async () => {
    render(<Generators />);
    fireEvent.keyDown(screen.getByText('Generate'), { key: 'Enter', ctrlKey: true });
    await waitFor(() => {
      const out = document.querySelector('.out, pre');
      expect(out?.textContent).toMatch(/[0-9a-f]{8}-/); // uuid tab is default
    });
  });
});
