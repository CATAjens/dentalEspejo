import React from 'react';
import pacienteunoImage from '../assets/pacienteuno.jpg';
import pacientecuatroImage from '../assets/pacientecuatro.jpg';
import pacientetresImage from '../assets/pacientetres.jpg';
import pacientedosImage from '../assets/pacientedos.jpg';

const Gallery: React.FC = () => {
  const galleryItems = [
    {
      image: pacientetresImage,
      title: "Implantes",
      description: "Tratamiento integral",
      alt: "Implantes"
    },
    {
      image: pacienteunoImage,
      title: "Brackets",
      description: "Tratamiento de 12 meses",
      alt: "Brackets"
    },
    {
      image: pacientecuatroImage,
      title: "Prótesis",
      description: "Años de garantía",
      alt: "Prótesis"
    },
    {
      image: pacientedosImage,
      title: "Endodoncias",
      description: "Rehabilitación completa",
      alt: "Endodoncias"
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
