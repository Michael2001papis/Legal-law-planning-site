import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../store/authStore';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const close = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenuOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  useEffect(() => {
    if (mobileNavOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileNavOpen]);

  const closeMobileNav = () => setMobileNavOpen(false);
  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setMobileNavOpen(false);
    navigate('/auth/login');
  };

  const initials = (user?.name || '?').split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  const navLinks = (
    <>
      <NavLink to="/home" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`} onClick={closeMobileNav}>בית</NavLink>
      <NavLink to="/search" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`} onClick={closeMobileNav}>חיפוש</NavLink>
      <NavLink to="/my-list" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`} onClick={closeMobileNav}>הרשימה שלי</NavLink>
      {user?.role !== 'user' && (
        <NavLink to="/admin/dashboard" className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`} onClick={closeMobileNav}>ניהול</NavLink>
      )}
    </>
  );

  return (
    <div className="layout">
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <Link to="/home" className="navbar__logo">
          <span className="navbar__logo-text">עולם הסרטים של MP</span>
        </Link>
        <div className="navbar__center">{navLinks}</div>
        <button
          type="button"
          className="navbar__hamburger"
          onClick={() => setMobileNavOpen((o) => !o)}
          aria-label={mobileNavOpen ? 'סגור תפריט' : 'פתח תפריט'}
          aria-expanded={mobileNavOpen}
        >
          <span className={`navbar__hamburger-line ${mobileNavOpen ? 'open' : ''}`} />
          <span className={`navbar__hamburger-line ${mobileNavOpen ? 'open' : ''}`} />
          <span className={`navbar__hamburger-line ${mobileNavOpen ? 'open' : ''}`} />
        </button>
        <div
          className={`navbar__mobile-nav-overlay ${mobileNavOpen ? 'open' : ''}`}
          onClick={closeMobileNav}
          aria-hidden="true"
        />
        <div className={`navbar__mobile-nav ${mobileNavOpen ? 'open' : ''}`}>
          {navLinks}
        </div>
        <div className="navbar__right" ref={menuRef}>
          <button
            className="navbar__user-btn"
            onClick={() => setMenuOpen((o) => !o)}
            title={user?.name}
          >
            <span className="navbar__avatar">{initials}</span>
            <span className="navbar__user-name">{user?.name || 'פרופיל'}</span>
            <span className="navbar__chevron">{menuOpen ? '▲' : '▼'}</span>
          </button>
          <div className={`navbar__dropdown ${menuOpen ? 'open' : ''}`}>
            <Link to="/profile" className="navbar__dropdown-item" onClick={() => setMenuOpen(false)}>
              <span className="navbar__dropdown-icon">👤</span>
              פרופיל
            </Link>
            <Link to="/devices" className="navbar__dropdown-item" onClick={() => setMenuOpen(false)}>
              <span className="navbar__dropdown-icon">📱</span>
              מכשירים
            </Link>
            <button className="navbar__dropdown-item navbar__dropdown-item--logout" onClick={handleLogout}>
              <span className="navbar__dropdown-icon">🚪</span>
              יציאה
            </button>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
