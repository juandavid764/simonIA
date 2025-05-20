import { Routes, Route } from "react-router-dom";

import {NotFoundPage} from "../pages/NotFoundPage";
import {HomePage} from "../pages/HomePage";
import {AuthPage} from "../pages/AuthPage";

export const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/AuthPage" element={<AuthPage />} />
    </Routes>
  );
};
