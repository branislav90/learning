// ❌ D: unstable key from inline object with undefined/Date/functions
queryKey: ['events', { from: new Date(), cb: () => {} }]
export {};
