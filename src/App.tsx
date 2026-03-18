import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './components/Home';
import Login from './components/Login';
import Opinions from './components/Opinions';
import DashboardMetrics from './components/DashboardMetrics';
import Layout from './components/Layout';
import ProfileManagement from './components/ProfileManagement';
import PatientRegistration from './components/PatientRegistration';
import ProfessionalWorkspace from './components/ProfessionalWorkspace';
import ManagementDashboard from './components/ManagementDashboard';
import PacientesList from './components/PacientesList';
import PatientPortal from './components/PatientPortal';
import TriagemPage from './components/TriagemPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<PatientRegistration />} />

          {/* Protected Dashboard Routes with Sidebar */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardMetrics />} />
            <Route path="/portal-paciente" element={<PatientPortal />} />
            <Route path="/pareceres" element={<Opinions />} />
            <Route path="/pacientes" element={<PacientesList />} />
            <Route path="/triagem/:patientId" element={<TriagemPage />} />
            <Route path="/gestao-master" element={<ProfileManagement />} />
            <Route path="/atendimentos" element={<ProfessionalWorkspace />} />
            <Route path="/gestao" element={<ManagementDashboard />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
