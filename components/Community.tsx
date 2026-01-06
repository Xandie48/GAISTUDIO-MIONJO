
import React, { useState } from 'react';
import { Users, MessageSquare, ThumbsUp, Share2, Plus, Search, Tag, MoreHorizontal, X, Save, CheckCircle2 } from 'lucide-react';
import { mockCommunityPosts } from '../mockData';

const Community: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
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
          <h2 className="text-3xl font-bold text-slate-800">Communauté</h2>
          <p className="text-slate-500">Espace d'échange et d'entraide pour la gestion de l'eau</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-[#0e7490] text-white px-4 py-2.5 rounded-2xl flex items-center gap-2 hover:bg-[#0891b2] transition-all shadow-lg shadow-cyan-900/20 font-bold"
        >
          <Plus size={20} />
          Nouveau post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4 group cursor-pointer" onClick={() => setShowModal(true)}>
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-600 font-extrabold shadow-inner group-hover:scale-110 transition-transform">AD</div>
            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl py-3 px-5 text-sm text-slate-500 font-medium group-hover:text-slate-600 transition-colors">
              Partagez quelque chose avec la communauté MIONJO...
            </div>
          </div>

          <div className="space-y-6">
            {mockCommunityPosts.map((post) => (
              <div key={post.id} className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-cyan-200">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-400 border border-slate-200 shadow-inner">
                        {post.author_id.slice(-2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 leading-none mb-1">Collaborateur MIONJO</p>
                        <p className="text-xs text-slate-400 font-medium">{post.created_at}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         post.post_type === 'info' ? 'bg-cyan-100 text-cyan-700' : 'bg-purple-100 text-purple-700'
                       }`}>
                         {post.post_type}
                       </span>
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">{post.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm md:text-base">{post.content}</p>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-4 md:gap-8">
                      <button className="flex items-center gap-2 text-slate-400 hover:text-cyan-600 transition-all font-bold group">
                        <div className="p-2 rounded-xl group-hover:bg-cyan-50"><ThumbsUp size={20} /></div>
                        <span className="text-sm">{post.likes_count}</span>
                      </button>
                      <button className="flex items-center gap-2 text-slate-400 hover:text-cyan-600 transition-all font-bold group">
                        <div className="p-2 rounded-xl group-hover:bg-cyan-50"><MessageSquare size={20} /></div>
                        <span className="text-sm">8</span>
                      </button>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl transition-all">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
              <Tag size={20} className="text-cyan-600" />
              Sujets Populaires
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Maintenance', 'Formation', 'Beloha', 'Qualité Eau', 'Solaire', 'Puits Traditionnel', 'Sud Madagascar'].map(tag => (
                <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-2xl text-[11px] font-bold hover:bg-cyan-600 hover:text-white cursor-pointer transition-all border border-slate-100 shadow-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-cyan-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-cyan-400/20 rounded-full blur-2xl"></div>
            <h3 className="font-bold text-xl mb-6 flex items-center gap-3 relative z-10">
              <Users size={20} className="text-cyan-400" />
              Experts Actifs
            </h3>
            <div className="space-y-5 relative z-10">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-800 border border-cyan-700 flex items-center justify-center font-bold text-cyan-400 group-hover:scale-110 transition-transform shadow-lg">
                      T{i}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-cyan-900 shadow-md"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">Expert_Tech_{i*7}</p>
                    <p className="text-[10px] text-cyan-400/70 font-bold uppercase tracking-widest">Androy Region</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border border-white/10">
              Voir tout l'annuaire
            </button>
          </div>
        </div>
      </div>

      {/* Modal Nouveau Post */}
      {showModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-scaleIn">
            <div className="bg-[#0e7490] p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <MessageSquare size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Nouveau Message</h3>
                  <p className="text-white/70 text-sm">Partagez une info ou posez une question</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreatePost} className="p-8 space-y-6">
              {isSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle2 size={40} />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-800">Publication réussie !</h4>
                  <p className="text-slate-500 max-w-xs mx-auto">Votre message a été publié dans le fil communautaire.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Type de publication</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['info', 'question', 'succès', 'alerte'].map(type => (
                          <button 
                            key={type}
                            type="button"
                            className="py-2.5 px-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-cyan-600 hover:text-white hover:border-cyan-600 transition-all focus:bg-cyan-600 focus:text-white"
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Titre</label>
                      <input type="text" required placeholder="ex: Retour d'expérience sur Beloha" className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Contenu du message</label>
                      <textarea required rows={5} placeholder="Que souhaitez-vous partager ?" className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none transition-all resize-none font-medium"></textarea>
                    </div>
                  </div>
                  <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                    <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-slate-500 font-bold hover:text-slate-700 transition-colors">Annuler</button>
                    <button type="submit" className="bg-[#0e7490] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#0891b2] transition-all shadow-lg shadow-cyan-900/20">
                      Publier le message
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

export default Community;
