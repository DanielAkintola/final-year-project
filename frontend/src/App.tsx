import { Navigate, Route, Routes } from 'react-router-dom';

import { AdminLayout } from './layouts/AdminLayout';
import { adminRoutes } from './routes/adminRoutes';

export function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        {adminRoutes.map((route) => {
          const Page = route.Component;

          return <Route element={<Page />} key={route.path} path={route.path} />;
        })}
      </Route>
    </Routes>
  );
}
