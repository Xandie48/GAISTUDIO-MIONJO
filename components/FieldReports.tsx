
import React, { useState } from 'react';
import { AlertCircle, Search, Filter, CheckCircle, Clock, MoreVertical, Plus, X, Save, MapPin } from 'lucide-react';
import { mockFieldReports, mockWaterPoints } from '../mockData';

const FieldReports: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const filteredReports = filter === 'all' 
    ? mockFieldReports 
    : mockFieldReports.filter(r => r.status === filter);

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setShowModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Signalements Terrain</h2>
          <p className="text-slate-500">Gestion des incidents et retours communautaires</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors shadow-sm font-bold"
        >
          <Plus size={20} />
          Signaler un incident
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher un signalement..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-medium"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
          {['all', 'nouveau', 'en_cours', 'résolu'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all ${
                filter === s 
                  ? 'bg-cyan-600 text-white shadow-md' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReports.map((report) => {
          const wp = mockWaterPoints.find(p => p.id === report.water_point_id);
          return (
            <div key={report.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex items-start gap-6 hover:shadow-md transition-shadow">
              <div className={`p-3 rounded-xl shrink-0 ${
                report.priority === 'critique' ? 'bg-red-50 text-red-600' : 
                report.priority === 'haute' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
              }`}>
                <AlertCircle size={24} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-bold text-slate-800">{report.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      report.status === 'nouveau' ? 'bg-blue-100 text-blue-700' :
                      report.status === 'en_cours' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {report.status.replace('_', ' ')}
                    </span>
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 mb-4">{report.description}</p>
                
                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock size={14} />
                    Rapporté le {report.created_at}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <MapPin size={14} />
                    Point d'eau: <span className="font-bold text-slate-600">{wp?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                    Priorité: <span className="font-bold text-slate-600 uppercase">{report.priority}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nouveau Signalement */}
      {showModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleIn">
            <div className="bg-red-600 p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold">Signaler un Problème</h3>
                <p className="text-white/70 text-sm">Remontée d'incident terrain en temps réel</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateReport} className="p-8 space-y-6">
              {isSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">Signalement envoyé !</h4>
                  <p className="text-slate-500">L'incident a été enregistré et notifié aux techniciens.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Point d'eau concerné</label>
                      <select required className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:outline-none font-medium">
                        <option value="" className="text-slate-400">Sélectionner un point d'eau</option>
                        {mockWaterPoints.map(wp => (
                          <option key={wp.id} value={wp.id} className="text-slate-900">{wp.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Type d'incident</label>
                      <select required className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:outline-none font-medium">
                        <option value="panne">Panne totale</option>
                        <option value="fuite">Fuite d'eau</option>
                        <option value="qualité_eau">Qualité de l'eau dégradée</option>
                        <option value="vandalisme">Vandalisme</option>
                        <option value="tarissement">Tarissement (sécheresse)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Titre du signalement</label>
                      <input type="text" required placeholder="ex: Pompe bloquée" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500/20 focus:outline-none font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Priorité</label>
                      <select required className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:outline-none font-medium">
                        <option value="basse">Basse</option>
                        <option value="normale" selected>Normale</option>
                        <option value="haute">Haute</option>
                        <option value="critique">Critique (Urgence)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Urgence (1-5)</label>
                      <input type="number" min="1" max="5" defaultValue="3" required className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500/20 focus:outline-none font-medium" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Description détaillée</label>
                      <textarea required rows={4} placeholder="Décrivez le problème constaté sur le terrain..." className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500/20 focus:outline-none resize-none font-medium"></textarea>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 text-slate-500 font-bold hover:text-slate-700">Annuler</button>
                    <button type="submit" className="bg-red-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-900/20">
                      Envoyer le signalement
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

export default FieldReports;
