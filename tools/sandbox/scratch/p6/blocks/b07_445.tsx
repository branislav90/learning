function ProjectsScreen() {
  const [params] = useSearchParams();                    // URL is the source of truth for filters
  const filters = parseFilters(params);                  // validate: URL input is untrusted too
  const list = useProjects(filters);
  /* render with data-first branching; keep previous page visible while next loads (placeholder/transition) */
}
export {};
