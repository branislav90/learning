// src/shared/i18n/loadCatalog.ts
const loaders: Record<string, () => Promise<{ default: Messages }>> = {
  en: () => import("../../../catalogs/en.json"),
  de: () => import("../../../catalogs/de.json"),
  ar: () => import("../../../catalogs/ar.json"),
};

export async function loadCatalog(locale: string): Promise<Messages> {
  const load = loaders[locale] ?? loaders.en!;
  return (await load()).default;
}
