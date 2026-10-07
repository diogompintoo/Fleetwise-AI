export interface Trip {
  id: number;
  date: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  startMileage: number;
  endMileage: number;
  purpose: string;
  vehicleId: number;
  driverId: number;
}

export interface CreateTripRequest {
  date: string;
  startLocation: string;
  endLocation: string;
  startMileage: number;
  endMileage: number;
  purpose: string;
  vehicleId: number;
  driverId: number;
}

