export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'participant';
}

export interface Report {
  id?: number;
  token: string;
  nama: string;
  status: 'pending' | 'in_progress' | 'resolved';
  tanggal: string;
  lokasi: string;
  lokasiSpesifik?: string;
  keterangan?: string;
  gambar?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ItemRequest {
  id?: number;
  nama: string;
  department: string;
  tanggal: string;
  itemType: 'atk' | 'chemical' | 'printer' | 'scanner' | 'computer' | 'laptop';
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface VehicleRental {
  id?: number;
  nama: string;
  handphone?: string;
  vehicleType: 'car' | 'motorcycle' | 'pickup' | 'ambulance';
  driver?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_use' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}

