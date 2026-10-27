export {};
// Techniques ordered from cheapest to most faithful
// 1. Remove APIs before the app loads (Playwright addInitScript, see above)
// 2. Emulate device/viewport/UA (DevTools device mode, Playwright devices) — does NOT change the JS engine
// 3. Use the actual engine: Playwright WebKit/Firefox/Chromium builds (current versions) — covers engine differences, not old versions
// 4. Real-device/browser-farm sessions for old versions (BrowserStack, Sauce Labs, lab devices) — highest fidelity
// 5. Replay production data: export an anonymized failing payload, load via MSW in a local run
