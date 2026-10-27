type P =
  | { kind: "text"; text: string; lines?: number }
  | { kind: "image"; src: string; alt: string; onZoom?: () => void };
export {};
