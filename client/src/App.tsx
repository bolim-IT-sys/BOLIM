import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Mainlayout from "./pages/Mainlayout";

import LoginPage from "./pages/LoginPage";

import Dashboard from "./pages/AdminPages/Dashboard";
import Pins from "./pages/AdminPages/Pins";
import ITStocks from "./pages/AdminPages/ITStocks";
import MaterialControl from "./pages/AdminPages/MaterialControl";
import Users from "./pages/AdminPages/Users";
import Inventory from "./pages/AdminPages/InventoryManagement";
import Profile from "./pages/AdminPages/Profile";

import "./styles/index.css";
// import "boxicons/css/boxicons.min.css";
// import "boxicons";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<Mainlayout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/stocks/pins" element={<Pins />} />
          <Route path="/stocks/it-stocks" element={<ITStocks />} />
          <Route
            path="/stocks/material-control"
            element={<MaterialControl />}
          />

          <Route path="/inventory" element={<Inventory />} />
          <Route path="/users" element={<Users />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
