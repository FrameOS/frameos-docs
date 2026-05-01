export function MarkdownPage({ page }) {
  const showTitle = page.kind === "blog";

  return (
    <article className="markdownShell">
      {showTitle ? (
        <header className="markdownHeader">
          {page.date ? <p className="eyebrow">{new Date(page.date).toLocaleDateString()}</p> : null}
          <h1>{page.title}</h1>
        </header>
      ) : null}
      <div className="markdownBody" dangerouslySetInnerHTML={{ __html: page.html }} />
    </article>
  );
}
