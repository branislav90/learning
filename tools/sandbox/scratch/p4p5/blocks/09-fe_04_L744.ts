const ORDER = ["app", "pages", "widgets", "features", "entities", "shared"] as const;
// 1. glob src/**/*.{ts,tsx}; 2. parse imports (TypeScript compiler API or a regex for aliased "@/layer/slice/..." paths)
// 3. for each import: (layerFrom, sliceFrom) → (layerTo, sliceTo, pathRest)
//    violation if idx(layerTo) < idx(layerFrom)                      // upward
//    violation if layerTo === layerFrom && sliceTo !== sliceFrom && layerFrom not in {app, shared} // sideways
//    violation if sliceTo !== sliceFrom && pathRest !== ""           // deep import (allow shared segments)
// 4. print violations; exit(1) if count > baseline (ratchet)
export {};
