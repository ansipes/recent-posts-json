const base = window.location.href.includes("github.io")
  ? `/${window.location.pathname.split("/")[1]}`
  : "";

fetch(`${base}/api/recent-posts.json`)
  .then((response) => response.json())
  .then((articles) => buildRecent(articles));

function buildRecent(articles) {
  const target = document.querySelector("#recent-posts");

  if (!target) return;

  articles.forEach((article) => {
    target.innerHTML += `
      <article>
        <h1>${article.title}</h1>
        <p>${article.description}</p>
        <p>${article.published}</p>
        <img src="${article.img.src}" alt="${article.img.alt}" width="${article.img.width}" height="${article.img.height}" />
      </article>
    `;
  });
}
