
import React, { useState } from 'react';
import { Droplets, Search, Filter, Plus, MapPin, X, Save } from 'lucide-react';
import { mockWaterPoints } from '../mockData';
import { WaterPointStatus } from '../types';

const WaterPoints: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredPoints = mockWaterPoints.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.commune.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: WaterPointStatus) => {
    switch (status) {
      case 'actif': return 'bg-green-100 text-green-700';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700';
      case 'panne': return 'bg-red-100 text-red-700';
      case 'inactif': return 'bg-gray-100 text-gray-700';
      case 'en_construction': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setShowModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Points d'eau</h2>
          <p className="text-slate-500">Gérez l'inventaire complet des infrastructures</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#0e7490] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#0891b2] transition-colors shadow-sm font-bold"
        >
          <Plus size={20} />
          Nouveau point d'eau
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par nom, commune, village..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
          <Filter size={18} />
          Filtres
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPoints.map((point) => (
          <div key={point.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
                  <Droplets size={24} />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(point.status)}`}>
                  {point.status.replace('_', ' ')}
                </span>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">{point.name}</h3>
                <div className="flex items-center gap-1 text-slate-400 text-sm">
                  <MapPin size={14} />
                  {point.commune}, {point.region}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Type</p>
                  <p className="text-sm font-semibold text-slate-700 capitalize">{point.type.replace('_', ' ')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Qualité</p>
                  <p className="text-sm font-semibold text-slate-700 capitalize">{point.water_quality}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Desservit</span>
                  <span className="text-sm font-bold text-slate-700">{point.population_served.toLocaleString()} hab.</span>
                </div>
                <button className="text-cyan-600 text-sm font-bold hover:text-cyan-700">
                  Détails →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nouveau Point d'eau */}
      {showModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleIn">
            <div className="bg-[#0e7490] p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Nouveau Point d'Eau</h3>
                <p className="text-white/70 text-sm">Renseignez les informations de l'infrastructure</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-8 space-y-6">
              {isSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Save size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">Point d'eau enregistré !</h4>
                  <p className="text-slate-500">L'infrastructure a été ajoutée avec succès au système.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nom de l'ouvrage</label>
                      <input type="text" required placeholder="ex: Forage Beloha 2" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Type</label>
                      <select required className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none font-medium">
                        <option value="forage">Forage</option>
                        <option value="puits">Puits</option>
                        <option value="source">Source</option>
                        <option value="borne_fontaine">Borne Fontaine</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Commune</label>
                      <input type="text" required className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Capacité journalière (L)</label>
                      <input type="number" required className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none font-medium" />
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-700">Annuler</button>
                    <button type="submit" className="bg-[#0e7490] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#0891b2] transition-colors shadow-lg shadow-cyan-900/20">
                      Enregistrer l'infrastructure
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterPoints;
