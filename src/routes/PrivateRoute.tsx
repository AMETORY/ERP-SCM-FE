import type { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";


import Home from "../pages/Home";

import ProductDetail from "../pages/ProductDetail";
import ProductPage from "../pages/ProductPage";

import ProfilePage from "../pages/ProfilePage";
import SettingPage from "../pages/SettingPage";
import WarehousePage from "../pages/WarehousePage";
import StockOpnameDetail from "../pages/StockOpnameDetail";
import DistributionEventPage from "../pages/DistributionEventPage";
import DistributionEventDetail from "../pages/DistributionEventDetail";
import LocationPage from "../pages/LocationPage";
import LocationDetail from "../pages/LocationDetail";

interface PrivateRouteProps {}

const PrivateRoute: FC<PrivateRouteProps> = ({}) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/goods" element={<ProductPage />} />
      <Route path="/distribution-event" element={<DistributionEventPage />} />
      <Route path="/distribution-event/:distributionId" element={<DistributionEventDetail />} />
      <Route path="/goods/:productId" element={<ProductDetail />} />
      <Route path="/storage" element={<WarehousePage />} />
      <Route path="/location" element={<LocationPage />} />
      <Route path="/location/:locationId" element={<LocationDetail />} />
      <Route
        path="/stock-opname/:stockOpnameId"
        element={<StockOpnameDetail />}
      />
      <Route path="/setting" element={<SettingPage />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
export default PrivateRoute;
