import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ComplianceRules from './pages/ComplianceRules';
import { AppProvider, AppContext } from './context/AppContext';

// Protected Route Component
const ProtectedDashboardRoute = ({ children }) => {
  const { currentUser } = React.useContext(AppContext);
  if (!currentUser) {
    return <Navigate to="/register" replace />;
  }
  if (!currentUser.hasAcceptedRules) {
    return <Navigate to="/rules" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/rules" element={<ComplianceRules />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedDashboardRoute>
            <CompanyDashboard />
          </ProtectedDashboardRoute>
        } 
      />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main id="main-content" className="flex-grow-1">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
