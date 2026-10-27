export {};
function Comment({ comment }: { comment: { html: string; authorUrl: string } }) {
  return (
    <article>
      <div dangerouslySetInnerHTML={{ __html: comment.html }} />        {/* ❌ stored XSS */}
      <a href={comment.authorUrl}>Author site</a>                        {/* ❌ javascript: URL */}
    </article>
  );
}
