import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ManagerHomePage from "./pages/ManagerHomePage";
import CookHomePage from "./pages/CookHomePage";

import ProductUploadPage from "./pages/ProductUploadPage";
import ProductListPage from "./pages/ProductListPage";
import EditProductPage from "./pages/EditProductPage";
import BuyingListPage from "./pages/BuyingListPage";
import CookUsagePage from "./pages/CookUsagePage";
import UsageTrackingPage from "./pages/UsageTrackingPage";
import OrderedPage from "./pages/OrderedPage";
import OrderedLogsPage from "./pages/OrderedLogsPage";
import ReceivedLogsPage from "./pages/ReceivedLogsPage";

function App() {
  const [userRole, setUserRole] = useState(null); // "manager" or "cook"

  const RequireRole = ({ role, children }) => {
    return userRole === role ? children : <Navigate to="/" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage setUserRole={setUserRole} />} />
        <Route path="/home" element={<HomePage />} />

        {/* New role-based dashboards */}
        <Route
          path="/manager/home"
          element={<RequireRole role="manager"><ManagerHomePage /></RequireRole>}
        />
        <Route
          path="/cook/home"
          element={<RequireRole role="cook"><CookHomePage /></RequireRole>}
        />

        {/* Manager-only pages */}
        <Route
          path="/upload"
          element={<RequireRole role="manager"><ProductUploadPage /></RequireRole>}
        />
        <Route
          path="/manager/list"
          element={<RequireRole role="manager"><ProductListPage /></RequireRole>}
        />
        <Route
          path="/manager/edit/:id"
          element={<RequireRole role="manager"><EditProductPage /></RequireRole>}
        />
        <Route
          path="/manager/buying-list"
          element={<RequireRole role="manager"><BuyingListPage /></RequireRole>}
        />
        <Route
          path="/manager/usage"
          element={<RequireRole role="manager"><UsageTrackingPage /></RequireRole>}
        />
        <Route
          path="/manager/ordered"
          element={<RequireRole role="manager"><OrderedPage /></RequireRole>}
        />
        <Route
          path="/manager/ordered-logs"
          element={<RequireRole role="manager"><OrderedLogsPage /></RequireRole>}
        />
        <Route
          path="/manager/received-logs"
          element={<RequireRole role="manager"><ReceivedLogsPage /></RequireRole>}
        />

        {/* Cook-only pages */}
        <Route
          path="/cook/usage"
          element={<RequireRole role="cook"><CookUsagePage /></RequireRole>}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
