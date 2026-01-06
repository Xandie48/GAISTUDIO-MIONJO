
import React from 'react';
import { 
  LayoutDashboard, 
  Droplets, 
  Map as MapIcon, 
  AlertCircle, 
  Wrench, 
  BrainCircuit, 
  Users, 
  LogOut,
  Droplet,
  X
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, onNavigate, isOpen, onToggle, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'water_points', label: 'Points d\'eau', icon: Droplets },
    { id: 'map', label: 'Vue carte', icon: MapIcon },
    { id: 'reports', label: 'Signalements', icon: AlertCircle },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'ai', label: 'Prédictions IA', icon: BrainCircuit },
    { id: 'community', label: 'Communauté', icon: Users },
  ];

  const sidebarClasses = `
    fixed left-0 top-0 h-full bg-[#0e7490] text-white z-[60] transition-all duration-300 ease-in-out
    ${isOpen ? 'translate-x-0 w-72 shadow-2xl' : '-translate-x-full w-72 lg:translate-x-0 lg:w-64'}
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden transition-opacity"
          onClick={onToggle}
        />
      )}

      <div className={sidebarClasses}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-lg">
               <Droplet className="text-[#0e7490]" size={24} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">MIONJO</h1>
          </div>
          <button onClick={onToggle} className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 mt-6 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onNavigate(item.id);
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all text-sm font-medium ${
                    activeSection === item.id
                      ? 'bg-white text-[#0e7490] shadow-lg shadow-cyan-900/30 font-bold translate-x-1'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon size={20} strokeWidth={activeSection === item.id ? 2.5 : 2} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-6 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl mb-4">
            <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center text-[#0e7490] font-extrabold shadow-inner">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">Admin Mionjo</p>
              <p className="text-[10px] text-white/50 truncate uppercase tracking-widest font-bold">Manager</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-white/70 hover:bg-red-500/20 hover:text-red-100 transition-all text-sm font-bold"
          >
            <LogOut size={20} />
            Déconnexion
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
