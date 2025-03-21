import React from "react";
import { createRoot } from "react-dom/client";
// import ReactDOM from 'react-dom';
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// import "./main.css";

if (typeof global === 'undefined') {
  window.global = window;
}
const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/*
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

ReactDOM.createRoot(document.getElementById('root'))
  .render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
