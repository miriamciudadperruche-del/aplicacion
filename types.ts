
export enum LogType {
  IN = 'IN',
  OUT = 'OUT'
}

export enum StaffStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface Staff {
  id: string;
  name: string;
  position: string;
  status: StaffStatus;
  currentWorkStatus: 'IN' | 'OUT';
  avatar?: string;
}

export interface WorkLog {
  id: string;
  staffId: string;
  staffName: string;
  type: LogType;
  timestamp: number;
  photo?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface AppState {
  staff: Staff[];
  logs: WorkLog[];
}
