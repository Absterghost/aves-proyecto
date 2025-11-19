import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";
import BirdProvider from "./context/BirdContext";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BirdProvider>
        <App />
      </BirdProvider>
    </AuthProvider>
  </React.StrictMode>
);
