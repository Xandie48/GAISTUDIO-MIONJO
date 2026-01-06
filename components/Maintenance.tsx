
import React, { useState } from 'react';
// Added BrainCircuit to the icons imported from lucide-react
import { Wrench, Calendar, CheckCircle2, AlertTriangle, User, ExternalLink, Plus, X, Save, Clock, BrainCircuit } from 'lucide-react';
import { mockMaintenanceRecords, mockWaterPoints } from '../mockData';
import { api } from '../services/api';

const Maintenance: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as any;
    const waterPointId = target[0].value;
    const type = target[1].value;
    const date = target[2].value;
    const priority = target[3].value;
    const description = target[4].value;

    const wp = mockWaterPoints.find(p => p.id === waterPointId);

    // Send notification email to technicians
    api.sendNotification({
      recipient: 'technicien-equipe-A@mionjo.mg',
      subject: `NOUVELLE MAINTENANCE: ${wp?.name || 'Inconnu'} (${type})`,
      content: `Une intervention de type ${type} a été planifiée pour le ${date}. Priorité: ${priority}. Description: ${description}.`,
      type: 'email',
      priority: priority as any
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setShowModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Maintenance</h2>
          <p className="text-slate-500">Suivi des interventions techniques et préventives</p>
        </div>
        <div className="flex gap-3">
          <button className="hidden sm:block bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
            Historique complet
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#0e7490] text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#0891b2] transition-colors shadow-lg shadow-cyan-900/20 font-bold"
          >
            <Calendar size={20} />
            Planifier intervention
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-2">
            <Wrench size={20} className="text-cyan-600" />
            Interventions Planifiées
          </h3>
          
          <div className="space-y-4">
            {mockMaintenanceRecords.map((m) => {
              const wp = mockWaterPoints.find(p => p.id === m.water_point_id);
              return (
                <div key={m.id} className="bg-white border border-slate-200 rounded-3xl p-6 relative overflow-hidden group hover:border-cyan-300 transition-all hover:shadow-md">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${
                    m.priority === 'critique' ? 'bg-red-500' : m.priority === 'haute' ? 'bg-orange-500' : 'bg-cyan-500'
                  }`}></div>
                  
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[10px] font-extrabold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-2 py-0.5 rounded-full">{m.maintenance_type}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            m.status === 'en_cours' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {m.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-slate-800">{wp?.name}</h4>
                      </div>
                      
                      <p className="text-sm text-slate-500 leading-relaxed">{m.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-5 pt-3">
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <Calendar size={14} className="text-slate-300" />
                          Prévu: <span className="text-slate-700 font-bold">{m.scheduled_date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                          <User size={14} className="text-slate-300" />
                          Équipe: <span className="text-slate-700 font-bold">Technicien Local</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between min-w-[140px] pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight ${
                        m.priority === 'critique' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-slate-50 text-slate-500 border border-slate-100'
                      }`}>
                        Priorité {m.priority}
                      </div>
                      <button className="text-cyan-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                        Détails <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
              <AlertTriangle className="text-amber-500" size={20} />
              Alertes Maintenance IA
            </h3>
            <div className="space-y-4">
              <div className="p-5 rounded-3xl bg-amber-50 border border-amber-100 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 text-amber-100 opacity-50 group-hover:scale-110 transition-transform">
                  <BrainCircuit size={80} />
                </div>
                <p className="text-sm font-bold text-amber-900 mb-1 relative z-10">Usure précoce détectée</p>
                <p className="text-xs text-amber-700 leading-relaxed relative z-10">Le forage d'Ambovombe présente des vibrations anormales. Maintenance recommandée sous 15 jours.</p>
              </div>
              <div className="p-5 rounded-3xl bg-cyan-50 border border-cyan-100 relative overflow-hidden group">
                <div className="absolute -right-4 -bottom-4 text-cyan-100 opacity-50 group-hover:scale-110 transition-transform">
                  <Clock size={80} />
                </div>
                <p className="text-sm font-bold text-cyan-900 mb-1 relative z-10">Optimisation trajet</p>
                <p className="text-xs text-cyan-700 leading-relaxed relative z-10">Regrouper les interventions d'Antanimora et Tsihombe permettrait d'économiser 4h de trajet.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Wrench size={100} />
            </div>
            <h3 className="font-bold text-xl mb-6 relative z-10">Statistiques du mois</h3>
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Interventions terminées</span>
                <span className="font-extrabold">14</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 font-medium">Temps moyen réparation</span>
                <span className="font-extrabold">3.5h</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400 font-medium">Budget consommé</span>
                <span className="font-extrabold">62%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden shadow-inner">
                <div className="bg-cyan-400 h-full w-[62%] rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Planifier Intervention */}
      {showModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleIn">
            <div className="bg-[#0e7490] p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Calendar size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Planifier une Intervention</h3>
                  <p className="text-white/70 text-sm">Organisez la maintenance d'une infrastructure</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSchedule} className="p-8 space-y-6">
              {isSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle2 size={40} />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800">Intervention planifiée !</h4>
                  <p className="text-slate-500 max-w-xs mx-auto">L'équipe technique a été notifiée par email et l'intervention est désormais visible dans le planning.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Infrastructure</label>
                      <select required className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all font-medium">
                        <option value="" className="text-slate-400">Sélectionner un point d'eau</option>
                        {mockWaterPoints.map(wp => (
                          <option key={wp.id} value={wp.id} className="text-slate-900">{wp.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Type d'intervention</label>
                      <select required className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all font-medium">
                        <option value="préventive">Préventive (Contrôle)</option>
                        <option value="corrective">Corrective (Réparation)</option>
                        <option value="urgence">Urgent (Panne bloquante)</option>
                        <option value="amélioration">Amélioration / Upgrade</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Date d'intervention</label>
                      <input type="date" required className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Priorité</label>
                      <select required className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all font-medium">
                        <option value="basse">Basse</option>
                        <option value="normale" selected>Normale</option>
                        <option value="haute">Haute</option>
                        <option value="critique">Critique</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Description des travaux</label>
                      <textarea required rows={3} placeholder="Détaillez les tâches à accomplir..." className="w-full p-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all resize-none font-medium"></textarea>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-slate-500 font-bold hover:text-slate-700 transition-colors">Annuler</button>
                    <button type="submit" className="bg-[#0e7490] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#0891b2] transition-all shadow-lg shadow-cyan-900/20">
                      Confirmer le planning
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

export default Maintenance;
