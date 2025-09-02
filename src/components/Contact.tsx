import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    alert('¡Mensaje enviado! Nos pondremos en contacto contigo pronto.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: "fas fa-map-marker-alt",
      title: "Ubicación",
      content: "Av. Dental 123, Col. Sonrisa Perfecta<br>Ciudad de México, CDMX"
    },
    {
      icon: "fas fa-phone-alt",
      title: "Teléfonos",
      content: "+52 55 1234 5678<br>Emergencias: +52 55 9876 5432"
    },
    {
      icon: "fas fa-envelope",
      title: "Correo electrónico",
      content: "contacto@dentalespejo.com<br>citas@dentalespejo.com"
    },
    {
      icon: "fas fa-clock",
      title: "Horario",
      content: "Lunes a Viernes: 9:00 - 19:00<br>Sábados: 9:00 - 14:00"
    }
  ];

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact-content">
          <div className="section-header">
            <span className="section-subtitle">Contacto</span>
            <h2 className="section-title">Agenda tu <span>consulta</span></h2>
            <p className="section-text">Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas.</p>
          </div>
          
          <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  placeholder="Nombre completo" 
                  value={formData.name}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder="Correo electrónico" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  placeholder="Teléfono" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-group">
                <select 
                  id="service" 
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                >
                  <option value="">Servicio de interés</option>
                  <option value="ortodoncia">Ortodoncia</option>
                  <option value="implantes">Implantes</option>
                  <option value="blanqueamiento">Blanqueamiento</option>
                  <option value="diseno">Diseño de Sonrisa</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
            </div>
            
            <div className="form-group">
              <textarea 
                id="message" 
                name="message" 
                placeholder="Cuéntanos sobre tu caso..." 
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
              ></textarea>
            </div>
            
            <button type="submit" className="btn btn-primary btn-block">
              <i className="fas fa-paper-plane"></i> Enviar mensaje
            </button>
          </form>
        </div>
        
        <div className="contact-info">
          {contactInfo.map((info, index) => (
            <div key={index} className="info-card">
              <div className="info-icon">
                <i className={info.icon}></i>
              </div>
              <div className="info-content">
                <h4>{info.title}</h4>
                <p dangerouslySetInnerHTML={{ __html: info.content }}></p>
              </div>
            </div>
          ))}
          
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.888244552543!2d-99.1776909845336!3d19.42651124592228!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff35f5bd1563%3A0x6c366f0e2de02ff7!2sEl%20%C3%81ngel%20de%20la%20Independencia!5e0!3m2!1ses!2smx!4v1620000000000!5m2!1ses!2smx" 
              width="100%" 
              height="300" 
              style={{border: 0}} 
              allowFullScreen 
              loading="lazy"
              title="Ubicación de DentalEspejo"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
