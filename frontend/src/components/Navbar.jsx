import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" style={{ fill: '#818cf8', width: '36px', height: '36px' }}><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3 1 9l11 6 9-4.91V17h2V9L12 3z"></path></svg>
        <span style={{ color: '#818cf8', fontWeight: 800, fontSize: '1.5rem', fontFamily: 'sans-serif', letterSpacing: '-0.5px' }}>Galgotias</span>
      </Link>
      <div className="nav-links">
        <Link to="/" style={location.pathname === '/' ? { color: '#f1f5f9' } : {}}>Home</Link>
        <Link to="/about" style={location.pathname === '/about' ? { color: '#f1f5f9' } : {}}>About</Link>
        <Link to="/modules" style={location.pathname === '/modules' ? { color: '#f1f5f9' } : {}}>Modules</Link>
        <Link to="/contact" style={location.pathname === '/contact' ? { color: '#f1f5f9' } : {}}>Contact</Link>
        <a href="http://localhost:5174" className="nav-cta">Dashboard →</a>
      </div>
    </nav>
  );
}
