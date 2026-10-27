// @vitest-environment jsdom
import { test, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Settings, Tabs } from './tabs51.src';
afterEach(cleanup);
test('tabs', async () => {
  const u = userEvent.setup();
  render(<Settings />);
  await u.type(screen.getByLabelText('b'), 'hello');
  await u.click(screen.getByRole('tab', { name: 'Profile' }));
  await u.click(screen.getByRole('tab', { name: 'Billing' }));
  console.log('input after switch:', JSON.stringify((screen.getByLabelText('b') as HTMLInputElement).value));
  screen.getByRole('tab', { name: 'Billing' }).focus();
  await u.keyboard('{ArrowRight}');
  console.log('after ArrowRight selected:', screen.getAllByRole('tab').map(t => t.getAttribute('aria-selected')), document.activeElement?.textContent);
  await u.keyboard('{ArrowLeft}');
  console.log('after ArrowLeft selected:', screen.getAllByRole('tab').map(t => t.getAttribute('aria-selected')));
  cleanup();
  let called = 0;
  render(<Tabs defaultValue="a"><Tabs.List onKeyDown={() => called++}><Tabs.Trigger value="a">A</Tabs.Trigger><Tabs.Trigger value="b">B</Tabs.Trigger></Tabs.List></Tabs>);
  screen.getByRole('tab', { name: 'A' }).focus(); await u.keyboard('{ArrowRight}');
  console.log('consumer onKeyDown called', called, 'selected', screen.getAllByRole('tab').map(t => t.getAttribute('aria-selected')));
});
