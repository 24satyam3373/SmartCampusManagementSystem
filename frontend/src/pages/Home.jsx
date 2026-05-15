import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import Footer from '../components/Footer';

export default function Home() {
  const [counts, setCounts] = useState({ students: 0, courses: 0, uptime: 0 });
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  // Cursor Tracking for Parallax Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  
  // Opposite direction for variety
  const smoothXReverse = useSpring(useTransform(mouseX, v => -v), { stiffness: 50, damping: 20 });
  const smoothYReverse = useSpring(useTransform(mouseY, v => -v), { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate mouse position relative to center of screen (-1 to 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      // max 20px movement
      mouseX.set(x * 20); 
      mouseY.set(y * 20);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    // Animate counters
    const duration = 2000;
    const targets = { students: 5000, courses: 120, uptime: 99 };
    const start = Date.now();
    const animate = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCounts({
        students: Math.round(targets.students * ease),
        courses: Math.round(targets.courses * ease),
        uptime: Math.round(targets.uptime * ease),
      });
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  const features = [
    { icon: '🔐', title: 'Role-Based Access Control', desc: 'Secure login for Admin, Faculty, and Students at Galgotias University with JWT authentication and granular role-based permissions.', img: '/images/feature_attendance.png' },
    { icon: '📚', title: 'Course Management', desc: 'Full lifecycle management for all Galgotias University programs — create, publish, enroll, and archive courses with state machine logic.', img: '/images/feature_courses.png' },
    { icon: '📊', title: 'Grade Analytics', desc: 'Weighted grading with auto GPA computation for Galgotias students. Performance visualized with beautiful interactive charts.', img: '/images/feature_grades.png' },
  ];

  const modules = [
    { title: 'For Students', icon: '🎓', color: '#6366f1', items: ['Enroll in courses', 'Track attendance', 'View grades & GPA', 'Check timetable'] },
    { title: 'For Faculty', icon: '👨‍🏫', color: '#10b981', items: ['Manage courses', 'Mark attendance', 'Assign grades', 'Notify students'] },
    { title: 'For Admins', icon: '🛡️', color: '#f59e0b', items: ['Manage all users', 'Create courses', 'Monitor analytics', 'Full control'] },
  ];

  const testimonials = [
    { name: 'Ananya Sharma', role: 'B.Tech CSE, 3rd Year', text: 'Galgotias University\'s campus management system made tracking my attendance and grades so easy. The timetable feature is a lifesaver during exam season!', avatar: '👩‍🎓' },
    { name: 'Dr. Rajesh Kumar', role: 'Professor, School of Computing', text: 'I can mark attendance for 60 students in seconds. The analytics dashboard helps me identify struggling students early and provide timely support.', avatar: '👨‍🏫' },
    { name: 'Administration Office', role: 'Galgotias University', text: 'Complete visibility into enrollment trends, course lifecycle, and grade distributions across all schools. A true game-changer for our Greater Noida campus.', avatar: '🏛️' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero" id="hero" style={{ overflow: 'hidden' }}>

        
        {/* Background Image */}
        <motion.div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'url(/images/campus_hero.png)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.15, zIndex: 0,
          y: heroY
        }} />

        <motion.div 
          className="hero-content" 
          style={{ position: 'relative', zIndex: 2, maxWidth: 800 }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-badge" variants={itemVariants} style={{ animation: 'none', opacity: 1, transform: 'none' }}>
            <motion.span 
              className="dot" 
              animate={{ opacity: [1, 0.5, 1] }} 
              transition={{ duration: 2, repeat: Infinity }}
              style={{ animation: 'none' }}
            ></motion.span>
            Galgotias University — Smart Campus
          </motion.div>
          <motion.h1 variants={itemVariants} style={{ animation: 'none', opacity: 1, transform: 'none' }}>
            Galgotias University<br />
            <span className="gradient-text">Campus Management</span>
          </motion.h1>
          <motion.p variants={itemVariants} style={{ fontSize: '1.15rem', lineHeight: 1.7, animation: 'none', opacity: 1, transform: 'none' }}>
            A unified platform for students, faculty, and administrators at Galgotias University, Greater Noida
            to manage courses, attendance, grades, and campus communication — all in one place.
          </motion.p>
          <motion.div className="hero-buttons" style={{ gap: '1rem', marginTop: '2rem', animation: 'none', opacity: 1, transform: 'none' }} variants={itemVariants}>
            <motion.div style={{ display: 'inline-block', x: smoothX, y: smoothY }}>
              <motion.a href="http://localhost:5174" className="btn-primary" style={{ padding: '14px 36px', fontSize: '1.05rem', display: 'inline-block' }} animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} whileHover={{ scale: 1.05, boxShadow: '0 8px 30px var(--accent-glow)' }} whileTap={{ scale: 0.95 }}>
                🚀 Open Dashboard
              </motion.a>
            </motion.div>
            <motion.div style={{ display: 'inline-block', x: smoothXReverse, y: smoothYReverse }}>
              <motion.a href="http://localhost:5174/register" className="btn-secondary" style={{ padding: '14px 36px', fontSize: '1.05rem', display: 'inline-block' }} animate={{ y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }} whileHover={{ scale: 1.05, backgroundColor: 'var(--bg-glass)', borderColor: 'var(--accent-primary)' }} whileTap={{ scale: 0.95 }}>
                ✨ Sign Up Free
              </motion.a>
            </motion.div>
          </motion.div>
          <motion.div className="hero-stats" style={{ marginTop: '3rem', animation: 'none', opacity: 1, transform: 'none' }} variants={itemVariants}>
            <div className="stat">
              <div className="stat-value">{counts.students}+</div>
              <div className="stat-label">Students</div>
            </div>
            <div className="stat">
              <div className="stat-value">{counts.courses}+</div>
              <div className="stat-label">Courses</div>
            </div>
            <div className="stat">
              <div className="stat-value">{counts.uptime}%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section style={{
        padding: '80px 5%', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(180deg, #0a0e17 0%, #111827 100%)',
      }}>
        <motion.div 
          style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 2 }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="label" style={{ color: '#6366f1', fontSize: '0.85rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
            ✦ Dashboard Preview
          </motion.div>
          <motion.h2 variants={itemVariants} style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16 }}>
            Powerful <span className="gradient-text">Analytics</span> at Your Fingertips
          </motion.h2>
          <motion.p variants={itemVariants} style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: 40 }}>
            Real-time charts, attendance trends, grade distributions, and enrollment insights for 
            Galgotias University — all tailored to your role.
          </motion.p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 100, rotateX: 10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ type: 'spring', stiffness: 50, damping: 20, delay: 0.2 }}
          style={{
            maxWidth: 900, margin: '0 auto', borderRadius: 16,
            border: '1px solid rgba(99,102,241,0.2)',
            boxShadow: '0 25px 80px rgba(99,102,241,0.15), 0 0 60px rgba(99,102,241,0.05)',
            overflow: 'hidden', position: 'relative', zIndex: 2,
            perspective: 1000
          }}>
          <img src="/images/dashboard_illustration.png" alt="Galgotias University Dashboard"
            style={{ width: '100%', display: 'block', borderRadius: 16 }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 60%, #0a0e17 100%)',
            borderRadius: 16,
          }} />
        </motion.div>
      </section>

      {/* FEATURES WITH IMAGES */}
      <section className="features" id="features" style={{
        padding: '100px 5%',
        backgroundImage: 'url(/images/pattern_bg.png)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,14,23,0.88)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="label">Core Features</motion.div>
            <motion.h2 variants={itemVariants}>Everything Galgotias University Needs</motion.h2>
            <motion.p variants={itemVariants}>Built with modern web technologies for performance, security, and scalability.</motion.p>
          </motion.div>

          {features.map((f, i) => (
            <motion.div 
              key={i} 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.2 }}
              variants={{
                hidden: { opacity: 0, x: i % 2 === 0 ? -50 : 50 },
                visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 50, damping: 20 } }
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 60,
                maxWidth: 1000, margin: '0 auto 60px',
                flexDirection: i % 2 === 0 ? 'row' : 'row-reverse',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{f.icon}</div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12 }}>{f.title}</h3>
                <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '1.05rem' }}>{f.desc}</p>
                <motion.a 
                  href="http://localhost:5174" 
                  whileHover={{ x: 5 }}
                  style={{
                    display: 'inline-block', marginTop: 20, color: '#6366f1',
                    fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem',
                  }}>
                  Learn more →
                </motion.a>
              </div>
              <motion.div 
                whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                style={{
                  flex: 1, minWidth: 280, borderRadius: 16,
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <img src={f.img} alt={f.title} style={{ width: '100%', display: 'block', borderRadius: 16 }} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ROLE CARDS */}
      <section style={{
        padding: '100px 5%',
        background: 'linear-gradient(180deg, #111827 0%, #0a0e17 100%)',
      }}>
        <motion.div 
          style={{ textAlign: 'center', marginBottom: 50, position: 'relative', zIndex: 2 }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="label" style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
            ✦ Role-Based Access
          </motion.div>
          <motion.h2 variants={itemVariants} style={{ fontSize: '2.5rem', fontWeight: 800 }}>
            Tailored for <span className="gradient-text">Everyone</span>
          </motion.h2>
        </motion.div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={containerVariants}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24, maxWidth: 1000, margin: '0 auto',
            position: 'relative', zIndex: 2
          }}
        >
          {modules.map((m, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ 
                y: -12, 
                boxShadow: `0 25px 60px ${m.color}20`,
                borderColor: `${m.color}60`,
                scale: 1.02
              }}
              style={{
                background: 'rgba(17,24,39,0.6)', borderRadius: 16,
                border: `1px solid ${m.color}20`, padding: '36px 28px',
                backdropFilter: 'blur(12px)',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>{m.icon}</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 6, color: m.color }}>{m.title}</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {m.items.map((item, j) => (
                  <li key={j} style={{
                    padding: '8px 0', color: '#94a3b8', fontSize: '0.95rem',
                    borderBottom: j < m.items.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <span style={{ color: m.color, fontSize: '0.8rem' }}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{
        padding: '100px 5%', position: 'relative',
        background: '#0a0e17',
      }}>
        <motion.div 
          style={{ textAlign: 'center', marginBottom: 50, position: 'relative', zIndex: 2 }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="label" style={{ color: '#a78bfa', fontSize: '0.85rem', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
            ✦ What Our Community Says
          </motion.div>
          <motion.h2 variants={itemVariants} style={{ fontSize: '2.5rem', fontWeight: 800 }}>
            Loved by <span className="gradient-text">Galgotias Community</span>
          </motion.h2>
        </motion.div>
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={containerVariants}
          style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24, maxWidth: 1000, margin: '0 auto',
            position: 'relative', zIndex: 2
          }}
        >
          {testimonials.map((t, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))',
                borderRadius: 16, padding: '32px 24px',
                border: '1px solid rgba(255,255,255,0.06)',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', top: 16, right: 20, fontSize: '3rem', opacity: 0.08, fontWeight: 800 }}>"</div>
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>{t.avatar}</div>
              <p style={{ color: '#cbd5e1', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: 20, fontStyle: 'italic' }}>
                "{t.text}"
              </p>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{t.name}</div>
                <div style={{ color: '#6366f1', fontSize: '0.8rem', fontWeight: 500 }}>{t.role}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA SECTION */}
      <section style={{
        padding: '100px 5%', textAlign: 'center', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(16,185,129,0.08))',
      }}>
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)',
            top: '-300px', left: '50%', transform: 'translateX(-50%)',
          }} 
        />
        <motion.div 
          style={{ position: 'relative', zIndex: 2, maxWidth: 600, margin: '0 auto' }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
            Ready to <span className="gradient-text">Transform</span> Your Campus Experience?
          </motion.h2>
          <motion.p variants={itemVariants} style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: 32 }}>
            Join the Galgotias University community using smart campus management to streamline academic operations.
          </motion.p>
          <motion.div variants={itemVariants} style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <motion.div style={{ display: 'inline-block', x: smoothX, y: smoothY }}>
              <motion.a href="http://localhost:5174/register" className="btn-primary"
                animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)' }}
                whileTap={{ scale: 0.95 }}
                style={{ padding: '16px 40px', fontSize: '1.1rem', borderRadius: 12, display: 'inline-block' }}>
                🎓 Get Started Free
              </motion.a>
            </motion.div>
            <motion.div style={{ display: 'inline-block', x: smoothXReverse, y: smoothYReverse }}>
              <motion.a href="http://localhost:5174" className="btn-secondary"
                animate={{ y: [0, -8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                whileTap={{ scale: 0.95 }}
                style={{ padding: '16px 40px', fontSize: '1.1rem', borderRadius: 12, display: 'inline-block' }}>
                📊 View Demo
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>


      <Footer />

      {/* FIXED FLOATING ACTION BUTTON */}
      <motion.div style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 100, x: smoothX, y: smoothY }}>
        <motion.a 
          href="http://localhost:5174/register" 
          className="btn-primary"
          style={{ 
            padding: '16px 32px', borderRadius: '50px',
            boxShadow: '0 10px 40px rgba(99,102,241,0.5)',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
          transition={{ 
            opacity: { duration: 0.5 },
            scale: { type: 'spring', stiffness: 200, damping: 15 },
            y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } 
          }}
          whileHover={{ scale: 1.1, boxShadow: '0 15px 50px rgba(99,102,241,0.8)' }}
          whileTap={{ scale: 0.95 }}
        >
          <span>🚀</span> Get Started Free
        </motion.a>
      </motion.div>
    </>
  );
}
