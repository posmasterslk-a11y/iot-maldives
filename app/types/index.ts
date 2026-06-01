export interface User {
  id: string | number;
  username: string;
  role: 'Admin' | 'Viewer';
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  [key: string]: any;
}

export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
  total?: number;
}

export interface Device {
  code: string;
  deviceType: string;
  status: 'online' | 'offline' | 'alarm';
  pumpState?: 'idle' | 'pumping' | 'offline';
  lastReading: string;
  battery_voltage?: string | number;
  gps_longitude?: string | number;
  gps_latitude?: string | number;
  mainTankLevel?: number;
  mainTankPercentage?: number;
  totalizer?: number;
  currentSessionVolume?: number;
  flowRate?: number;
  location?: string;
  [key: string]: any;
}

export interface SensorData {
  created_at: string;
  battery_voltage?: string | number;
  status?: string;
  gps_longitude?: string | number;
  gps_latitude?: string | number;
  event?: string;
  event_desc?: string;
  [key: string]: any; // Allow dynamic fields
}

export interface DeviceDataQuery extends PaginationParams {
  deviceType: string;
  code: string;
  start?: string;
  end?: string;
}
