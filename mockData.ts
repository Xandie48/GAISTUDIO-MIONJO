
import { WaterPoint, FieldReport, AIPrediction, MaintenanceRecord, CommunityPost } from './types';

export const mockWaterPoints: WaterPoint[] = [
  {
    id: 'wp-1',
    name: 'Forage Ambovombe Centre',
    type: 'forage',
    status: 'actif',
    latitude: -25.1744,
    longitude: 46.0872,
    region: 'Androy',
    commune: 'Ambovombe',
    village: 'Centre',
    daily_capacity: 5000,
    population_served: 2500,
    water_quality: 'excellente',
    last_maintenance: '2023-11-15',
    next_maintenance: '2024-05-15'
  },
  {
    id: 'wp-2',
    name: 'Puits Tsihombe Nord',
    type: 'puits',
    status: 'maintenance',
    latitude: -25.3055,
    longitude: 45.4839,
    region: 'Androy',
    commune: 'Tsihombe',
    village: 'Nord',
    daily_capacity: 2000,
    population_served: 800,
    water_quality: 'bonne',
    last_maintenance: '2023-12-01',
    next_maintenance: '2024-02-10'
  },
  {
    id: 'wp-3',
    name: 'Source Beloha Est',
    type: 'source',
    status: 'panne',
    latitude: -25.1697,
    longitude: 45.0569,
    region: 'Androy',
    commune: 'Beloha',
    village: 'Est',
    daily_capacity: 1500,
    population_served: 700,
    water_quality: 'non_potable',
    last_maintenance: '2023-08-20',
    next_maintenance: '2023-10-15'
  },
  {
    id: 'wp-4',
    name: 'Borne Fontaine Amboasary',
    type: 'borne_fontaine',
    status: 'actif',
    latitude: -25.0381,
    longitude: 46.3831,
    region: 'Anosy',
    commune: 'Amboasary Sud',
    village: 'Vohitany',
    daily_capacity: 3000,
    population_served: 1500,
    water_quality: 'bonne',
    last_maintenance: '2024-01-05',
    next_maintenance: '2024-07-05'
  },
  {
    id: 'wp-5',
    name: 'Forage Antanimora',
    type: 'forage',
    status: 'panne',
    latitude: -24.8256,
    longitude: 45.6721,
    region: 'Androy',
    commune: 'Antanimora Sud',
    village: 'Centre',
    daily_capacity: 4500,
    population_served: 3200,
    water_quality: 'moyenne',
    last_maintenance: '2023-05-12',
    next_maintenance: '2023-11-12'
  }
];

export const mockFieldReports: FieldReport[] = [
  {
    id: 'fr-1',
    water_point_id: 'wp-3',
    report_type: 'panne',
    priority: 'critique',
    status: 'nouveau',
    title: 'Pompe bloquée',
    description: 'La pompe manuelle ne remonte plus d\'eau depuis hier soir.',
    created_at: '2024-01-06 08:30'
  },
  {
    id: 'fr-2',
    water_point_id: 'wp-2',
    report_type: 'qualité_eau',
    priority: 'normale',
    status: 'en_cours',
    title: 'Eau trouble',
    description: 'L\'eau semble plus chargée en sédiments après les dernières pluies.',
    created_at: '2024-01-05 14:20'
  },
  {
    id: 'fr-3',
    water_point_id: 'wp-5',
    report_type: 'vandalisme',
    priority: 'haute',
    status: 'nouveau',
    title: 'Clôture endommagée',
    description: 'La clôture de protection a été coupée à plusieurs endroits.',
    created_at: '2024-01-07 09:15'
  },
  {
    id: 'fr-4',
    water_point_id: 'wp-1',
    report_type: 'fuite',
    priority: 'haute',
    status: 'nouveau',
    title: 'Fuite majeure réservoir',
    description: 'Importante perte d\'eau constatée à la base du réservoir principal.',
    created_at: '2024-01-07 11:45'
  },
  {
    id: 'fr-5',
    water_point_id: 'wp-4',
    report_type: 'accès_difficile',
    priority: 'basse',
    status: 'en_cours',
    title: 'Accès sablonneux',
    description: 'Le sable bloque l\'accès des charrettes à la borne.',
    created_at: '2024-01-04 16:00'
  }
];

export const mockAIPredictions: AIPrediction[] = [
  {
    id: 'ai-1',
    water_point_id: 'wp-1',
    prediction_type: 'risque_panne',
    confidence_score: 85,
    risk_level: 'faible',
    recommendation: 'Continuer le monitoring standard. Pas d\'intervention immédiate requise.'
  },
  {
    id: 'ai-2',
    water_point_id: 'wp-4',
    prediction_type: 'besoin_maintenance',
    confidence_score: 92,
    risk_level: 'moyen',
    recommendation: 'Prévoir une révision préventive des joints dans les 30 prochains jours.'
  },
  {
    id: 'ai-3',
    water_point_id: 'wp-2',
    prediction_type: 'risque_panne',
    confidence_score: 78,
    risk_level: 'élevé',
    recommendation: 'Probabilité élevée de défaillance moteur due aux vibrations anormales.'
  }
];

export const mockMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'mr-1',
    water_point_id: 'wp-2',
    maintenance_type: 'préventive',
    status: 'en_cours',
    scheduled_date: '2024-02-10',
    priority: 'normale',
    description: 'Nettoyage périodique et vérification de la structure du puits.'
  },
  {
    id: 'mr-2',
    water_point_id: 'wp-5',
    maintenance_type: 'corrective',
    status: 'planifié',
    scheduled_date: '2024-01-15',
    priority: 'haute',
    description: 'Remplacement de la valve de sortie et soudure de la clôture.'
  },
  {
    id: 'mr-3',
    water_point_id: 'wp-3',
    maintenance_type: 'urgence',
    status: 'planifié',
    scheduled_date: '2024-01-12',
    priority: 'critique',
    description: 'Déblocage de la colonne montante et changement de piston.'
  }
];

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'cp-1',
    author_id: 'u-1',
    title: 'Formation maintenance',
    content: 'La session de formation pour les techniciens locaux de Beloha aura lieu mardi prochain à la mairie.',
    post_type: 'info',
    likes_count: 12,
    created_at: '2024-01-04'
  }
];
