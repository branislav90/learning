export {};
performance.mark("search_results_start");
// ... after commit, in an effect or ref callback
performance.mark("search_results_visible");
performance.measure("search_results", "search_results_start", "search_results_visible");
