import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Mainlayout from "./pages/Mainlayout";

import LoginPage from "./pages/LoginPage";
import Pins from "./pages/AdminPages/Pins";
import ITStocks from "./pages/AdminPages/ITStocks";
import MaterialControl from "./pages/AdminPages/MaterialControl";
import Dashboard from "./pages/AdminPages/Dashboard";
import "./styles/index.css";
import "boxicons/css/boxicons.min.css";

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
            path="/stocks/meterial-control"
            element={<MaterialControl />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
