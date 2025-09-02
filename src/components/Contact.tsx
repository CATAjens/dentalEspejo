import React from 'react';

const Contact: React.FC = () => {

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Contacto</span>
          <h2 className="section-title">Información de <span>contacto</span></h2>
        </div>
        
        <div className="contact-layout">
          <div className="contact-info-grid">
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="info-content">
                <h4>Ubicación</h4>
                <p>Calle Nueva N°: 438 Ciudad Cusco - Perú</p>
              </div>
            </div>
            
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <div className="info-content">
                <h4>Teléfono</h4>
                <p>+51 964689186</p>
              </div>
            </div>
            

            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="info-content">
                <h4>Horario</h4>
                <p dangerouslySetInnerHTML={{ __html: "Lunes a Viernes: 9:00 - 19:00<br>Sábados: 9:00 - 14:00" }}></p>
              </div>
            </div>
          </div>
          
          <div className="map-container">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4613.225519858619!2d-71.98163274521183!3d-13.520562790935077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916dd675dae0bcb1%3A0x2a3e7cbe9acb03b5!2sC.%20Nueva%20438%2C%20Cusco%2008002!5e0!3m2!1ses!2spe!4v1756855186465!5m2!1ses!2spe" 
              width="100%" 
              height="400" 
              style={{border: 0}} 
              allowFullScreen 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de DentalEspejo - Cusco"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
