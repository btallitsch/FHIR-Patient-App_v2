// import React from "react";
import { Header } from "./components/Header/Header";
import { ConceptRulesPage } from "./pages/ConceptRulesPage";
import Patient from './pages/Patient';
import Settings from './pages/Settings';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import "./index.css";

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        {/* Persistent Sidebar Left Layout */}
        <Sidebar />

        {/* Dynamic Main Content Window */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route index element={<ConceptRulesPage />} />
            <Route path="/patient" element={<Patient />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

