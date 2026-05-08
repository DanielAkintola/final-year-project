import { Navigate, Route, Routes } from "react-router-dom";

import { AdminLayout } from "./layouts/AdminLayout";
import { adminRoutes } from "./routes/adminRoutes";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { SignUpPage } from "./pages/SignUpPage";
import { RequireAuth } from "./components/RequireAuth";
import { RequireRole } from "./components/RequireRole";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<SignUpPage />} />
      <Route path="/auth" element={<SignUpPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/app" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          {adminRoutes.map((route) => {
            const Page = route.Component;

            return (
              <Route
                element={
                  <RequireRole allowedRoles={route.allowedRoles}>
                    <Page />
                  </RequireRole>
                }
                key={route.path}
                path={route.path}
              />
            );
          })}
        </Route>
      </Route>
    </Routes>
  );
}
