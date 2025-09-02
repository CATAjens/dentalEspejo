import React from 'react';

const Gallery: React.FC = () => {
  const galleryItems = [
    {
      image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      title: "Diseño de Sonrisa",
      description: "Carillas de porcelana",
      alt: "Antes y después 1"
    },
    {
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      title: "Ortodoncia",
      description: "Tratamiento de 12 meses",
      alt: "Antes y después 2"
    },
    {
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      title: "Blanqueamiento",
      description: "+6 tonos en 1 sesión",
      alt: "Antes y después 3"
    },
    {
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      title: "Implantes",
      description: "Rehabilitación completa",
      alt: "Antes y después 4"
    }
  ];

  return (
    <section id="gallery" className="gallery">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Galería</span>
          <h2 className="section-title">Resultados <span>reales</span></h2>
          <p className="section-text">Transformaciones dentales que han cambiado la vida de nuestros pacientes.</p>
        </div>
        
        <div className="gallery-grid">
          {galleryItems.map((item, index) => (
            <div key={index} className="gallery-item">
              <img src={item.image} alt={item.alt} />
              <div className="gallery-overlay">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <a href="#" className="gallery-link">Ver caso completo</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
