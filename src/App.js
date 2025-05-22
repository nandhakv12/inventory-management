import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductUploadPage from "./pages/ProductUploadPage";
import ProductListPage from "./pages/ProductListPage";
import EditProductPage from "./pages/EditProductPage";
import BuyingListPage from "./pages/BuyingListPage";
import CookUsagePage from "./pages/CookUsagePage";
import UsageTrackingPage from "./pages/UsageTrackingPage";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route path="/upload" element={<ProductUploadPage />} />
          <Route path="/manager/list" element={<ProductListPage />} />
          <Route path="/manager/edit/:id" element={<EditProductPage />} />
          <Route path="/manager/buying-list" element={<BuyingListPage />} />
          <Route path="/cook/usage" element={<CookUsagePage />} />
          <Route path="/manager/usage" element={<UsageTrackingPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
