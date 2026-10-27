export const cx = (...parts: Array<string | false | null | undefined>) => parts.filter(Boolean).join(' ');
export const mergeStyle = (base: React.CSSProperties, override?: React.CSSProperties) => ({ ...base, ...override });
// usage: <div className={cx('acme-card', className)} style={mergeStyle({ padding: 8 }, style)} {...rest} />
export {};
