import { Report, ItemRequest, VehicleRental } from '@/types/index';
import { RowDataPacket } from 'mysql2';
import pool from '@/src/utils/db';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function getReports() {
  const response = await fetch('/api/reports');
  if (!response.ok) throw new Error('Failed to fetch reports');
  return response.json();
}

export const getItemRequests = async (): Promise<ItemRequest[]> => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM item_requests');
  return rows as ItemRequest[];
};

export const getVehicleRentals = async (): Promise<VehicleRental[]> => {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM vehicle_rentals');
  return rows as VehicleRental[];
};

export async function createReport(report: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<Report> {
  return fetchApi<Report>('reports', {
    method: 'POST',
    body: JSON.stringify(report),
  });
}

// Add similar functions for createItemRequest and createVehicleRental

