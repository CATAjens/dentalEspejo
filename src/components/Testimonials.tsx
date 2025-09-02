import React from 'react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "María González",
      image: "https://randomuser.me/api/portraits/women/43.jpg",
      text: "Después de años de complejos por mis dientes, el Dr. Méndez me devolvió la confianza. El proceso fue más rápido y cómodo de lo que imaginé. ¡Ahora no puedo dejar de sonreír!",
      treatment: "Ortodoncia Invisible"
    },
    {
      name: "Carlos Ruiz",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      text: "Los implantes que me colocaron son idénticos a mis dientes naturales. Nadie nota la diferencia. El equipo fue excelente en todo momento, muy profesionales.",
      treatment: "Implantes Dentales"
    },
    {
      name: "Laura Sánchez",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      text: "Llevo a mis dos hijos desde que eran pequeños y siempre tienen una experiencia positiva. La Dra. Pérez tiene una manera especial con los niños.",
      treatment: "Odontopediatría"
    }
  ];

  return (
    <section id="testimonials" className="testimonials">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Testimonios</span>
          <h2 className="section-title">Historias de <span>nuestros pacientes</span></h2>
          <p className="section-text">Descubre las experiencias reales de personas que han transformado su sonrisa con nosotros.</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-header">
                <img src={testimonial.image} alt={testimonial.name} />
                <div className="testimonial-author">
                  <h4>{testimonial.name}</h4>
                  <div className="stars">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                </div>
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-footer">
                <span className="treatment">{testimonial.treatment}</span>
                <a href="#" className="view-more">Ver antes/después</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
