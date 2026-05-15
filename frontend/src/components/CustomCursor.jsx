import { useEffect, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    
    let isVisible = false;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!isVisible) {
        isVisible = true;
        if (dot) dot.style.opacity = 1;
        if (ring) ring.style.opacity = 1;
      }
      
      if (dot) {
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
      }
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (ring) {
        ring.style.left = `${ringX}px`;
        ring.style.top = `${ringY}px`;
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    requestAnimationFrame(animate);

    const handleMouseOver = (e) => {
      const isClickable = e.target.closest('a, button, input, textarea, select, [role="button"], .MuiButtonBase-root');
      if (isClickable) {
        if (dot) dot.classList.add('active');
        if (ring) ring.classList.add('active');
      } else {
        if (dot) dot.classList.remove('active');
        if (ring) ring.classList.remove('active');
      }
    };
    
    const handleMouseLeave = () => {
      isVisible = false;
      if (dot) dot.style.opacity = 0;
      if (ring) ring.style.opacity = 0;
    };
    
    const handleMouseEnter = () => {
      isVisible = true;
      if (dot) dot.style.opacity = 1;
      if (ring) ring.style.opacity = 1;
    };

    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor-dot" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
}
