const productP = getProduct(id), reviewsP = getReviews(id), recsP = getRecs(id);
const product = await productP;      // critical
// pass reviewsP and recsP to Suspense-wrapped consumers (use / async components)
export {};
