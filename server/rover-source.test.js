const request = require("supertest");
const roverAPI = require("./rover-source");

describe("consuming the rover API", () => {
  it("gets the latests", async () => {
    const response = await roverAPI["latest"]();
    expect(response.statusCode).toEqual(200);
    expect(parseInt(response.headers["content-length"])).toBeGreaterThanOrEqual(
      50000
    );
  });
  it("gets a random index between 1 - 15", async () => {
    const response = await roverAPI["index"]({
      params: { index: Math.floor(Math.random() * 15) + 1 },
    });
    expect(response.statusCode).toEqual(200);
    expect(parseInt(response.headers["content-length"])).toBeGreaterThanOrEqual(
      50000
    );
  });
  it("request 5 images from autoplay", async () => {
    const response = await roverAPI["autoplay"]({
      query: { from: 1, take: 5 },
    });

    return new Promise((resolve) => {
      let bytes = Buffer.from("");

      response.on("data", (chunk) => {
        bytes = Buffer.concat([bytes, chunk]);
      });

      response.on("end", () => {
        try {
          const payload = bytes.toString("utf-8").trim().split("\n");
          expect(payload.length).toEqual(5);
          resolve(true);
        } catch (err) {
          console.log(err);
          resolve(err);
        }
      });
    });
  }, 20000);
});
