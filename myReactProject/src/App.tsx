import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import DrawerAppBar from "./components/menu/menu";
import { ThemeProvider } from "@mui/material/styles";
import { customTheme } from "./style/customTheme";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
    <>
      <ThemeProvider theme={customTheme}>
        <Router>
          <DrawerAppBar></DrawerAppBar>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
