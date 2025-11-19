import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Mainlayout from "./pages/Mainlayout";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/AdminPages/HomePage";
import Dashboard from "./pages/AdminPages/Dashboard";
import "./styles/index.css";
import "boxicons/css/boxicons.min.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Mainlayout />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
