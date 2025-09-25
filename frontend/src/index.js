import React from 'react';
import { createRoot } from "react-dom/client";
import './index.css';
import App from './App';
import { AuthProvider } from "./context/AuthContext";
import reportWebVitals from './reportWebVitals';

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

reportWebVitals();
