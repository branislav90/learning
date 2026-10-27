// FilterableList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';
import { FilterableList } from './FilterableList';

test('filters results after typing', async () => {
  render(<FilterableList items={['apple', 'apricot', 'banana']} />);
  await userEvent.type(screen.getByRole('textbox'), 'ap');
  await waitFor(() => {
    const items = screen.getAllByRole('listitem').map((li) => li.textContent);
    expect(items).toEqual(['apple', 'apricot']);
  });
});
