export {};
function Inbox({ unread }: { unread: number }) {
  const { t, d } = useI18n();
  return (
    <section aria-labelledby="inbox-title">
      <h1 id="inbox-title">{t("inbox.title")}</h1>
      <p>{t("inbox.unread", { count: unread })}</p>
      <p>{d(Date.now(), { dateStyle: "medium" })}</p>
    </section>
  );
}
