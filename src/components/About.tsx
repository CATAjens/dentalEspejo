import React from 'react';
import doctoraImage from '../assets/doctora.jpg';

interface AboutProps {
  onOpenAppointment: () => void;
}

const About: React.FC<AboutProps> = ({ onOpenAppointment }) => {
  const features = [
    {
      icon: "fas fa-graduation-cap",
      title: "Formación Académica",
      description: "Universidad Nacional, Especialidad en Dental estetica"
    },
    {
      icon: "fas fa-award",
      title: "Certificaciones",
      description: "Invisalign Diamond Provider, Diplomado en Implantología Avanzada"
    },
    {
      icon: "fas fa-heart",
      title: "Filosofía",
      description: "\"Cada sonrisa cuenta una historia única que merece ser perfecta\""
    }
  ];

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-image">
          <div className="image-main">
            <img src={doctoraImage} alt="Dra. Lisseth Huallpa" />
          </div>
        </div>

        <div className="about-content">
          <span className="section-subtitle">Nuestro Equipo</span>
          <h2 className="section-title">Conoce ala <span>Dra. Lisseth Huallpa Espejo</span></h2>
          <p className="about-text">Especialista en rehabilitación oral y estética dental con certificaciones acreditadas. La Dra. Lisseth combina precisión técnica con un enfoque artístico para crear sonrisas naturales y armoniosas.</p>
          
          <div className="about-features">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <i className={feature.icon}></i>
                <div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="about-buttons">
            <a href="#" className="btn btn-primary" onClick={(e) => { e.preventDefault(); onOpenAppointment(); }}>
              <i className="fas fa-phone"></i> Agendar consulta
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
