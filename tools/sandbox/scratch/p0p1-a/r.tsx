export const a = <div ref={(el) => (el ? 1 : 0)} />;
export const b = <div ref={(el) => { el?.focus(); }} />;
export const c = <div ref={(el) => el?.focus()} />;
