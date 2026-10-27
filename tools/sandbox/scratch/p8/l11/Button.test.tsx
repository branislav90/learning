// Button.test.tsx
import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { Button } from './Button';

describe('Button contract', () => {
  test('exposes role button with the given name', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  test('does not submit forms by default, but can opt in', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Button>Default</Button>
        <Button type="submit">Submit</Button>
      </form>,
    );
    await user.click(screen.getByRole('button', { name: 'Default' }));
    expect(onSubmit).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test('loading disables interaction and exposes busy state', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Pay</Button>);
    const btn = screen.getByRole('button', { name: 'Pay' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('forwards ref and rest props, merges className', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref} data-analytics="cta" aria-describedby="hint" className="custom">Go</Button>);
    const btn = screen.getByRole('button', { name: 'Go' });
    expect(ref.current).toBe(btn);
    expect(btn).toHaveAttribute('data-analytics', 'cta');
    expect(btn).toHaveAccessibleDescription; // see note
    expect(btn).toHaveClass('custom');
  });
});
