import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";
import BirdProvider from "./context/BirdContext";
import { AdminProvider } from "./context/AdminContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AdminProvider>
      <BirdProvider>
        <App />
      </BirdProvider>
    </AdminProvider>
  </React.StrictMode>
);
