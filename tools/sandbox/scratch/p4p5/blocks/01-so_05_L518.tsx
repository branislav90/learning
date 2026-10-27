// App root (prod)
<AnalyticsProvider value={segmentAdapter}> <App /> </AnalyticsProvider>
// Test
render(<AnalyticsProvider value={{ track: spy }}><AddToCartButton sku="x" /></AnalyticsProvider>);
export {};
