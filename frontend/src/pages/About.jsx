import { motion } from 'framer-motion';
import Footer from '../components/Footer';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
  };

  return (
    <div className="about-page">
      <motion.div 
        className="section-header"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="label">University Overview</motion.div>
        <motion.h2 variants={itemVariants}>Galgotias University</motion.h2>
        <motion.p variants={itemVariants}>Established in 2011, Galgotias University has emerged as a premier institution of higher education in India.</motion.p>
      </motion.div>

      <motion.div 
        className="about-content"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="university-image-container" style={{ marginBottom: '3rem', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <img src="/galgotias_university_campus_1778788607122.png" alt="Galgotias University Campus" style={{ width: '100%', display: 'block' }} />
        </motion.div>

        <motion.h2 variants={itemVariants}>Introduction</motion.h2>
        <motion.p variants={itemVariants}>
          Galgotias University, located in Greater Noida, Uttar Pradesh, is a private institution that has rapidly gained recognition for its commitment to academic excellence. Accredited by the National Assessment and Accreditation Council (NAAC) with an <strong>A+ grade</strong>, the university offers a multidisciplinary learning environment that fosters research, innovation, and holistic development.
        </motion.p>

        <motion.h2 variants={itemVariants}>Our Heritage</motion.h2>
        <motion.p variants={itemVariants}>
          The legacy of Galgotias in education dates back to 1933. Before the establishment of the university in 2011, the group launched the Galgotias College of Engineering and Technology (GCET) in 2000. Today, the university serves over 30,000 students across 20+ specialized schools, providing over 200 programs from diplomas to PhDs.
        </motion.p>

        <motion.h2 variants={itemVariants}>Vision & Mission</motion.h2>
        <div className="mission-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', margin: '2rem 0' }}>
          {[
            { title: "Academic Success", desc: "Enabling a teaching-learning ecosystem to support research and governance." },
            { title: "State-of-the-Art Facilities", desc: "Establishing world-class infrastructure for impactful education." },
            { title: "Global Collaboration", desc: "Partnering with global stakeholders to align with new-age curricula." },
            { title: "Societal Outreach", desc: "Providing sustainable and ethical solutions to societal concerns." }
          ].map((m, i) => (
            <motion.div key={i} variants={itemVariants} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' }}>
              <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem', fontWeight: 700 }}>{m.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{m.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.h2 variants={itemVariants}>Schools of Excellence</motion.h2>
        <motion.p variants={itemVariants}>
          The university operates through various specialized schools, including the School of Computer Science and Engineering, School of Business, School of Law, and School of Media & Communication Studies, ensuring students receive specialized training in their chosen fields.
        </motion.p>

        <motion.h2 variants={itemVariants}>Digital Transformation</motion.h2>
        <motion.p variants={itemVariants}>
          As part of our commitment to innovation, the <strong>Smart Campus Management System (SCMS)</strong> digitizes core operations, providing a unified platform for students, faculty, and administrators to interact seamlessly. From attendance tracking to fee management, SCMS ensures a transparent and efficient campus experience.
        </motion.p>
      </motion.div>

      <Footer />
    </div>
  );
}
