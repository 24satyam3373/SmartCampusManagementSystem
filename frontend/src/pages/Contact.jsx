import { useState } from 'react';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';
import ParticleCanvas from '../components/ParticleCanvas';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="contact-page" style={{ 
      backgroundImage: 'url("https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074&auto=format&fit=crop")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      position: 'relative'
    }}>
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.8))',
        zIndex: 0
      }} />
      <ParticleCanvas />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="section-header">
          <div className="label">Get in Touch</div>
          <h2>Contact Us</h2>
          <p>Have questions? Reach out to Galgotias University and we'll get back to you.</p>
        </div>
        <form className="contact-form" onSubmit={handleSubmit} style={{ 
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '40px',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          maxWidth: '600px',
          margin: '0 auto 4rem auto'
        }}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required />
          </div>
          <div className="form-group">
            <label>Subject</label>
            <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="What's this about?" required />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us more..." required style={{ minHeight: '150px' }}></textarea>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1rem', fontWeight: 700 }}>
            {submitted ? '✓ Message Sent!' : 'Send Message'}
          </button>
        </form>
        <Chatbot />
        <Footer />
      </div>
    </div>
  );
}
