function Bomb(): never { throw new Error('boom'); }

test('widget failure is contained', async () => {
  const user = userEvent.setup();
  vi.spyOn(console, 'error').mockImplementation(() => {});   // React logs caught errors
  render(
    <>
      <input aria-label="note" />
      <ErrorBoundary fallbackRender={() => <p role="alert">Widget failed</p>}><Bomb /></ErrorBoundary>
    </>,
  );
  await user.type(screen.getByLabelText('note'), 'hello');
  expect(screen.getByRole('alert')).toHaveTextContent('Widget failed');
  expect(screen.getByLabelText('note')).toHaveValue('hello');
});
export {};
