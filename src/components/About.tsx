import React from 'react';

interface AboutProps {
  onOpenAppointment: () => void;
}

const About: React.FC<AboutProps> = ({ onOpenAppointment }) => {
  const features = [
    {
      icon: "fas fa-graduation-cap",
      title: "Formación Académica",
      description: "Universidad Nacional Autónoma de México, Especialidad en Harvard Dental School"
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
            <img src="https://images.pexels.com/photos/3779704/pexels-photo-3779704.jpeg" alt="Dr. Carlos Méndez" />
          </div>
          <div className="image-badge patients">
            <span className="number">3,200</span>
            <span>Pacientes atendidos</span>
          </div>
        </div>

        <div className="about-content">
          <span className="section-subtitle">Nuestro Equipo</span>
          <h2 className="section-title">Conoce al <span>Dr. Carlos Méndez</span></h2>
          <p className="about-text">Especialista en rehabilitación oral y estética dental con certificaciones internacionales. El Dr. Méndez combina precisión técnica con un enfoque artístico para crear sonrisas naturales y armoniosas.</p>
          
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
              <i className="fas fa-calendar-alt"></i> Agendar consulta
            </a>
            <a href="#" className="btn btn-outline">
              <i className="fas fa-user-md"></i> Conoce al equipo completo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
