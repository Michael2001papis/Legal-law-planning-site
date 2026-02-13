import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <Link to="/home" className="logo">עולם הסרטים של MP</Link>
        <div className="nav-links">
          <Link to="/home">בית</Link>
          <Link to="/search">חיפוש</Link>
          <Link to="/my-list">הרשימה שלי</Link>
          {user?.role !== 'user' && (
            <Link to="/admin/dashboard">ניהול</Link>
          )}
          <Link to="/profile">{user?.name}</Link>
          <Link to="/devices">מכשירים</Link>
          <button className="btn btn-outline" onClick={handleLogout}>יציאה</button>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
