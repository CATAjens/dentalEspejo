
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppFloat from './components/WhatsAppFloat';
import AppointmentModal from './components/AppointmentModal';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <>
              <Header />
              <Hero onOpenAppointment={openAppointmentModal} />
              <Services onOpenAppointment={openAppointmentModal} />
              <About onOpenAppointment={openAppointmentModal} />
              <Gallery />
              <Contact />
              <Footer />
              <WhatsAppFloat />
              <AppointmentModal
                isOpen={isAppointmentModalOpen}
                onClose={closeAppointmentModal}
                onAppointmentCreated={() => {
                  // Opcional: mostrar notificación o recargar datos
                }}
              />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
