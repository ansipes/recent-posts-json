# Recent Posts JSON

An example of how metadata can be extracted from a directory of HTML files, stored as a JSON file, and requested/rendered on the front-end using JavaScript.

**[Live Demo](https://ansipes.github.io/recent-posts-json/)**

## Generate

The `/util/build-recent-posts.js` utility script loops through all of the files in the `/src/posts` directory, extracts metadata, and stores it as JSON in `/src/api/recent-posts.json`.

```
npm run recent-posts
```

## Deploy

The `/util/build-recent-posts.js` utility script is executed by `/.github/workflows/cd.yml` with every push to the repository.

```yml
---
- name: Setup nodejs
  uses: actions/setup-node@v1
  with:
    node-version: "12.x"

- name: Install dependencies
  run: npm install

- name: Build recent posts
  run: npm run recent-posts
```

## Render

The `/src/js/recent-posts.js` script requests the metadata stored at `/api/recent-posts.json` and injects it into an HTML element with an id of `recent-posts` (if such an element exists on the page).

```js
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
        <p>${post.published}</p>
        <p><a href="${base}/${post.url}">Read More</a></p>
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
```
