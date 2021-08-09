const PORT = process.env.PORT || 8080;

const express = require("express");
const path = require("path");
const server = express();
const roverAPI = require("./rover-source");
const {bufferResponse, deliverDynamicAsset} = require("./utils")

server.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

server.use("/dist", express.static(path.join(__dirname, "dist")));

server.get("/", async (req, res) => {
  const metadata = await bufferResponse(await roverAPI["root"]());
  const readable = await roverAPI["index"]({ params: { index: 1 } });
  deliverDynamicAsset("slideData", readable, metadata, res);
});

server.get("/rover-api/:action", async (req, res) => {
  if (!roverAPI[req.params.action]) {
    res.redirect("/");
  } else {
    const readable = await roverAPI[req.params.action](req);
    readable.pipe(res);
  }
});

server.get("/:index", async (req, res) => {
  if (isNaN(parseInt(req.params.index))) {
    res.redirect("/");
  } else {
    const readable = await roverAPI["index"](req);
    deliverDynamicAsset("singleData", readable, false, res);
  }
});
server.listen(PORT, () => {
  console.log(`\nStarted on localhost:${PORT}\n`);
});

module.exports = server;
