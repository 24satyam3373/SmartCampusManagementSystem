import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Modules from './pages/Modules';
import Contact from './pages/Contact';
import CustomCursor from './components/CustomCursor';
import ParticleCanvas from './components/ParticleCanvas';
import { motion } from 'framer-motion';

const GlobalShapes = () => {
  const antiGravityVariants = {
    animate: {
      y: [0, -30, 0],
      rotate: [0, 5, -5, 0],
      transition: { duration: 10, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  return (
    <div className="global-bg-shapes">
      <motion.div className="shape" variants={antiGravityVariants} animate="animate" style={{ animation: 'none' }}></motion.div>
      <motion.div className="shape" variants={antiGravityVariants} animate={{ y: [0, 40, 0], rotate: [0, -10, 0], transition: { duration: 12, repeat: Infinity, ease: 'easeInOut' } }} style={{ animation: 'none' }}></motion.div>
      <motion.div className="shape" variants={antiGravityVariants} animate={{ y: [0, -20, 0], x: [0, 20, 0], transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' } }} style={{ animation: 'none' }}></motion.div>
    </div>
  );
};
function App() {
  return (
    <Router>
      <CustomCursor />
      <GlobalShapes />
      <ParticleCanvas />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/modules" element={<Modules />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
