import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store/authStore';
import Disclaimer from './pages/Disclaimer';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MoviePage from './pages/MoviePage';
import Search from './pages/Search';
import MyList from './pages/MyList';
import Profile from './pages/Profile';
import Devices from './pages/Devices';
import Pricing from './pages/Pricing';
import AdminDashboard from './pages/admin/Dashboard';
import AdminMovies from './pages/admin/Movies';
import AdminUsers from './pages/admin/Users';
import NotFound from './pages/NotFound';

function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth/login" replace />;
  return children;
}

function RequireRole({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/home" replace />;
  return children;
}

function RequireDisclaimer({ children }) {
  const accepted = localStorage.getItem('disclaimerAccepted') === 'true';
  if (!accepted) return <Navigate to="/disclaimer" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/disclaimer" element={<Disclaimer />} />
      <Route path="/" element={<Navigate to="/disclaimer" replace />} />
      <Route
        path="/auth/login"
        element={
          <RequireDisclaimer>
            <Login />
          </RequireDisclaimer>
        }
      />
      <Route
        path="/auth/register"
        element={
          <RequireDisclaimer>
            <Register />
          </RequireDisclaimer>
        }
      />
      <Route path="/pricing" element={<RequireDisclaimer><Pricing /></RequireDisclaimer>} />
      <Route
        path="/home"
        element={
          <RequireDisclaimer>
            <RequireAuth>
              <Home />
            </RequireAuth>
          </RequireDisclaimer>
        }
      />
      <Route
        path="/movie/:id"
        element={
          <RequireDisclaimer>
            <RequireAuth>
              <MoviePage />
            </RequireAuth>
          </RequireDisclaimer>
        }
      />
      <Route
        path="/search"
        element={
          <RequireDisclaimer>
            <RequireAuth>
              <Search />
            </RequireAuth>
          </RequireDisclaimer>
        }
      />
      <Route
        path="/my-list"
        element={
          <RequireDisclaimer>
            <RequireAuth>
              <MyList />
            </RequireAuth>
          </RequireDisclaimer>
        }
      />
      <Route
        path="/profile"
        element={
          <RequireDisclaimer>
            <RequireAuth>
              <Profile />
            </RequireAuth>
          </RequireDisclaimer>
        }
      />
      <Route
        path="/devices"
        element={
          <RequireDisclaimer>
            <RequireAuth>
              <Devices />
            </RequireAuth>
          </RequireDisclaimer>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <RequireDisclaimer>
            <RequireAuth>
              <RequireRole roles={['admin', 'content_admin']}>
                <AdminDashboard />
              </RequireRole>
            </RequireAuth>
          </RequireDisclaimer>
        }
      />
      <Route
        path="/admin/movies"
        element={
          <RequireDisclaimer>
            <RequireAuth>
              <RequireRole roles={['admin', 'content_admin']}>
                <AdminMovies />
              </RequireRole>
            </RequireAuth>
          </RequireDisclaimer>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RequireDisclaimer>
            <RequireAuth>
              <RequireRole roles={['admin']}>
                <AdminUsers />
              </RequireRole>
            </RequireAuth>
          </RequireDisclaimer>
        }
      />
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
