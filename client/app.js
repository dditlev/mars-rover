import fetchStream from "./fetchStream.js";
import useKeypress from "./useKeypress.js";
/**
 * Wraps a hoverable overlay on slide images to show metadata
 * @param {React.Node} props.content the content to show on hover
 * @param {React.Node} props.children A component that Overlay wraps
 * @returns React.Node
 */
function Overlay(props) {
  return (
    <div className="image-overlay">
      <div className="image-overlay-content">{props.content}</div>
      {props.children}
    </div>
  );
}
/**
 * The content of the image overlay, when hovering a slide
 * @param {object} props.metadata the index's metadata
 * @returns React.Node
 */
function OverlayContent(props) {
  return (
    <div>
      <h3>SOL</h3>
      <h1>{props.metadata.sol}</h1>
      <h3>Earth date</h3>
      <h1>{props.metadata.earth_date}</h1>
    </div>
  );
}

/**
 * Renders the slide image with the hoverable overlay
 * @param {object} props.response The index request response
 * @returns React.Node
 */
function SlideImage(props) {
  return (
    <Overlay content={<OverlayContent metadata={props.response.metadata} />}>
      <img src={props.response.images.base64} />
    </Overlay>
  );
}
/**
 * Renders the slideshow of images and start the slide change interval
 * with a given speed in ms
 * @param {number} props.speed The speed fo the slideshow
 * @param {number} props.max The max amount of images to be shown
 * @param {array} props.images The array of images
 * @param {function} props.loadNext The function to call, when the next set of images has to be fetched
 * @returns React.Node
 */
const RenderSlideShow = (props) => {
  const refCounter = React.useRef(0);

  const [slideIndex, setSlideIndex] = React.useState(0);
  const speed = props.speed;
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (paused) return clearInterval(interval);
      if (refCounter.current + 1 === props.max) {
        refCounter.current = 0;
      } else {
        refCounter.current++;
      }
      setSlideIndex(refCounter.current);
      if ((refCounter.current - 4) % 10 === 0) {
        props.loadNext();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [refCounter, paused, speed]);

  const onRight = () => {
    if (refCounter.current > props.max - 1) return;
    setPaused(true);
    refCounter.current++
    if ((refCounter.current - 4) % 10 === 0) {
      props.loadNext();
    }
    setSlideIndex(refCounter.current);
  };
  const onLeft = () => {
    if (refCounter.current <= 1) return;
    setPaused(true);
    refCounter.current--
    setSlideIndex(refCounter.current);
  };
  const onSpace = () => {
    setPaused(!paused);
  };

  useKeypress(
    {
      key: "ArrowLeft",
    },
    onLeft
  );
  useKeypress(
    {
      key: "ArrowRight",
    },
    onRight
  );
  useKeypress(
    {
      keyCode: 32, // space,
      value: paused,
    },
    onSpace
  );

  return (
    <div className="slide-show" onClick={() => setPaused(!paused)}>
      {props.images.map((d, i) => (
        <div
          key={i}
          style={
            slideIndex === i
              ? { zIndex: i, opacity: 1 }
              : slideIndex - 1 === i
              ? { zIndex: i, opacity: 0.5 }
              : { display: "none" }
          }
        >
          <SlideImage key={i} response={d}></SlideImage>
        </div>
      ))}
    </div>
  );
};
/**
 * Starts and controls the streaming of images (via fetch) and renders
 * the RenderSlideShow component when images are available
 * @param {React.Node} props.children first image to show while loading
 * @returns React.Node
 */
const SlideShow = (props) => {
  const max = props.numImages;
  const take = 15;
  const from = React.useRef(1);
  const searchParams = new URLSearchParams(window.location.search);
  const speed = searchParams.get("speed");

  const [data, setData] = React.useReducer(
    (state, newState) => [...state, newState],
    []
  );

  React.useEffect(() => fetchStream(from.current, take, setData), []);

  const loadNext = () =>
    new Promise((resolve, reject) => {
      const newFrom = from.current + take;
      if (newFrom >= max) return reject("done");
      fetchStream(newFrom, take, setData);
      resolve(newFrom);
    });

  if (data.length > 0)
    return (
      <RenderSlideShow
        count={take}
        max={max}
        images={data}
        speed={speed || 500}
        loadNext={() =>
          loadNext().then((newFrom) => {
            from.current = newFrom;
          })
        }
      />
    );
  return props.children;
};

/**
 * AppWrapper wraps any root component
 * @param {children} props React.Node
 * @returns AppWrapper
 */
function AppWrapper(props) {
  return (
    <main className="slideshow-app">
      <header>
        <h1>View from Perseverance</h1>
      </header>
      <section>{props.children}</section>
    </main>
  );
}

/**
 * Show the slideshow on "/"
 * @param {object} props.data The "initial paint" image embedded in the html response
 * @returns React.Node
 */
export function Home(props) {
  return (
    <AppWrapper>
      <SlideShow numImages={props.metadata.numImages}>
        <SlideImage response={props.data}></SlideImage>
      </SlideShow>
    </AppWrapper>
  );
}

/**
 * Show a single image on "/:index"
 * @param {object} props.data The "initial paint" image embedded in the html response
 * @returns React.Node
 */
export function Single(props) {
  return (
    <AppWrapper>
      <SlideImage response={props.data}></SlideImage>
    </AppWrapper>
  );
}