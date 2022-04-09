// Import built-in and external libraries
const fs = require("fs");
const {
  promises: { readFile },
} = require("fs");
const path = require("path");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

// Set directory to be indexed
const directory = "./src/posts";

// Get a list of all of the files in the directory
fs.readdir(directory, (err, files) => {
  if (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }

  // Create an array of promises for all files in directory
  let promises = files.map((filename) => {
    const pathToFile = path.join(directory, filename);
    return getJson(pathToFile);
  });

  // Wait for all files to be processed
  Promise.all(promises).then((data) => {
    // Filter out any falsy entries
    let posts = data.filter((d) => !!d);

    // Sort the posts by date
    posts.sort((a, b) => new Date(b.published) - new Date(a.published));

    // Make the api directory if it does not yet exist
    fs.mkdir("./src/api", { recursive: true }, (err) => {
      if (err) throw err;
    });

    // Write the metadata from each post as a single JSON file
    fs.writeFile(
      "./src/api/recent-posts.json",
      JSON.stringify(posts),
      { flag: "w" },
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  });
});

// Meta tag helper function
const getMeta = (dom, property) => {
  const element = dom.window.document.querySelector(
    `meta[property="og:${property}"]`
  );
  return element ? element.getAttribute("content") : null;
};

// Read HTML file and convert metadata into JSON
const getJson = (pathToFile) => {
  return new Promise((resolve, reject) => {
    readFile(pathToFile, "utf8")
      .then((html) => {
        const dom = new JSDOM(html);
        const title = getMeta(dom, "title") || "Untitled";
        const description = getMeta(dom, "description") || "No description";
        const url = getMeta(dom, "url") || "";
        const imgSrc = getMeta(dom, "image") || "/images/no-og:image.jpg";
        const imgWidth = getMeta(dom, "image:width") || "1600";
        const imgHeight = getMeta(dom, "image:height") || "900";
        const imgAlt = getMeta(dom, "image:alt") || "";
        const published = getMeta(dom, "post:published_time") || "0000-00-00";

        resolve({
          title,
          description,
          url,
          img: {
            src: imgSrc,
            alt: imgAlt,
            width: imgWidth,
            height: imgHeight,
          },
          published,
        });
      })
      .catch((error) => {
        console.error(error.message);
        reject();
      });
  });
};
