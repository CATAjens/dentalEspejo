
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import AdminPage from './pages/AdminPage';
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
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/" element={
            <>
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
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
