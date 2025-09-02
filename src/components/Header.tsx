import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onOpenAppointment: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAppointment }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="navbar">
          <a href="#" className="logo">
            <i className="fas fa-tooth"></i> Dental<span>Espejo</span>
          </a>
          <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            <li><a href="#home" onClick={() => scrollToSection('home')}>Inicio</a></li>
            <li><a href="#services" onClick={() => scrollToSection('services')}>Servicios</a></li>
            <li><a href="#about" onClick={() => scrollToSection('about')}>Especialistas</a></li>
            <li><a href="#testimonials" onClick={() => scrollToSection('testimonials')}>Pacientes</a></li>
            <li><a href="#gallery" onClick={() => scrollToSection('gallery')}>Galería</a></li>
            <li><a href="#" className="nav-cta" onClick={(e) => { e.preventDefault(); onOpenAppointment(); }}>Agendar</a></li>
          </ul>
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
