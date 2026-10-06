export const seo = (title: string, description: string) => ({
  meta: [
    { title: `${title} — Cato Find` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} — Cato Find` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
});
