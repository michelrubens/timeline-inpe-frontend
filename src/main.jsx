import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";

const Admin = import.meta.env.DEV ? (await import("./Admin")).default : null;

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      {Admin && <Route path="/admin" element={<Admin />} />}
    </Routes>
  </BrowserRouter>,
);
