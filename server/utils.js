const template = require("./html-template");
/**
 * Deliver a dynamic html file with data buffered from a readable stream.
 * The data will be accessible through a window bound variable named via the templateStateKey
 * @param {string} templateStateKey the key (window.${key}) in which the state data will be bound on window
 * @param {stream} readable the response stream for a given index
 * @param {stream} res express response
 */
 function deliverDynamicAsset(templateStateKey, readable, metadata, res) {
    const data = [];
    readable.on("data", (c) => {
      data.push(c);
    });
    readable.on("end", () =>
      res.end(template(templateStateKey, Buffer.concat(data).toString("utf-8"), metadata))
    );
  }
  function bufferResponse(readable) {
    return new Promise((resolve, reject) => {
      const data = [];
      readable.on("data", (c) => {
        data.push(c);
      });
      readable.on("end", () => resolve(Buffer.concat(data).toString("utf-8")));
    });
  }
  module.exports = {bufferResponse, deliverDynamicAsset}