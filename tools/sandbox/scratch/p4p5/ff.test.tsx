// @vitest-environment jsdom
import { test } from 'vitest';
import { StrictMode } from 'react';
import { render, screen } from '@testing-library/react';
import { FormField, FieldControl, FieldDescription, FieldLabel, counter } from './ff.src';
test('ff', () => {
  render(<FormField><FieldLabel>E</FieldLabel><FieldControl /><FieldDescription>d</FieldDescription></FormField>);
  console.log('FormField renders', counter.n, screen.getByRole('textbox').getAttribute('aria-describedby'));
  counter.n = 0;
  render(<StrictMode><FormField><FieldLabel>E</FieldLabel><FieldControl /><FieldDescription>d</FieldDescription></FormField></StrictMode>);
  console.log('strict FormField renders', counter.n);
});
