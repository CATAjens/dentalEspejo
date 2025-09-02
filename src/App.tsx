
import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Testimonials from './components/Testimonials';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import AppointmentModal from './components/AppointmentModal';
import './App.css';

function App() {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const openAppointmentModal = () => {
    setIsAppointmentModalOpen(true);
  };

  const closeAppointmentModal = () => {
    setIsAppointmentModalOpen(false);
  };

  return (
    <div className="App">
      <Header onOpenAppointment={openAppointmentModal} />
      <Hero onOpenAppointment={openAppointmentModal} />
      <Services onOpenAppointment={openAppointmentModal} />
      <About onOpenAppointment={openAppointmentModal} />
      <Testimonials />
      <Gallery />
      <Contact />
      <Footer />
      <WhatsAppFloat />
      <AppointmentModal 
        isOpen={isAppointmentModalOpen} 
        onClose={closeAppointmentModal} 
      />
    </div>
  );
}

export default App;
