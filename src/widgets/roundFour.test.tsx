import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Generators from './Generators';
import JsonConverter from './JsonConverter';

describe('Generators number tab', () => {
  it('generates count integers within the range', async () => {
    render(<Generators />);
    fireEvent.click(screen.getByText('number'));
    fireEvent.change(screen.getByLabelText('Min'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Max'), { target: { value: '12' } });
    fireEvent.change(screen.getByLabelText('Count'), { target: { value: '50' } });
    fireEvent.click(screen.getByText('Generate'));
    await waitFor(() => {
      const lines = (document.querySelector('pre')?.textContent ?? '').trim().split('\n');
      expect(lines).toHaveLength(50);
      expect(lines.every((l) => Number(l) >= 10 && Number(l) <= 12)).toBe(true);
    });
  });

  it('shows an error when min > max', async () => {
    render(<Generators />);
    fireEvent.click(screen.getByText('number'));
    fireEvent.change(screen.getByLabelText('Min'), { target: { value: '9' } });
    fireEvent.change(screen.getByLabelText('Max'), { target: { value: '1' } });
    fireEvent.click(screen.getByText('Generate'));
    await waitFor(() => expect(screen.getByText(/Min must be/i)).toBeInTheDocument());
  });
});

describe('JsonConverter swap', () => {
  it('swaps direction and pane values', async () => {
    render(<JsonConverter />);
    const input = screen.getByPlaceholderText('Input…');
    fireEvent.change(input, { target: { value: '{"a":"1"}' } });
    fireEvent.click(screen.getByText('Convert'));
    await waitFor(() => expect(screen.getByText(/a: "1"/)).toBeInTheDocument());
    const output = document.querySelector('pre')!.textContent!;

    fireEvent.click(screen.getByLabelText('Swap conversion direction'));

    const selects = screen.getAllByRole('combobox') as HTMLSelectElement[];
    expect(selects[0].value).toBe('yaml');
    expect(selects[1].value).toBe('json');
    expect((input as HTMLTextAreaElement).value).toBe(output);
    expect(document.querySelector('pre')!.textContent).toBe('{"a":"1"}');
  });
});
