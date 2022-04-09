// Figure out base URL, which is different when deployed
const base = window.location.href.includes("github.io")
  ? `/${window.location.pathname.split("/")[1]}`
  : "";

// Get recent posts
fetch(`${base}/api/recent-posts.json`)
  .then((response) => response.json())
  .then((posts) => buildRecent(posts));

// Build HTML for recent posts and inject into element with id of recent-posts
function buildRecent(posts) {
  const target = document.querySelector("#recent-posts");

  // Exit if the target container does not exist
  if (!target) return;

  // Append HTML for each post to target
  posts.forEach((post) => {
    target.innerHTML += `
      <article>
        <h1>${post.title}</h1>
        <p>${post.description}</p>
        <p>${article.published}</p>
        <img
          src="${base}/images/${post.img.src}"
          alt="${post.img.alt}"
          width="${post.img.width}"
          height="${post.img.height}"
        />
      </article>
    `;
  });
}
