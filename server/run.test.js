const request = require("supertest");
const server = require("./run");

describe("Test the express server", () => {
  it("Get the homepage", async () => {
    return request(server)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });
  it("Get an index", async () => {
    return request(server)
      .get("/222")
      .then(response => {
        expect(response.statusCode).toBe(200);
      });
  });
  it("Get redirected to home if index is not a number", async () => {
    return request(server)
      .get("/thisisnotanumber")
      .expect(302)
  });
  test("Starts autoplay", async () => {
    return new Promise((resolve) => {
        request(server)
            .get("/rover-api/autoplay?from=1&take=2")
            .then(response => {
                expect(response.statusCode).toBe(200);
                resolve()
            });
        });
    })
});