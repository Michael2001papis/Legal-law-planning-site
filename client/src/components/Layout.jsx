import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="layout">
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="navbar__logo">
          <Link to="/home">עולם הסרטים של MP</Link>
        </div>
        <div className="navbar__center">
          <Link to="/home">בית</Link>
          <Link to="/search">חיפוש</Link>
          <Link to="/my-list">הרשימה שלי</Link>
          {user?.role !== 'user' && <Link to="/admin/dashboard">ניהול</Link>}
        </div>
        <div className="navbar__right">
          <Link to="/profile" className="navbar__user">{user?.name || 'פרופיל'}</Link>
          <Link to="/devices" className="navbar__icon" title="מכשירים">📱</Link>
          <button className="navbar__logout" onClick={handleLogout}>יציאה</button>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
