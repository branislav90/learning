export {};
// Allows impossible states: loading AND error AND data simultaneously.
type BadState = { loading: boolean; error?: Error; data?: Data };
