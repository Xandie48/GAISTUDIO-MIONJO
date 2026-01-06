
import React, { useEffect, useRef } from 'react';
import { mockWaterPoints } from '../mockData';
import { Filter, Layers } from 'lucide-react';

interface MapViewProps {
  filterStatus: string;
  setFilterStatus: (val: string) => void;
  filterType: string;
  setFilterType: (val: string) => void;
}

const MapView: React.FC<MapViewProps> = ({ filterStatus, setFilterStatus, filterType, setFilterType }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markersLayer = useRef<any>(null);
  
  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      // @ts-ignore - Leaflet is loaded via script
      const L = window.L;
      if (!L) return;
      
      leafletMap.current = L.map(mapRef.current).setView([-25.1744, 46.0872], 9);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(leafletMap.current);

      markersLayer.current = L.layerGroup().addTo(leafletMap.current);
      updateMarkers();
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  useEffect(() => {
    updateMarkers();
  }, [filterStatus, filterType]);

  const updateMarkers = () => {
    // @ts-ignore
    const L = window.L;
    if (!L || !markersLayer.current) return;

    markersLayer.current.clearLayers();

    const filtered = mockWaterPoints.filter(p => {
      const statusMatch = filterStatus === 'all' || p.status === filterStatus;
      const typeMatch = filterType === 'all' || p.type === filterType;
      return statusMatch && typeMatch;
    });

    filtered.forEach(p => {
      const color = p.status === 'actif' ? '#10b981' : 
                    p.status === 'maintenance' ? '#f59e0b' : 
                    p.status === 'panne' ? '#ef4444' : '#94a3b8';

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${color}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      const marker = L.marker([p.latitude, p.longitude], { icon: customIcon });
      
      marker.bindPopup(`
        <div class="p-2">
          <h4 class="font-bold text-slate-800">${p.name}</h4>
          <p class="text-xs text-slate-500 mb-2">${p.type.replace('_', ' ')} - ${p.village}</p>
          <div class="flex items-center gap-2 mb-2">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style="background-color: ${color}20; color: ${color}; border: 1px solid ${color}">
              ${p.status}
            </span>
          </div>
          <div class="text-[10px] text-slate-600">
            <strong>Pop. desservie:</strong> ${p.population_served.toLocaleString()} hab.
          </div>
          <button class="mt-3 w-full py-1.5 bg-cyan-600 text-white rounded text-[10px] font-bold hover:bg-cyan-700 transition-colors">
            Voir fiche complète
          </button>
        </div>
      `, {
        closeButton: false,
        className: 'custom-popup'
      });

      marker.addTo(markersLayer.current);
    });

    if (filtered.length > 0 && leafletMap.current) {
      const group = new L.featureGroup(markersLayer.current.getLayers());
      leafletMap.current.fitBounds(group.getBounds().pad(0.1));
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Vue Carte Interactive</h2>
          <p className="text-slate-500">Localisation en temps réel des infrastructures MIONJO</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-xs font-medium text-slate-600">Actif</span>
           </div>
           <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="text-xs font-medium text-slate-600">Maintenance</span>
           </div>
           <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span className="text-xs font-medium text-slate-600">Panne</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-[600px]">
        {/* Sidebar Filters */}
        <div className="lg:w-72 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Filter size={18} className="text-cyan-600" />
              Filtres
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Statut</label>
                <select 
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="actif">Actif</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="panne">En panne</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Type d'infrastructure</label>
                <select 
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:ring-2 focus:ring-cyan-500/20 focus:outline-none"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">Tous les types</option>
                  <option value="forage">Forage</option>
                  <option value="puits">Puits</option>
                  <option value="source">Source</option>
                  <option value="borne_fontaine">Borne fontaine</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
               <p className="text-[10px] text-slate-400 font-medium italic">
                 Cliquez sur un marqueur pour afficher les détails du point d'eau.
               </p>
            </div>
          </div>

          <div className="bg-slate-800 p-6 rounded-3xl text-white shadow-sm overflow-hidden relative">
            <Layers className="absolute -right-4 -bottom-4 opacity-10" size={100} />
            <h3 className="font-bold mb-2">Couches de données</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input type="checkbox" checked readOnly className="rounded border-white/20 bg-white/10" />
                Zones de sécheresse
              </label>
              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input type="checkbox" readOnly className="rounded border-white/20 bg-white/10" />
                Densité de population
              </label>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative bg-white rounded-[2rem] p-2 border border-slate-200 shadow-sm overflow-hidden">
          <div ref={mapRef} className="w-full h-full"></div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
