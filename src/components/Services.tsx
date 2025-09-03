import React from 'react';

interface ServicesProps {
  onOpenAppointment: () => void;
}

const Services: React.FC<ServicesProps> = ({ onOpenAppointment }) => {
  const services = [
    {
      icon: "https://cdn-icons-png.flaticon.com/512/3003/3003184.png",
      title: "Brackets",
      description: "Brackets estéticos y alineadores invisibles con planificación 3D para resultados precisos.",
      alt: "Brackets"
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/3003/3003185.png",
      title: "Prótesis",
      description: "Reemplazo de dientes perdidos con técnicas mínimamente invasivas y rápida recuperación.",
      alt: "Prótesis"
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/3003/3003187.png",
      title: "Endodoncias",
      description: "Técnica profesional para aclarar varios tonos en una sola sesión sin sensibilidad.",
      alt: "Endodoncias"
    },
    {
      icon: "https://cdn-icons-png.flaticon.com/512/3003/3003181.png",
      title: "Implantes",
      description: "Cuidado dental especializado para niños con enfoque lúdico y preventivo.",
      alt: "Implantes"
    }
  ];

  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Nuestros Servicios</span>
          <h2 className="section-title">Tratamientos <span>especializados</span></h2>
          <p className="section-text">Ofrecemos soluciones integrales para cada necesidad dental con tecnología de última generación.</p>
        </div>
        
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                <img src={service.icon} alt={service.alt} />
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <a href="#" className="service-link">
                Más información <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          ))}
        </div>
        
        <div className="services-cta">
          <a href="#" className="btn btn-outline" onClick={(e) => { e.preventDefault(); onOpenAppointment(); }}>
            <i className="fas fa-list-alt"></i> Agendar consulta
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
