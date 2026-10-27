module.exports = {
  forbidden: [
    { name: "no-circular", severity: "error", from: {}, to: { circular: true } },
    { name: "features-only-via-public-api", severity: "error",
      from: { path: "^src/features/([^/]+)/" },
      to: { path: "^src/features/([^/]+)/", pathNot: ["^src/features/$1/", "^src/features/[^/]+/index\\.ts$"] } },
    { name: "shared-must-not-import-features", severity: "error", from: { path: "^src/shared/" }, to: { path: "^src/features/" } },
  ],
};
