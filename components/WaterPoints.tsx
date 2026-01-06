
import React, { useState, useEffect, useRef } from 'react';
import { Droplets, Search, Filter, Plus, MapPin, X, Save, Crosshair, Globe, Download, Upload, FileSpreadsheet, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { WaterPoint, WaterPointStatus } from '../types';

const WaterPoints: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [points, setPoints] = useState<WaterPoint[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'forage' as any,
    commune: '',
    village: '',
    region: 'Androy',
    daily_capacity: 5000,
    lat: -25.1744,
    lng: 46.0872
  });

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  useEffect(() => {
    setPoints(api.getWaterPoints());
  }, []);

  // Initialize Modal Map
  useEffect(() => {
    if (showModal && mapContainerRef.current && !mapInstance.current) {
      // @ts-ignore
      const L = window.L;
      if (!L) return;

      setTimeout(() => {
        mapInstance.current = L.map(mapContainerRef.current).setView([formData.lat, formData.lng], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance.current);

        markerInstance.current = L.marker([formData.lat, formData.lng], { draggable: true }).addTo(mapInstance.current);

        markerInstance.current.on('dragend', (e: any) => {
          const { lat, lng } = e.target.getLatLng();
          setFormData(prev => ({ ...prev, lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) }));
        });

        mapInstance.current.on('click', (e: any) => {
          const { lat, lng } = e.latlng;
          markerInstance.current.setLatLng(e.latlng);
          setFormData(prev => ({ ...prev, lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) }));
        });
      }, 100);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        markerInstance.current = null;
      }
    };
  }, [showModal]);

  // Sync Marker when Inputs change
  useEffect(() => {
    if (markerInstance.current && mapInstance.current) {
      markerInstance.current.setLatLng([formData.lat, formData.lng]);
      mapInstance.current.panTo([formData.lat, formData.lng]);
    }
  }, [formData.lat, formData.lng]);

  const filteredPoints = points.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.commune.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.village.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleExport = () => {
    if (filteredPoints.length === 0) return;

    const headers = ["Nom", "Type", "Status", "Région", "Commune", "Village", "Latitude", "Longitude", "Capacité_L/j", "Qualité_Eau"];
    const rows = filteredPoints.map(p => [
      p.name,
      p.type,
      p.status,
      p.region,
      p.commune,
      p.village,
      p.latitude,
      p.longitude,
      p.daily_capacity,
      p.water_quality
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(val => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mionjo_points_eau_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const importedPoints: WaterPoint[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          const p: any = {};
          headers.forEach((header, index) => {
            p[header.toLowerCase()] = values[index];
          });

          // Basic reconstruction of object from potential CSV headers
          importedPoints.push({
            id: `imp-${Date.now()}-${i}`,
            name: p.nom || p.name || 'Sans nom',
            type: (p.type || 'forage') as any,
            status: (p.status || 'actif') as any,
            region: p.region || 'Androy',
            commune: p.commune || 'Inconnue',
            village: p.village || 'Inconnu',
            latitude: parseFloat(p.latitude || p.lat || '-25'),
            longitude: parseFloat(p.longitude || p.lng || '45'),
            daily_capacity: parseInt(p.capacite || p.daily_capacity || '1000'),
            population_served: Math.floor(parseInt(p.capacite || '1000') / 20),
            water_quality: (p.qualite || p.water_quality || 'bonne') as any,
            last_maintenance: new Date().toISOString().split('T')[0],
            next_maintenance: ''
          });
        }

        if (importedPoints.length > 0) {
          api.addWaterPoints(importedPoints);
          setPoints(api.getWaterPoints());
          alert(`${importedPoints.length} points d'eau importés avec succès.`);
        }
      } catch (err) {
        console.error(err);
        alert("Erreur lors de l'importation. Vérifiez le format du fichier CSV.");
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPoint: WaterPoint = {
      id: `wp-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      status: 'actif',
      latitude: formData.lat,
      longitude: formData.lng,
      region: formData.region,
      commune: formData.commune,
      village: formData.village,
      daily_capacity: formData.daily_capacity,
      population_served: Math.floor(formData.daily_capacity / 20),
      water_quality: 'bonne',
      last_maintenance: new Date().toISOString().split('T')[0],
      next_maintenance: ''
    };

    api.addWaterPoint(newPoint);
    setPoints(api.getWaterPoints());
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setShowModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeIn relative pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Points d'eau</h2>
          <p className="text-slate-500 font-medium">Gérez l'inventaire complet des infrastructures</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImport} 
            accept=".csv" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="bg-white border border-slate-200 text-slate-600 px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-[10px] shadow-sm disabled:opacity-50"
          >
            {isImporting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            Importer Données
          </button>
          
          <button 
            onClick={handleExport}
            className="bg-white border border-slate-200 text-slate-600 px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-slate-50 transition-all font-black uppercase tracking-widest text-[10px] shadow-sm"
          >
            <Download size={16} />
            Exporter CSV
          </button>

          <button 
            onClick={() => setShowModal(true)}
            className="bg-[#0e7490] text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-[#0891b2] transition-all shadow-xl shadow-cyan-900/20 font-black uppercase tracking-widest text-xs"
          >
            <Plus size={18} />
            Nouvel Ouvrage
          </button>
        </div>
      </div>

      <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher par nom, commune, village..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 font-bold"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-colors">
          <Filter size={18} />
          Filtres Avancés
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPoints.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
             <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search size={32} />
             </div>
             <p className="text-slate-500 font-bold">Aucun point d'eau trouvé pour cette recherche.</p>
          </div>
        ) : (
          filteredPoints.map((point) => (
            <div key={point.id} className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all group">
              <div className="p-8 space-y-5">
                <div className="flex items-start justify-between">
                  <div className="p-4 bg-cyan-50 text-cyan-600 rounded-2xl group-hover:scale-110 transition-transform shadow-inner">
                    <Droplets size={24} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(point.status)}`}>
                    {point.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div>
                  <h3 className="text-xl font-black text-slate-800 leading-tight mb-2 group-hover:text-cyan-700 transition-colors">{point.name}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                    <MapPin size={14} className="text-cyan-500" />
                    {point.commune}, {point.region}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Type</p>
                    <p className="text-sm font-bold text-slate-700 capitalize">{point.type.replace('_', ' ')}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Village</p>
                    <p className="text-sm font-bold text-slate-700">{point.village}</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Capacité</span>
                    <span className="text-sm font-black text-cyan-700">{point.daily_capacity.toLocaleString()} L/j</span>
                  </div>
                  <button className="text-cyan-600 text-xs font-black uppercase tracking-widest hover:underline">
                    Fiche Technique
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Nouveau Point d'eau Interactif */}
      {showModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl overflow-hidden animate-scaleIn my-8">
            <div className="bg-[#0e7490] p-10 text-white flex justify-between items-center relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Globe size={150} />
               </div>
              <div className="relative z-10">
                <h3 className="text-3xl font-black tracking-tight">Configuration Géo-Spatiale</h3>
                <p className="text-white/70 font-medium">Référencez l'ouvrage sur le réseau MIONJO</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors relative z-10">
                <X size={28} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-10">
              {isSuccess ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 animate-pulse">
                  <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center shadow-inner">
                    <Save size={48} />
                  </div>
                  <div>
                    <h4 className="text-3xl font-black text-slate-800 mb-2">Enregistrement réussi !</h4>
                    <p className="text-slate-500 font-medium">Les données géo-spatiales ont été synchronisées.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom de l'ouvrage</label>
                        <input 
                          type="text" required 
                          placeholder="ex: Forage Beloha 2" 
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none font-bold"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                        <select 
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none font-bold"
                          value={formData.type}
                          onChange={e => setFormData({...formData, type: e.target.value as any})}
                        >
                          <option value="forage">Forage</option>
                          <option value="puits">Puits</option>
                          <option value="source">Source</option>
                          <option value="borne_fontaine">Borne Fontaine</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Région</label>
                        <select 
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-2 focus:ring-cyan-500/20 focus:outline-none font-bold"
                          value={formData.region}
                          onChange={e => setFormData({...formData, region: e.target.value})}
                        >
                          <option value="Androy">Androy</option>
                          <option value="Anosy">Anosy</option>
                          <option value="Atsimo-Andrefana">Atsimo-Andrefana</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Commune</label>
                        <input 
                          type="text" required 
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-bold"
                          value={formData.commune}
                          onChange={e => setFormData({...formData, commune: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="bg-cyan-50/50 p-6 rounded-3xl border border-cyan-100 space-y-4">
                      <div className="flex items-center gap-2 mb-2 text-cyan-800">
                        <Crosshair size={18} />
                        <h4 className="font-black text-xs uppercase tracking-widest">Coordonnées GPS Précises</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-cyan-600 uppercase">Latitude</label>
                          <input 
                            type="number" step="0.000001"
                            className="w-full p-3 bg-white border border-cyan-100 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-cyan-500/20"
                            value={formData.lat}
                            onChange={e => setFormData({...formData, lat: parseFloat(e.target.value)})}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-black text-cyan-600 uppercase">Longitude</label>
                          <input 
                            type="number" step="0.000001"
                            className="w-full p-3 bg-white border border-cyan-100 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-cyan-500/20"
                            value={formData.lng}
                            onChange={e => setFormData({...formData, lng: parseFloat(e.target.value)})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                      <button type="button" onClick={() => setShowModal(false)} className="px-8 py-3 text-slate-500 font-bold hover:text-slate-700">Annuler</button>
                      <button type="submit" className="bg-[#0e7490] text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#0891b2] transition-all shadow-2xl shadow-cyan-900/30">
                        Enregistrer l'ouvrage
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-4 h-full">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visualisation sur carte</label>
                    <div className="flex-1 min-h-[400px] bg-slate-100 rounded-[2.5rem] border border-slate-200 overflow-hidden relative shadow-inner">
                       <div ref={mapContainerRef} className="w-full h-full z-10" />
                       <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur p-4 rounded-2xl shadow-xl border border-white max-w-[200px]">
                          <p className="text-[10px] font-black uppercase text-cyan-600 mb-1">Guide</p>
                          <p className="text-[11px] text-slate-600 font-bold leading-tight">Déplacez le marqueur ou cliquez sur la carte pour définir la position.</p>
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterPoints;
