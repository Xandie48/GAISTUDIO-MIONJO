
import React, { useState, useEffect } from 'react';
import { Mail, Bell, CheckCircle, Clock, Trash2, ShieldAlert, Info, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { Notification } from '../types';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    setNotifications(api.getNotifications());
  }, []);

  const markAllRead = () => {
    notifications.forEach(n => api.markNotificationRead(n.id));
    setNotifications(api.getNotifications());
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critique': return <ShieldAlert className="text-red-600" size={20} />;
      case 'haute': return <AlertTriangle className="text-orange-600" size={20} />;
      default: return <Info className="text-cyan-600" size={20} />;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Journal des Emails</h2>
          <p className="text-slate-500 font-medium">Historique des notifications critiques envoyées par le système</p>
        </div>
        <button 
          onClick={markAllRead}
          className="bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-slate-50 transition-all font-bold shadow-sm"
        >
          <CheckCircle size={18} />
          Tout marquer comme lu
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {notifications.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border border-slate-100 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
              <Mail size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-600">Aucun email envoyé</h3>
            <p className="text-slate-400 font-medium max-w-sm">Les emails de notification apparaîtront ici dès qu'un événement critique sera détecté sur le terrain.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className={`bg-white border rounded-[2rem] p-6 transition-all hover:shadow-lg flex gap-6 items-start ${notif.is_read ? 'border-slate-100' : 'border-cyan-200 bg-cyan-50/20'}`}>
              <div className={`p-4 rounded-2xl shrink-0 ${
                notif.priority === 'critique' ? 'bg-red-50' : 
                notif.priority === 'haute' ? 'bg-orange-50' : 'bg-cyan-50'
              }`}>
                {getPriorityIcon(notif.priority)}
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      notif.priority === 'critique' ? 'bg-red-600 text-white' : 
                      notif.priority === 'haute' ? 'bg-orange-500 text-white' : 'bg-cyan-600 text-white'
                    }`}>
                      {notif.priority}
                    </span>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight">{notif.subject}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Clock size={14} />
                    {notif.timestamp}
                  </div>
                </div>
                
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mb-4">
                   <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Destinataire</p>
                   <p className="text-sm font-bold text-slate-700">{notif.recipient}</p>
                </div>
                
                <p className="text-slate-600 text-sm leading-relaxed">{notif.content}</p>
              </div>
              
              <button className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
