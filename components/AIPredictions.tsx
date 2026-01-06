
import React from 'react';
import { BrainCircuit, AlertCircle, CheckCircle2, TrendingDown } from 'lucide-react';
import { mockAIPredictions, mockWaterPoints } from '../mockData';

const AIPredictions: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Prédictions IA</h2>
          <p className="text-slate-500">Maintenance prédictive et analyse de risque avancée</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 flex items-center gap-2">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-sm font-medium text-slate-600">Modèle v2.4 Actif</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-[#0e7490] to-[#0891b2] p-8 rounded-3xl text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Analyse Globale du Réseau</h3>
              <p className="text-white/80 max-w-md mb-6">
                Nos modèles prévoient une augmentation de 12% des pannes sur les infrastructures de type "forage" dans la région de l'Androy en raison de la baisse de la nappe phréatique.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <p className="text-xs text-white/60 mb-1">Confiance moyenne</p>
                  <p className="text-2xl font-bold">94%</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                  <p className="text-xs text-white/60 mb-1">Alertes anticipées</p>
                  <p className="text-2xl font-bold">8 points</p>
                </div>
              </div>
            </div>
            <BrainCircuit className="absolute top-1/2 right-4 -translate-y-1/2 opacity-10" size={180} />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800">Points d'eau sous surveillance accrue</h3>
            {mockAIPredictions.map(pred => {
              const wp = mockWaterPoints.find(p => p.id === pred.water_point_id);
              return (
                <div key={pred.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-6 items-start md:items-center">
                  <div className={`p-4 rounded-2xl ${pred.risk_level === 'critique' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                    {pred.risk_level === 'critique' ? <AlertCircle size={32} /> : <TrendingDown size={32} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-800">{wp?.name}</h4>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${
                        pred.risk_level === 'critique' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        Risque {pred.risk_level}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-2">{pred.recommendation}</p>
                    <div className="flex items-center gap-4">
                       <span className="text-xs font-medium text-slate-400">Fiabilité: {pred.confidence_score}%</span>
                       <span className="text-xs font-medium text-slate-400">Type: {pred.prediction_type.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">
                    Planifier inspection
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-green-500" size={20} />
              Précision Historique
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm text-slate-500">Pannes prédites (30j)</span>
                <span className="text-xl font-bold text-slate-800">12</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm text-slate-500">Pannes réelles</span>
                <span className="text-xl font-bold text-slate-800">11</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[91%]"></div>
              </div>
              <p className="text-[10px] text-center text-slate-400 font-medium">91% de taux de succès cumulé</p>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-3xl text-white">
            <h3 className="font-bold mb-4">Mise à jour automatique</h3>
            <p className="text-sm text-slate-400 mb-4">Le modèle s'auto-ajuste tous les jours à 00:00 avec les nouveaux relevés techniques du terrain.</p>
            <button className="w-full py-2 bg-white/10 border border-white/20 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-colors">
              Re-calculer maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictions;
