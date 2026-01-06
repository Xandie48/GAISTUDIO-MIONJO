
import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Search, Filter, Mail, Phone, MapPin, Shield, CheckCircle, XCircle, MoreVertical, X, AlertTriangle, Trash2 } from 'lucide-react';
import { User } from '../types';
import { api } from '../services/api';

const UserManagement: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState<User[]>([]);
  
  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    type: 'deactivate' | 'delete' | null;
    userId: string | null;
    userName: string | null;
  }>({
    show: false,
    type: null,
    userId: null,
    userName: null
  });

  useEffect(() => {
    setUsers(api.getUsers());
  }, []);

  const openConfirmation = (type: 'deactivate' | 'delete', user: User) => {
    setConfirmModal({
      show: true,
      type,
      userId: user.id,
      userName: user.full_name
    });
  };

  const closeConfirmation = () => {
    setConfirmModal({ show: false, type: null, userId: null, userName: null });
  };

  const handleConfirmedAction = () => {
    if (!confirmModal.userId || !confirmModal.type) return;

    if (confirmModal.type === 'deactivate') {
      api.updateUser(confirmModal.userId, { is_active: false });
    } else if (confirmModal.type === 'delete') {
      api.deleteUser(confirmModal.userId);
    }
    
    setUsers(api.getUsers());
    closeConfirmation();
  };

  const toggleUserStatus = (user: User) => {
    if (user.is_active) {
      // If active, we ask for confirmation before deactivating
      openConfirmation('deactivate', user);
    } else {
      // If suspended, we activate directly
      api.updateUser(user.id, { is_active: true });
      setUsers(api.getUsers());
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as any;
    const newUser: User = {
      id: Date.now().toString(),
      full_name: target[0].value,
      email: target[1].value,
      role: target[2].value,
      organization: target[3].value,
      region: target[4].value,
      is_active: true
    };
    api.addUser(newUser);
    setUsers(api.getUsers());
    setShowModal(false);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Gestion des Utilisateurs</h2>
          <p className="text-slate-500 font-medium">Contrôlez les accès et les permissions du système</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#0e7490] text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-[#0891b2] transition-all shadow-xl shadow-cyan-900/20 font-black uppercase tracking-widest text-xs"
        >
          <UserPlus size={18} />
          Nouvel Utilisateur
        </button>
      </div>

      <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher par nom, email, organisation..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 uppercase tracking-widest cursor-pointer"
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="technicien">Technicien</option>
            <option value="ong">ONG</option>
            <option value="communaute">Communauté</option>
          </select>
          <button className="p-3 bg-slate-50 text-slate-600 rounded-2xl hover:bg-slate-100 border border-slate-100">
            <Filter size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Utilisateur</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Rôle & Organisation</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Région</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Statut</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center">
                    <p className="text-slate-400 font-medium">Aucun utilisateur ne correspond aux critères.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-black shadow-inner group-hover:scale-110 transition-transform">
                          {user.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">{user.full_name}</p>
                          <p className="text-xs text-slate-400 font-bold">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Shield size={12} className="text-cyan-600" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-700">{user.role}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-black uppercase tracking-tight">{user.organization}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 font-black">
                        <MapPin size={14} className="text-cyan-500" />
                        {user.region}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <button 
                        onClick={() => toggleUserStatus(user)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all border ${
                          user.is_active 
                            ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100' 
                            : 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100'
                        }`}
                      >
                        {user.is_active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {user.is_active ? 'Actif' : 'Suspendu'}
                        </span>
                      </button>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openConfirmation('delete', user)}
                          className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                          title="Supprimer l'utilisateur"
                        >
                          <Trash2 size={20} />
                        </button>
                        <button className="p-3 hover:bg-slate-100 rounded-2xl text-slate-400 transition-colors">
                          <MoreVertical size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-scaleIn">
            <div className={`p-10 flex flex-col items-center text-center ${confirmModal.type === 'delete' ? 'bg-red-50' : 'bg-orange-50'}`}>
              <div className={`p-5 rounded-3xl mb-6 shadow-sm ${confirmModal.type === 'delete' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                <AlertTriangle size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">
                {confirmModal.type === 'delete' ? 'Supprimer cet utilisateur ?' : 'Suspendre cet utilisateur ?'}
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Êtes-vous sûr de vouloir {confirmModal.type === 'delete' ? 'supprimer définitivement' : 'suspendre l\'accès de'} <strong>{confirmModal.userName}</strong> ?
                {confirmModal.type === 'delete' && <span className="block mt-2 text-red-600 text-xs font-black uppercase">Cette action est irréversible.</span>}
              </p>
            </div>
            <div className="p-8 flex flex-col gap-3">
              <button 
                onClick={handleConfirmedAction}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg ${
                  confirmModal.type === 'delete' 
                    ? 'bg-red-600 text-white shadow-red-900/20 hover:bg-red-700' 
                    : 'bg-orange-600 text-white shadow-orange-900/20 hover:bg-orange-700'
                }`}
              >
                Confirmer la {confirmModal.type === 'delete' ? 'suppression' : 'suspension'}
              </button>
              <button 
                onClick={closeConfirmation}
                className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouvel Utilisateur */}
      {showModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleIn">
            <div className="bg-[#0e7490] p-10 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/10 rounded-2xl shadow-inner">
                  <UserPlus size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight">Nouvel Accès</h3>
                  <p className="text-white/70 font-medium">Créez un profil pour un collaborateur</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 hover:bg-white/10 rounded-full transition-colors">
                <X size={28} />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom complet</label>
                  <input type="text" required placeholder="ex: Jean Dupont" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <input type="email" required placeholder="ex: jean@mionjo.mg" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rôle Système</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all font-bold">
                    <option value="admin">Administrateur</option>
                    <option value="technicien">Technicien Terrain</option>
                    <option value="ong">Partenaire ONG</option>
                    <option value="communaute">Relais Communautaire</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organisation</label>
                  <input type="text" required placeholder="ex: MIONJO / UNICEF" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Région</label>
                  <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all font-bold">
                    <option value="Androy">Androy</option>
                    <option value="Anosy">Anosy</option>
                    <option value="Atsimo-Andrefana">Atsimo-Andrefana</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Clé d'accès provisoire</label>
                  <input type="password" required placeholder="••••••••" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all font-bold" />
                </div>
              </div>
              
              <div className="pt-8 border-t border-slate-50 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3 text-slate-500 font-bold hover:text-slate-700">Annuler</button>
                <button type="submit" className="bg-[#0e7490] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#0891b2] transition-all shadow-2xl shadow-cyan-900/30">
                  Créer le compte collaborateur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
