// contracts/textFieldContract.tsx
import { useState, type ComponentType } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';

export interface TextFieldLikeProps {
  label: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function textFieldContract(name: string, TextField: ComponentType<TextFieldLikeProps>) {
  describe(`${name} satisfies the TextField contract`, () => {
    test('label is programmatically associated', () => {
      render(<TextField label="Email" />);
      expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
    });

    test('uncontrolled: owns its value and reports string payloads', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TextField label="Email" defaultValue="a" onChange={onChange} />);
      const input = screen.getByRole('textbox', { name: 'Email' });
      await user.type(input, 'bc');
      expect(input).toHaveValue('abc');
      expect(onChange).toHaveBeenNthCalledWith(1, 'ab');
      expect(onChange).toHaveBeenNthCalledWith(2, 'abc');
    });

    test('controlled: displays the parent value, not its own', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TextField label="Email" value="fixed" onChange={onChange} />);
      const input = screen.getByRole('textbox', { name: 'Email' });
      await user.type(input, 'x');
      expect(onChange).toHaveBeenCalledWith('fixedx');
      expect(input).toHaveValue('fixed');
    });

    test('controlled with state owner follows updates', async () => {
      const user = userEvent.setup();
      function Harness() {
        const [v, setV] = useState('');
        return <TextField label="Email" value={v} onChange={setV} />;
      }
      render(<Harness />);
      const input = screen.getByRole('textbox', { name: 'Email' });
      await user.type(input, 'hi');
      expect(input).toHaveValue('hi');
    });

    test('error is exposed as invalid state with an accessible description', () => {
      render(<TextField label="Email" error="Enter a valid email" />);
      const input = screen.getByRole('textbox', { name: 'Email' });
      expect(input).toBeInvalid();
      expect(input).toHaveAccessibleDescription('Enter a valid email');
    });

    test('disabled is not focusable and ignores typing', async () => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      render(<TextField label="Email" disabled onChange={onChange} />);
      await user.tab();
      expect(screen.getByRole('textbox', { name: 'Email' })).not.toHaveFocus();
      await user.type(screen.getByRole('textbox'), 'x');
      expect(onChange).not.toHaveBeenCalled();
    });
  });
}
