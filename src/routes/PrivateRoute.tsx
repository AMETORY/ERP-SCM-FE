import type { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import ContactPage from "../pages/ContactPage";

import Home from "../pages/Home";


import ProductDetail from "../pages/ProductDetail";
import ProductPage from "../pages/ProductPage";

import ProfilePage from "../pages/ProfilePage";
import SettingPage from "../pages/SettingPage";
import WarehousePage from "../pages/WarehousePage";

interface PrivateRouteProps {}

const PrivateRoute: FC<PrivateRouteProps> = ({}) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/goods" element={<ProductPage />} />
      <Route path="/goods/:productId" element={<ProductDetail />} />
      <Route path="/warehouse" element={<WarehousePage />} />
      <Route path="/setting" element={<SettingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      
     
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
export default PrivateRoute;
