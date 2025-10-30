import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/common/Spinner/Spinner';
import LoginPage from '../features/auth/pages/LoginPage';
import MesasPage from '../features/mesas/pages/MesasPage';
import UsersPage from '../features/users/pages/UsersPage';
import MainLayout from '../components/layout/MainLayout/MainLayout';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner size="large" text="Carregando..." fullScreen />;
  }

  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/mesas" /> : <LoginPage />}
        />

        <Route
          path="/mesas"
          element={
            <PrivateRoute>
              <MainLayout>
                <MesasPage />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <MainLayout>
                <UsersPage />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
