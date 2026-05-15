import { motion } from 'framer-motion';
import Footer from '../components/Footer';

export default function Modules() {
  const modules = [
    {
      role: 'Admin',
      title: 'Administration Module',
      color: '#f59e0b',
      features: [
        'Create and manage user accounts (Faculty & Students)',
        'Create courses and manage lifecycle states',
        'Assign faculty to courses',
        'Broadcast notifications to targeted roles',
        'View system-wide attendance and grade reports',
        'Full dashboard with analytics and trends',
      ],
    },
    {
      role: 'Faculty',
      title: 'Faculty Module',
      color: '#10b981',
      features: [
        'View assigned courses and enrolled students',
        'Mark bulk attendance with date selection',
        'Grade students with weighted assignments',
        'View course attendance statistics',
        'Auto-computed letter grades and GPA',
        'Receive admin notifications',
      ],
    },
    {
      role: 'Student',
      title: 'Student Module',
      color: '#6366f1',
      features: [
        'Browse available courses and enroll',
        'View enrollment status and course details',
        'Track personal attendance with color-coded status',
        'View grades and cumulative GPA',
        'Course schedule and room information',
        'Receive targeted notifications',
      ],
    },
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
    <div className="modules-page">
      <motion.div 
        className="section-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="label">System Modules</motion.div>
        <motion.h2 variants={itemVariants}>Role-Based Feature Access</motion.h2>
        <motion.p variants={itemVariants}>Each user role has a tailored dashboard experience with specific capabilities.</motion.p>
      </motion.div>
      
      <motion.div 
        className="modules-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={containerVariants}
      >
        {modules.map((m) => (
          <motion.div 
            className="module-card" 
            key={m.role}
            variants={itemVariants}
            whileHover={{ 
              y: -12, 
              boxShadow: `0 25px 60px ${m.color}20`,
              borderColor: `${m.color}60`,
              scale: 1.02
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{ border: `1px solid rgba(255,255,255,0.06)` }}
          >
            <div className="module-role" style={{ color: m.color }}>{m.role}</div>
            <h3>{m.title}</h3>
            <ul>
              {m.features.map((f, i) => (
                <li key={i}>
                  <span style={{ color: m.color, marginRight: '8px', fontSize: '0.8rem' }}>✓</span> {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
      
      <Footer />
    </div>
  );
}
