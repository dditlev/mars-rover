import {Home,Single} from "./app.js";

ReactDOM.render(
  window.singleData ? (
    <Single data={window.singleData} />
  ) : (
    <Home data={window.slideData} metadata={window.slideData_metadata} />
  ),
  document.querySelector("#app")
);
