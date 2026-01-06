
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
      <