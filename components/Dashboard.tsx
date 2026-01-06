
import React from 'react';
import { 
  Droplets, 
  Users, 
  AlertTriangle, 
  Wrench,
  Clock,
  BrainCircuit,
  Calendar,
  ChevronRight,
  FilterX
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { mockWaterPoints, mockFieldReports, mockMaintenanceRecords, mockAIPredictions } from '../mockData';

interface DashboardProps {
  filterStatus: string;
  filterType: string;
  onResetFilters: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ filterStatus, filterType, onResetFilters }) => {
  // Apply global filters to mockWaterPoints
  const filteredPoints = mockWaterPoints.filter(p => {
    const statusMatch = filterStatus === 'all' || p.status === filterStatus;
    const typeMatch = filterType === 'all' || p.type === filterType;
    return statusMatch && typeMatch;
  });

  const activePoints = filteredPoints.filter(p => p.status === 'actif').length;
  const maintenancePoints = filteredPoints.filter(p => p.status === 'maintenance').length;
  const pannePoints = filteredPoints.filter(p => p.status === 'panne').length;
  const totalPoints = filteredPoints.length;
  const totalPopulation = filteredPoints.reduce((acc, p) => acc + p.population_served, 0);
  
  // Top 5 Urgent Reports (still showing globally or maybe filtered by point context)
  const urgentReports = [...mockFieldReports]
    .sort((a, b) => {
      const priorityOrder = { critique: 0, haute: 1, normale: 2, basse: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 5);

  // Top 5 Upcoming Maintenance
  const upcomingMaintenance = [...mockMaintenanceRecords]
    .filter(m => m.status === 'planifié')
    .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())
    .slice(0, 5);

  // Recent AI Predictions Summary
  const recentPredictions = [...mockAIPredictions]
    .sort((a, b) => {
      const riskOrder = { critique: 0, élevé: 1, moyen: 2, faible: 3 };
      return riskOrder[a.risk_level] - riskOrder[b.risk_level];
    })
    .slice(0, 3);

  const statusData = [
    { name: 'Actifs', value: activePoints, color: '#10b981' },
    { name: 'Maintenance', value: maintenancePoints, color: '#f59e0b' },
    { name: 'En panne', value: pannePoints, color: '#ef4444' },
    { name: 'Inactifs', value: Math.max(0, totalPoints - (activePoints + maintenancePoints + pannePoints)), color: '#94a3b8' },
  ];

  const hasFilters = filterStatus !== 'all' || filterType !== 'all';

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Tableau de bord</h2>
          <p className="text-slate-500">
            {hasFilters 
              ? `Analyse filtrée (${filterType !== 'all' ? filterType : 'tous types'}, ${filterStatus !== 'all' ? filterStatus : 'tous statuts'})` 
              : "Vue d'ensemble des ressources en eau - Sud Madagascar"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-slate-400 flex items-center justify-end gap-1">
            <Clock size={12} />
            Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Points d'eau" 
          value={totalPoints} 
          subtitle={hasFilters ? "Infrastructures filtrées" : "Infrastructures gérées"} 
          icon={Droplets} 
          color="cyan" 
          isHighlighted={hasFilters}
        />
        <StatCard title="Points Actifs" value={activePoints} subtitle={totalPoints > 0 ? `${((activePoints/totalPoints)*100).toFixed(0)}% de la sélection` : '0%'} icon={Users} color="blue" />
        <StatCard title="En Maintenance" value={maintenancePoints} subtitle="Interventions en cours" icon={Wrench} color="amber" />
        <StatCard title="En Panne" value={pannePoints} subtitle="Action immédiate requise" icon={AlertTriangle} color="red" />
      </div>

      {totalPoints === 0 && (
        <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
          <FilterX size={48} className="text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-600 mb-1">Aucun point d'eau ne correspond aux filtres</h3>
          <p className="text-slate-400 mb-6 max-w-sm">Ajustez vos filtres dans la vue carte pour afficher les statistiques correspondantes.</p>
          <button 
            onClick={onResetFilters}
            className="px-6 py-2 bg-[#0e7490] text-white rounded-xl font-bold hover:bg-[#0891b2] transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {totalPoints > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Urgent Reports Widget */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-red-500" />
                  Signalements Urgents (Top 5)
                </h3>
              </div>
              <div className="divide-y divide-slate-50">
                {urgentReports.map(report => (
                  <div key={report.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-10 rounded-full ${report.priority === 'critique' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{report.title}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{report.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        report.priority === 'critique' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {report.priority}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">{report.created_at}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Predictions Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <BrainCircuit size={20} className="text-cyan-600" />
                Résumé Prédictions IA
              </h3>
              <div className="space-y-4">
                {recentPredictions.map(pred => {
                  const wp = mockWaterPoints.find(p => p.id === pred.water_point_id);
                  return (
                    <div key={pred.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-xs font-bold text-slate-700 truncate">{wp?.name}</p>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          pred.risk_level === 'élevé' || pred.risk_level === 'critique' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {pred.risk_level}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">{pred.recommendation}</p>
                      <div className="mt-2 flex items-center gap-1">
                        <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500" style={{ width: `${pred.confidence_score}%` }}></div>
                        </div>
                        <span className="text-[10px] font-medium text-slate-400">{pred.confidence_score}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Distribution Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
                <Droplets size={20} className="text-cyan-600" />
                Répartition par Statut
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                   {statusData.map(d => (
                     <div key={d.name} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                        <span className="text-[10px] text-slate-600 font-medium truncate">{d.name}: {d.value}</span>
                     </div>
                   ))}
                </div>
              </div>
            </div>

            {/* Upcoming Maintenance Widget */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Calendar size={20} className="text-blue-500" />
                  Prochaines Maintenances
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Point d'eau</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Priorité</th>
                      <th className="px-6 py-3">Date Prévue</th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {upcomingMaintenance.map(m => {
                      const wp = mockWaterPoints.find(p => p.id === m.water_point_id);
                      return (
                        <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-slate-700">{wp?.name}</td>
                          <td className="px-6 py-4 text-sm text-slate-500 capitalize">{m.maintenance_type}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              m.priority === 'critique' ? 'bg-red-100 text-red-600' : 
                              m.priority === 'haute' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {m.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500 font-medium">{m.scheduled_date}</td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-1 hover:bg-slate-200 rounded text-slate-400">
                              <ChevronRight size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  color: 'cyan' | 'blue' | 'red' | 'amber';
  isHighlighted?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, color, isHighlighted }) => {
  const colorMap = {
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
  };

  return (
    <div className={`p-6 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-all ${isHighlighted ? 'ring-2 ring-cyan-500 ring-offset-2' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="overflow-hidden">
          <p className="text-sm font-medium text-slate-500 mb-1 truncate">{title}</p>
          <h4 className="text-3xl font-bold text-slate-800 mb-1">{value}</h4>
          <p className="text-xs text-slate-400 truncate">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-xl flex-shrink-0 ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
