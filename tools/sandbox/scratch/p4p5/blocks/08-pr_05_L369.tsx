function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return <ThemeContext value={value}>{children}</ThemeContext>;
}

// Notifications are high-frequency and only needed by the notification tray:
// provide them from the feature's own subtree, not the app root.
function NotificationsFeature() {
  return (
    <NotificationsProvider>
      <NotificationTray />
      <NotificationToasts />
    </NotificationsProvider>
  );
}
export {};
