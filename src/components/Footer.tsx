import React from 'react';

const Footer: React.FC = () => {
  const services = [
    "Ortodoncia Invisible",
    "Implantes Dentales", 
    "Blanqueamiento LED",
    "Diseño de Sonrisa",
    "Odontopediatría"
  ];

  const clinicLinks = [
    "Nuestro Equipo",
    "Tecnología",
    "Galería",
    "Blog",
    "Trabaja con Nosotros"
  ];

  const legalLinks = [
    "Política de Privacidad",
    "Términos de Servicio",
    "Aviso Legal"
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col footer-about">
            <a href="#" className="footer-logo">
              <i className="fas fa-tooth"></i> Dental<span>Espejo</span>
            </a>
            <p>Clínica dental especializada en tratamientos de alta estética y tecnología digital para resultados naturales y duraderos.</p>
            <div className="footer-social">
              <a href="#"><i className="fab fa-facebook-f"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
              <a href="#"><i className="fab fa-tiktok"></i></a>
            </div>
          </div>
          
          <div className="footer-col">
            <h4>Servicios</h4>
            <ul>
              {services.map((service, index) => (
                <li key={index}><a href="#">{service}</a></li>
              ))}
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Clínica</h4>
            <ul>
              {clinicLinks.map((link, index) => (
                <li key={index}><a href="#">{link}</a></li>
              ))}
            </ul>
          </div>
          
          <div className="footer-col">
            <h4>Contacto</h4>
            <ul className="footer-contact">
              <li><i className="fas fa-map-marker-alt"></i> Av. Dental 123, CDMX</li>
              <li><i className="fas fa-phone-alt"></i> +52 55 1234 5678</li>
              <li><i className="fas fa-envelope"></i> contacto@dentalespejo.com</li>
              <li><i className="fas fa-clock"></i> Lun-Vie: 9:00 - 19:00</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">
            &copy; 2023 DentalEspejo. Todos los derechos reservados.
          </div>
          <div className="legal-links">
            {legalLinks.map((link, index) => (
              <a key={index} href="#">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
