
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import WaterPoints from './components/WaterPoints';
import AIPredictions from './components/AIPredictions';
import MapView from './components/MapView';
import FieldReports from './components/FieldReports';
import Maintenance from './components/Maintenance';
import Community from './components/Community';
import UserManagement from './components/UserManagement';
import Notifications from './components/Notifications';
import Auth from './components/Auth';
// Added missing Mail icon import
import { Droplet, X, Menu, Bell, Mail } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Shared filter state for Map and Dashboard
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    // Check local storage for session
    const session = localStorage.getItem('mionjo_session');
    if (session) setIsAuthenticated(true);
    
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('mionjo_session', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('mionjo_session');
    setIsAuthenticated(false);
  };

  const resetFilters = () => {
    setFilterStatus('all');
    setFilterType('all');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard filterStatus={filterStatus} filterType={filterType} onResetFilters={resetFilters} />;
      case 'water_points':
        return <WaterPoints />;
      case 'map':
        return (
          <MapView 
            filterStatus={filterStatus} 
            setFilterStatus={setFilterStatus} 
            filterType={filterType} 
            setFilterType={setFilterType} 
          />
        );
      case 'ai':
        return <AIPredictions />;
      case 'reports':
        return <FieldReports />;
      case 'maintenance':
        return <Maintenance />;
      case 'community':
        return <Community />;
      case 'admin_users':
        return <UserManagement />;
      case 'notifications':
        return <Notifications />;
      default:
        return (
          <div className="flex items-center justify-center h-[70vh] text-slate-400">
            <p className="text-lg">Section "{activeSection}" en cours de construction...</p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin"></div>
          <Droplet className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-600" size={24} />
        </div>
        <p className="text-slate-500 font-medium animate-pulse tracking-wide">MIONJO - Chargement des systèmes...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  const hasActiveFilters = filterStatus !== 'all' || filterType !== 'all';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <Sidebar 
        activeSection={activeSection} 
        onNavigate={setActiveSection} 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
      />
      
      {/* Mobile Top Bar */}
      <header className="lg:hidden h-16 bg-[#0e7490] text-white flex items-center justify-between px-6 sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
           <button onClick={() => setSidebarOpen(true)} className="p-1 hover:bg-white/10 rounded-lg">
             <Menu size={24} />
           </button>
           <h1 className="text-xl font-bold tracking-tight">MIONJO</h1>
        </div>
        <button 
          onClick={() => setActiveSection('notifications')}
          className="p-2 bg-white/10 rounded-full"
        >
          <Bell size={20} />
        </button>
      </header>

      <main className="flex-1 lg:ml-64 p-4 md:p-8 min-h-screen overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Global Filter Indicator */}
          {hasActiveFilters && activeSection === 'dashboard' && (
            <div className="mb-6 flex items-center gap-2 px-4 py-2 bg-cyan-50 border border-cyan-100 rounded-2xl w-fit animate-fadeIn shadow-sm">
              <span className="text-[10px] font-extrabold text-cyan-700 uppercase tracking-widest">Filtres:</span>
              <div className="flex gap-2">
                {filterStatus !== 'all' && (
                  <span className="text-[10px] bg-cyan-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 capitalize font-bold">
                    {filterStatus}
                  </span>
                )}
                {filterType !== 'all' && (
                  <span className="text-[10px] bg-cyan-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 capitalize font-bold">
                    {filterType.replace('_', ' ')}
                  </span>
                )}
              </div>
              <button 
                onClick={resetFilters}
                className="ml-1 p-1 hover:bg-cyan-200 rounded-full text-cyan-700 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          )}

          {renderContent()}
        </div>
      </main>

      {/* Global Notifications Toast */}
      <div className="fixed bottom-6 right-6 z-[9999] hidden md:block">
        <button 
          onClick={() => setActiveSection('notifications')}
          className="bg-white shadow-2xl rounded-[1.5rem] p-4 border border-slate-100 flex items-center gap-4 max-w-sm animate-fadeIn hover:bg-slate-50 transition-colors text-left"
        >
           <div className="p-2.5 bg-cyan-100 text-cyan-600 rounded-2xl shrink-0">
             <Mail size={20} />
           </div>
           <div>
             <p className="text-sm font-bold text-slate-800">Journal des Emails</p>
             <p className="text-xs text-slate-500 leading-tight">Consultez l'historique des notifications critiques envoyées par email.</p>
           </div>
        </button>
      </div>
    </div>
  );
};

export default App;
