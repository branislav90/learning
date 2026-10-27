import DOMPurify from "dompurify";   // ALLOWED_TAGS / ALLOWED_ATTR / ALLOWED_URI_REGEXP are DOMPurify config options; check the README for your version

const ALLOWED_PROTOCOLS = new Set(["https:", "http:", "mailto:"]);

export function safeUrl(raw: string, base = window.location.origin): string | null {
  try {
    const u = new URL(raw, base);
    return ALLOWED_PROTOCOLS.has(u.protocol) ? u.toString() : null;
  } catch {
    return null;
  }
}

export function SafeHtml({ html }: { html: string }) {
  // Sanitize at render time using an allowlist; keep the policy centralized and reviewed.
  const clean = useMemo(
    () => DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "ul", "ol", "li", "br", "code", "pre"],
      ALLOWED_ATTR: ["href", "title"],
      ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i,
    }),
    [html],
  );
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}

export function Comment({ comment }: { comment: { html: string; authorUrl: string } }) {
  const href = safeUrl(comment.authorUrl);
  return (
    <article>
      <SafeHtml html={comment.html} />
      {href && <a href={href} rel="noopener noreferrer ugc">Author site</a>}
    </article>
  );
}
