

export type UserRole = 'admin' | 'ong' | 'technicien' | 'communaute';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  organization: string;
  region: string;
  is_active: boolean;
}

export type WaterPointStatus = 'actif' | 'maintenance' | 'panne' | 'inactif' | 'en_construction';
export type WaterQuality = 'excellente' | 'bonne' | 'moyenne' | 'médiocre' | 'non_potable';

export interface WaterPoint {
  id: string;
  name: string;
  type: 'forage' | 'puits' | 'source' | 'réservoir' | 'borne_fontaine';
  status: WaterPointStatus;
  latitude: number;
  longitude: number;
  region: string;
  commune: string;
  village: string;
  daily_capacity: number;
  population_served: number;
  water_quality: WaterQuality;
  last_maintenance: string;
  next_maintenance: string;
}

export interface Measurement {
  id: string;
  water_point_id: string;
  measurement_date: string;
  flow_rate: number;
  ph_level: number;
  turbidity: number;
  equipment_status: string;
}

export interface MaintenanceRecord {
  id: string;
  water_point_id: string;
  maintenance_type: 'préventive' | 'corrective' | 'urgence' | 'amélioration';
  status: 'planifié' | 'en_cours' | 'terminé';
  scheduled_date: string;
  priority: 'basse' | 'normale' | 'haute' | 'critique';
  description: string;
}

export interface FieldReport {
  id: string;
  water_point_id: string;
  // Fix: Added 'fuite' to the union type to accommodate leak reports used in field data
  report_type: 'panne' | 'qualité_eau' | 'accès_difficile' | 'vandalisme' | 'tarissement' | 'fuite';
  priority: 'basse' | 'normale' | 'haute' | 'critique';
  status: 'nouveau' | 'en_cours' | 'résolu';
  title: string;
  description: string;
  created_at: string;
}

export interface AIPrediction {
  id: string;
  water_point_id: string;
  prediction_type: 'risque_panne' | 'besoin_maintenance' | 'qualité_eau';
  confidence_score: number;
  risk_level: 'faible' | 'moyen' | 'élevé' | 'critique';
  recommendation: string;
}

export interface CommunityPost {
  id: string;
  author_id: string;
  title: string;
  content: string;
  post_type: 'info' | 'question' | 'succès' | 'alerte';
  likes_count: number;
  created_at: string;
}