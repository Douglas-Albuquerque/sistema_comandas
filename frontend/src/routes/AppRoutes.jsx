import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/common/Spinner/Spinner';
import LoginPage from '../features/auth/pages/LoginPage';
import MesasPage from '../features/mesas/pages/MesasPage';
import ComandaPage from '../features/mesas/pages/ComandaPage';
import UsersPage from '../features/users/pages/UsersPage';
import ProfilePage from '../features/profile/pages/ProfilePage';
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
          path="/mesas/:mesaId/comanda"
          element={
            <PrivateRoute>
              <MainLayout>
                <ComandaPage />
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

        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </PrivateRoute>
          }
        />

        <Route path="/" element={<Navigate to="/mesas" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
