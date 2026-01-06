
import React, { useState, useEffect } from 'react';
import { AlertCircle, Search, Filter, CheckCircle, Clock, MoreVertical, Plus, X, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { FieldReport, WaterPoint } from '../types';

const FieldReports: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [reports, setReports] = useState<FieldReport[]>([]);
  const [waterPoints, setWaterPoints] = useState<WaterPoint[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setReports(api.getReports());
    setWaterPoints(api.getWaterPoints());
  }, []);

  const filteredReports = reports.filter(r => {
    const statusMatch = filter === 'all' || r.status === filter;
    const searchMatch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as any;
    const waterPointId = target[0].value;
    const type = target[1].value;
    const title = target[2].value;
    const priority = target[3].value;
    const urgency = target[4].value;
    const description = target[5].value;

    const wp = waterPoints.find(p => p.id === waterPointId);

    const newReport: FieldReport = {
      id: `fr-${Date.now()}`,
      water_point_id: waterPointId,
      report_type: type,
      priority: priority,
      status: 'nouveau',
      title: title,
      description: description,
      created_at: new Date().toLocaleString()
    };

    // Save report
    api.addReport(newReport);
    setReports(api.getReports());

    // If high priority, send immediate simulated email notification
    if (priority === 'haute' || priority === 'critique') {
      api.sendNotification({
        recipient: 'supervisor-sud@mionjo.mg, maintenance-alert@unicef.mg',
        subject: `[URGENT] Nouveau Signalement ${priority.toUpperCase()}: ${title}`,
        content: `
DÉTAILS DU SIGNALEMENT :
-------------------------
Titre : ${title}
Type : ${type}
Priorité : ${priority.toUpperCase()}
Urgence : ${urgency}/5
Description : ${description}

DÉTAILS POINT D'EAU :
---------------------
Nom : ${wp?.name || 'Non spécifié'}
Localisation : ${wp?.commune || 'N/A'}, ${wp?.village || 'N/A'} (${wp?.region || 'N/A'})
Capacité : ${wp?.daily_capacity || 0} L/j

Signalé le : ${newReport.created_at}
        `,
        type: 'email',
        priority: priority as any
      });
    }

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
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Signalements Terrain</h2>
          <p className="text-slate-500 font-medium">Gestion des incidents et retours communautaires en temps réel</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-red-700 transition-all shadow-xl shadow-red-900/20 font-black uppercase tracking-widest text-xs"
        >
          <Plus size={20} />
          Signaler un incident
        </button>
      </div>

      <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher par titre ou description..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
          {['all', 'nouveau', 'en_cours', 'résolu'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                filter === s 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                  : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 pb-10">
        {filteredReports.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-600">Aucun signalement trouvé</h3>
            <p className="text-slate-400 font-medium">Les signalements du terrain apparaîtront ici.</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const wp = waterPoints.find(p => p.id === report.water_point_id);
            return (
              <div key={report.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex items-start gap-6 hover:shadow-xl transition-all group">
                <div className={`p-4 rounded-2xl shrink-0 group-hover:scale-110 transition-transform ${
                  report.priority === 'critique' ? 'bg-red-50 text-red-600 shadow-inner shadow-red-100' : 
                  report.priority === 'haute' ? 'bg-orange-50 text-orange-600 shadow-inner shadow-orange-100' : 'bg-blue-50 text-blue-600 shadow-inner shadow-blue-100'
                }`}>
                  <AlertCircle size={28} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight group-hover:text-red-600 transition-colors">{report.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        report.status === 'nouveau' ? 'bg-blue-100 text-blue-700' :
                        report.status === 'en_cours' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {report.status.replace('_', ' ')}
                      </span>
                      <button className="text-slate-300 hover:text-slate-600 p-1">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-slate-500 font-medium leading-relaxed mb-6">{report.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      <Clock size={16} className="text-slate-300" />
                      Rapporté le {report.created_at}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      <MapPin size={16} className="text-red-400" />
                      Point d'eau: <span className="text-slate-800">{wp?.name || 'Inconnu'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      <div className={`w-2 h-2 rounded-full ${
                        report.priority === 'critique' ? 'bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]' : 
                        report.priority === 'haute' ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-blue-500'
                      }`}></div>
                      Priorité: <span className={`font-black ${
                        report.priority === 'critique' ? 'text-red-600' : 
                        report.priority === 'haute' ? 'text-orange-600' : 'text-blue-600'
                      }`}>{report.priority}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Nouveau Signalement */}
      {showModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleIn">
            <div className="bg-red-600 p-10 text-white flex justify-between items-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <AlertCircle size={150} />
               </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black tracking-tight">Alerte Terrain</h3>
                <p className="text-white/70 font-medium">Remontée d'incident en temps réel</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors relative z-10">
                <X size={28} />
              </button>
            </div>
            
            <form onSubmit={handleCreateReport} className="p-10 space-y-8">
              {isSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-6 animate-fadeIn">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
                    <CheckCircle size={40} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-black text-slate-800">Signalement envoyé !</h4>
                    <p className="text-slate-500 font-medium">L'incident a été enregistré et notifié aux superviseurs par email.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Point d'eau concerné</label>
                      <select required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:outline-none font-bold">
                        <option value="" className="text-slate-400">Sélectionner un ouvrage</option>
                        {waterPoints.map(wp => (
                          <option key={wp.id} value={wp.id}>{wp.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type d'incident</label>
                      <select required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:outline-none font-bold">
                        <option value="panne">Panne totale</option>
                        <option value="fuite">Fuite d'eau</option>
                        <option value="qualité_eau">Qualité de l'eau dégradée</option>
                        <option value="vandalisme">Vandalisme</option>
                        <option value="tarissement">Tarissement (sécheresse)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Titre de l'alerte</label>
                      <input type="text" required placeholder="ex: Rupture de canalisation" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500/20 focus:outline-none font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priorité</label>
                      <select required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-2 focus:ring-red-500/20 focus:outline-none font-bold">
                        <option value="basse">Basse</option>
                        <option value="normale" selected>Normale</option>
                        <option value="haute">Haute</option>
                        <option value="critique">Critique (Urgence)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Urgence (1-5)</label>
                      <input type="number" min="1" max="5" defaultValue="3" required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description détaillée</label>
                      <textarea required rows={4} placeholder="Détaillez le problème pour les techniciens..." className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-red-500/20 focus:outline-none resize-none font-bold"></textarea>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3 text-slate-500 font-bold hover:text-slate-700">Annuler</button>
                    <button type="submit" className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all shadow-2xl shadow-red-900/30">
                      Envoyer l'alerte critique
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
