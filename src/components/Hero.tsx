import React from 'react';
import dentalespejoImage from '../assets/dentalespejo.jpg';

interface HeroProps {
  onOpenAppointment: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenAppointment }) => {

  return (
    <section id="home" className="hero">
      <div className="hero-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      <div className="container">
        <div className="hero-content">
          <span className="section-subtitle">Bienvenido a DentalEspejo</span>
          <h1 className="hero-title">Cuidado dental <span>excepcional</span> para toda la familia</h1>
          <p className="hero-text">Tecnología de vanguardia con un enfoque humano. Descubre la diferencia de una atención dental personalizada.</p>
          <div className="hero-buttons">
            <a href="#" className="btn btn-primary" onClick={(e) => { e.preventDefault(); onOpenAppointment(); }}>
              <i className="fas fa-calendar-check"></i> Agenda Cita Gratis
            </a>
          </div>
          <div className="hero-features">
            <div className="feature">
              <i className="fas fa-check-circle"></i>
              <span>15+ años de experiencia</span>
            </div>
            <div className="feature">
              <i className="fas fa-check-circle"></i>
              <span>Tecnología digital</span>
            </div>
            <div className="feature">
              <i className="fas fa-check-circle"></i>
              <span>Financiamiento disponible</span>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <img src={dentalespejoImage} alt="Dra. Ana López sonriendo" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
