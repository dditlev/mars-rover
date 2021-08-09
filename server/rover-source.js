const https = require("https");
const MultiStream = require("multistream");
const stream = require("stream");
const BOUNDARY_MARKER = "\n";
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
function* yieldTheRange(range) {
  for (const index of range) {
    yield index;
  }
}
function makeRange(size, startAt = 0) {
  return [...Array(size).keys()].map((i) => i + startAt);
}
module.exports = {
  autoplay: async (req, res) => {
    const q = req.query;
    const take = parseInt(q.take);
    const from = parseInt(q.from);

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
      if (value === BOUNDARY_MARKER) {
        return cb(null, stream.Readable.from([BOUNDARY_MARKER]));
      }
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
