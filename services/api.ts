
import { WaterPoint, User, FieldReport, MaintenanceRecord, Notification } from '../types';
import { mockWaterPoints, mockFieldReports, mockMaintenanceRecords } from '../mockData';

const STORAGE_KEYS = {
  WATER_POINTS: 'mionjo_water_points',
  USERS: 'mionjo_users',
  REPORTS: 'mionjo_reports',
  MAINTENANCE: 'mionjo_maintenance',
  NOTIFICATIONS: 'mionjo_notifications'
};

class ApiService {
  private getStorage<T>(key: string, defaultValue: T[]): T[] {
    const data = localStorage.getItem(key);
    if (!data) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(data);
  }

  private setStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Water Points
  getWaterPoints(): WaterPoint[] {
    return this.getStorage<WaterPoint>(STORAGE_KEYS.WATER_POINTS, mockWaterPoints);
  }

  addWaterPoint(point: WaterPoint): void {
    const points = this.getWaterPoints();
    this.setStorage(STORAGE_KEYS.WATER_POINTS, [point, ...points]);
  }

  addWaterPoints(newPoints: WaterPoint[]): void {
    const points = this.getWaterPoints();
    this.setStorage(STORAGE_KEYS.WATER_POINTS, [...newPoints, ...points]);
  }

  // Users
  getUsers(): User[] {
    const defaultUsers: User[] = [
      { id: '1', email: 'admin@mionjo.mg', full_name: 'Rakoto Pierre', role: 'admin', organization: 'MIONJO', region: 'Androy', is_active: true }
    ];
    return this.getStorage<User>(STORAGE_KEYS.USERS, defaultUsers);
  }

  addUser(user: User): void {
    const users = this.getUsers();
    this.setStorage(STORAGE_KEYS.USERS, [user, ...users]);
  }

  updateUser(id: string, updates: Partial<User>): void {
    const users = this.getUsers();
    this.setStorage(STORAGE_KEYS.USERS, users.map(u => u.id === id ? { ...u, ...updates } : u));
  }

  deleteUser(id: string): void {
    const users = this.getUsers();
    this.setStorage(STORAGE_KEYS.USERS, users.filter(u => u.id !== id));
  }

  // Reports
  getReports(): FieldReport[] {
    return this.getStorage<FieldReport>(STORAGE_KEYS.REPORTS, mockFieldReports);
  }

  addReport(report: FieldReport): void {
    const reports = this.getReports();
    this.setStorage(STORAGE_KEYS.REPORTS, [report, ...reports]);
  }

  // Notifications (Simulated Email)
  getNotifications(): Notification[] {
    return this.getStorage<Notification>(STORAGE_KEYS.NOTIFICATIONS, []);
  }

  sendNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'is_read'>): void {
    const notifications = this.getNotifications();
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      is_read: false
    };
    this.setStorage(STORAGE_KEYS.NOTIFICATIONS, [newNotification, ...notifications]);
    
    // Logic to simulate actual external triggers could be added here
    console.log(`[SIMULATED EMAIL SENT] TO: ${notification.recipient} SUBJECT: ${notification.subject}`);
  }

  markNotificationRead(id: string): void {
    const notifications = this.getNotifications();
    this.setStorage(STORAGE_KEYS.NOTIFICATIONS, notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  }
}

export const api = new ApiService();
