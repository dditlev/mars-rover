const https = require("https");
const MultiStream = require("multistream");
const stream = require("stream");

/**
 * Marks the seperation of streams
 */
const BOUNDARY_MARKER = "\n";

/**
 * Consume the API with a path (or get the metadata with no path)
 * @param {string} path the pathname of the api endpoint
 * @returns http.IncomingMessage (stream.Readable)
 */
function consumer(path) {
  return new Promise((resolve, reject) => {
    https.get(
      `https://hiring.hypercore-protocol.org/termrover/${path}`,
      (response) => {
        resolve(response);
      }
    );
  });
}
/**
 * Yield each index on next()
 * @param {array} range of indicies
 */
function* yieldTheRange(range) {
  for (const index of range) {
    yield index;
  }
}
/**
 * Create a range of n numbers with an optional offset (startAt)
 * @param {number} size the size of the range
 * @param {number} startAt the offset of the range
 * @returns Array
 */
function makeRange(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}
module.exports = {
  autoplay: async (req, res) => {
    const q = req.query;
    const take = parseInt(q.take);
    const from = parseInt(q.from);

    // Create the range for the generator and append the boundary marker
    // after each index in the range
    const streams = yieldTheRange(
      makeRange(take, from).reduce((newLined, index) => {
        newLined.push(index);
        newLined.push(BOUNDARY_MARKER);
        return newLined;
      }, [])
    );

    return new MultiStream((cb) => {
      const { value, done } = streams.next();
      if (done) return cb(null, null);
      // if the value in the range is the BOUNDARY_MARKER create a readstream
      // with the marker and return it to MultiStream, to indicate the end of
      // one stream and the beginning of another stream
      if (value === BOUNDARY_MARKER) {
        return cb(null, stream.Readable.from([BOUNDARY_MARKER]));
      }
      // If the value is not a marker, fetch the stream and pass it to MultiStream
      consumer(value).then((stream) => {
        cb(null, stream);
      });
    });
  },
  latest: async (req) => {
    return await consumer("latest");
  },
  root: async (req) => {
    return await consumer("")
  },
  index: async (req) => {
    return await consumer(req.params.index);
  },
};
