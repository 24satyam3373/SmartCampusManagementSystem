import { motion } from 'framer-motion';

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer 
      className="modern-footer"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="footer-grid">
        {/* Brand Column */}
        <motion.div className="footer-col brand-col" variants={itemVariants}>
          <div className="nav-logo" style={{ marginBottom: '1rem' }}>
            <div className="logo-icon">🏛️</div>
            <span>Smart Campus</span>
          </div>
          <p className="footer-desc">
            Empowering Galgotias University with next-generation digital infrastructure for students, faculty, and administrators.
          </p>
          <div className="footer-socials">
            <motion.a href="#" whileHover={{ y: -3, color: '#1da1f2' }}>🐦</motion.a>
            <motion.a href="#" whileHover={{ y: -3, color: '#0a66c2' }}>💼</motion.a>
            <motion.a href="#" whileHover={{ y: -3, color: '#e1306c' }}>📸</motion.a>
            <motion.a href="#" whileHover={{ y: -3, color: '#333' }}>🐙</motion.a>
          </div>
        </motion.div>

        {/* Links Columns */}
        <motion.div className="footer-col" variants={itemVariants}>
          <h3>Product</h3>
          <ul>
            <li><motion.a href="#" whileHover={{ x: 5, color: '#f1f5f9' }}>Features</motion.a></li>
            <li><motion.a href="/modules" whileHover={{ x: 5, color: '#f1f5f9' }}>Role Modules</motion.a></li>
            <li><motion.a href="#" whileHover={{ x: 5, color: '#f1f5f9' }}>Analytics</motion.a></li>
            <li><motion.a href="#" whileHover={{ x: 5, color: '#f1f5f9' }}>Integrations</motion.a></li>
          </ul>
        </motion.div>

        <motion.div className="footer-col" variants={itemVariants}>
          <h3>Resources</h3>
          <ul>
            <li><motion.a href="#" whileHover={{ x: 5, color: '#f1f5f9' }}>Documentation</motion.a></li>
            <li><motion.a href="#" whileHover={{ x: 5, color: '#f1f5f9' }}>API Reference</motion.a></li>
            <li><motion.a href="#" whileHover={{ x: 5, color: '#f1f5f9' }}>Tutorials</motion.a></li>
            <li><motion.a href="#" whileHover={{ x: 5, color: '#f1f5f9' }}>Blog</motion.a></li>
          </ul>
        </motion.div>

        <motion.div className="footer-col" variants={itemVariants}>
          <h3>Company</h3>
          <ul>
            <li><motion.a href="/about" whileHover={{ x: 5, color: '#f1f5f9' }}>About Us</motion.a></li>
            <li><motion.a href="/contact" whileHover={{ x: 5, color: '#f1f5f9' }}>Contact Support</motion.a></li>
            <li><motion.a href="#" whileHover={{ x: 5, color: '#f1f5f9' }}>Careers</motion.a></li>
            <li><motion.a href="#" whileHover={{ x: 5, color: '#f1f5f9' }}>Privacy Policy</motion.a></li>
          </ul>
        </motion.div>
      </div>

      <motion.div className="footer-bottom" variants={itemVariants}>
        <p>© 2026 Galgotias University — Smart Campus Management System. Greater Noida, UP.</p>
        <div className="footer-bottom-links">
          <a href="#">Terms</a>
          <span className="dot">•</span>
          <a href="#">Privacy</a>
          <span className="dot">•</span>
          <a href="#">Cookies</a>
        </div>
      </motion.div>
    </motion.footer>
  );
}
