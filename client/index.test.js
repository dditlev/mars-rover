/**
 * @jest-environment jsdom
 */
import React from "react";
import renderer from "react-test-renderer";
import { Home, Single } from "./testapp";
const roverAPI = require("../server/rover-source");
const {bufferResponse} = require("../server/utils")

/**
 * Mock the TextDecoder and return two image stream mocks seperated by
 * the boundary marker \n
 */
global.TextDecoder = jest.fn(() => ({
  decode: jest.fn(() => "image-stream\nimage-stream\n"),
}));
/**
 * Mock fetch and return a fake reader
 */
global.fetch = jest.fn(() =>
  Promise.resolve({
    body: {
      getReader() {
        let i = 0;
        let pieces = 10;
        return {
          read() {
            return Promise.resolve(
              i < pieces.length
                ? { value: pieces[i++], done: false }
                : { value: undefined, done: true }
            );
          },
        };
      },
    },
  })
);

describe("The frontend renders", () => {
  it("Mounts the Home component and kicks off the autoplay", async () => {
    const parsedMetadata = JSON.parse(await bufferResponse(await roverAPI["root"]()));
    const parsedImage = JSON.parse(await bufferResponse(await roverAPI["index"]({ params: { index: 1 } })));
    const component = renderer.create(
      <Home metadata={parsedMetadata} data={parsedImage}></Home>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("Mounts the Single component with image 1", async () => {
    const parsedImage = JSON.parse(await bufferResponse(await roverAPI["index"]({ params: { index: 1 } })));
    const component = renderer.create(
      <Single data={parsedImage}></Single>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
