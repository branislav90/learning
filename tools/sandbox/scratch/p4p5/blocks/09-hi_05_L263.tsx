// ❌ 1. HOC applied inside render (remount on every parent render; §4.3)
function Page() {
  const Enhanced = withWindowSize(Chart);
  return <Enhanced data={[1, 2]} />;
}

// ❌ 2. HOC mutates its input
function withBadge<P extends object>(Component: ComponentType<P>) {
  const original = Component.prototype?.render;           // legacy class mutation
  Component.prototype.render = function () { /* ... */ return original.call(this); };
  return Component;                                        // caller can't tell it changed
}

// ❌ 3. Statics lost (compound component)
const TrackedSelect = withTracking(Select);
<TrackedSelect.Option value="a" />   // TypeError / undefined: statics did not carry over

// ❌ 4. Props collision, silently overridden
const Enhanced = withUser(Profile);   // injects `data`
<Enhanced data={myProfileData} />     // caller's `data` overwritten by HOC's `data`
export {};
