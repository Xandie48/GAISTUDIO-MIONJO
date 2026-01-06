
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
  FilterX,
  TrendingUp,
  Activity
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { mockWaterPoints, mockFieldReports, mockMaintenanceRecords, mockAIPredictions } from '../mockData';

interface DashboardProps {
  filterStatus: string;
  filterType: string;
  onResetFilters: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ filterStatus, filterType, onResetFilters }) => {
  const filteredPoints = mockWaterPoints.filter(p => {
    const statusMatch = filterStatus === 'all' || p.status === filterStatus;
    const typeMatch = filterType === 'all' || p.type === filterType;
    return statusMatch && typeMatch;
  });

  const activePoints = filteredPoints.filter(p => p.status === 'actif').length;
  const maintenancePoints = filteredPoints.filter(p => p.status === 'maintenance').length;
  const pannePoints = filteredPoints.filter(p => p.status === 'panne').length;
  const totalPoints = filteredPoints.length;
  
  // Fake production data for the chart
  const productionHistory = [
    { day: 'Lun', liters: 4200 },
    { day: 'Mar', liters: 4800 },
    { day: 'Mer', liters: 4500 },
    { day: 'Jeu', liters: 5100 },
    { day: 'Ven', liters: 4900 },
    { day: 'Sam', liters: 3800 },
    { day: 'Dim', liters: 4100 },
  ];

  const statusData = [
    { name: 'Actifs', value: activePoints, color: '#06b6d4' },
    { name: 'Maintenance', value: maintenancePoints, color: '#f59e0b' },
    { name: 'En panne', value: pannePoints, color: '#ef4444' },
    { name: 'Inactifs', value: Math.max(0, totalPoints - (activePoints + maintenancePoints + pannePoints)), color: '#cbd5e1' },
  ];

  const urgentReports = [...mockFieldReports].sort((a, b) => a.priority === 'critique' ? -1 : 1).slice(0, 4);

  const hasFilters = filterStatus !== 'all' || filterType !== 'all';

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Récapitulatif</h2>
          <p className="text-slate-500 font-medium text-lg">
            {hasFilters ? "Vue filtrée du réseau" : "Performance du réseau MIONJO"}
          </p>
        </div>
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-cyan-50 text-cyan-600 rounded-xl">
            <Activity size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Système</p>
            <p className="text-sm font-bold text-slate-700 leading-none">Optimal (98.2%)</p>
          </div>
        </div>
      </div>

      {/* Stats Cards with Premium Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Infrastructures" 
          value={totalPoints} 
          subtitle="Total points d'eau" 
          icon={Droplets} 
          color="cyan" 
          trend="+2 ce mois"
        />
        <StatCard title="Opérationnels" value={activePoints} subtitle="En service" icon={Users} color="blue" trend="Stable" />
        <StatCard title="Alertes" value={pannePoints} subtitle="Urgence technique" icon={AlertTriangle} color="red" trend="-15% vs hier" />
        <StatCard title="IA Insight" value="94%" subtitle="Précision modèle" icon={BrainCircuit} color="indigo" trend="Amélioré" />
      </div>

      {totalPoints === 0 ? (
        <div className="bg-white p-12 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
          <FilterX size={60} className="text-slate-200 mb-6" />
          <h3 className="text-xl font-bold text-slate-600 mb-2">Aucun résultat</h3>
          <p className="text-slate-400 mb-8 max-w-sm font-medium">Réinitialisez les filtres pour voir les statistiques globales.</p>
          <button onClick={onResetFilters} className="px-10 py-3 bg-[#0e7490] text-white rounded-2xl font-bold hover:bg-[#0891b2] shadow-xl shadow-cyan-900/20">
            Tout afficher
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Production Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Production (Liters)</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">7 derniers jours</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-slate-800">31.9k</p>
                <p className="text-[10px] font-bold text-green-500">+4.2% hebdomadaire</p>
              </div>
            </div>
            
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productionHistory}>
                  <defs>
                    <linearGradient id="colorLiters" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                    itemStyle={{fontWeight: 800, color: '#0e7490'}}
                    cursor={{stroke: '#0e7490', strokeWidth: 2}}
                  />
                  <Area type="monotone" dataKey="liters" stroke="#0e7490" strokeWidth={4} fillOpacity={1} fill="url(#colorLiters)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Column: Status & Alerts */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Répartition Réseau</h3>
              <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={8} dataKey="value">
                      {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="text-2xl font-black text-slate-800 leading-none">{totalPoints}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {statusData.map(d => (
                  <div key={d.name} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{backgroundColor: d.color}}></div>
                      <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors">{d.name}</span>
                    </div>
                    <span className="text-sm font-black text-slate-700">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[3rem] text-white shadow-xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 transition-transform group-hover:scale-110"></div>
               <h3 className="text-lg font-bold mb-5 flex items-center gap-3 relative z-10">
                 <AlertTriangle size={20} className="text-red-400" />
                 Alertes Critiques
               </h3>
               <div className="space-y-4 relative z-10">
                 {urgentReports.slice(0, 2).map(r => (
                   <div key={r.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors cursor-pointer">
                     <p className="text-xs font-black uppercase text-red-400 mb-1">{r.priority}</p>
                     <p className="text-sm font-bold text-white mb-1 line-clamp-1">{r.title}</p>
                     <p className="text-[10px] text-slate-400 font-medium">{r.created_at}</p>
                   </div>
                 ))}
               </div>
               <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                 Gérer les incidents
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  trend: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  const colors = {
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    red: 'bg-red-50 text-red-600 border-red-100',
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
      <div className="flex items-start justify-between mb-6">
        <div className={`p-4 rounded-2xl transition-transform group-hover:rotate-12 ${colors[color as keyof typeof colors]}`}>
          <Icon size={24} />
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</p>
          <h4 className="text-3xl font-black text-slate-800 leading-none">{value}</h4>
        </div>
      </div>
      <div>
        <p className="text-sm font-bold text-slate-600 mb-1">{subtitle}</p>
        <p className={`text-[10px] font-black uppercase tracking-tight ${trend.includes('-') ? 'text-red-500' : 'text-green-500'}`}>
          {trend}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
