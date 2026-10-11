// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import BackendStartupNotice from "./components/BackendStartupNotice.jsx";
import "./style/style.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BackendStartupNotice />
      <App />
    </AuthProvider>
  </StrictMode>,
);
