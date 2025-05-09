import type { FC } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Registration from "../pages/Register";
import Verify from "../pages/Verify";
import AcceptInvitation from "../pages/AcceptInvitation";

interface PublicRouteProps {}

const PublicRoute: FC<PublicRouteProps> = ({}) => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/invitation/verify/:token" element={<AcceptInvitation />} />
      <Route path="/verify/:token" element={<Verify />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};
export default PublicRoute;
