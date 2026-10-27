// server/reviews-post.ts (sketch)
export async function handleReviewPost(req: IncomingMessage, res: ServerResponse, url: URL) {
  const body = new URLSearchParams(await readBody(req, 16_384));   // cap size!
  const text = (body.get('body') ?? '').trim();
  const slug = url.pathname.split('/')[2]!;
  if (text.length < 10) { res.statusCode = 422; return res.end('Review too short'); }
  await addReview(slug, { body: text, rating: Number(body.get('rating')) || 5 });
  if (req.headers['x-enhanced']) { res.statusCode = 201; return res.end(); }
  res.statusCode = 303;                                // Post/Redirect/Get
  res.setHeader('location', `/products/${slug}#reviews`);
  res.end();
}
