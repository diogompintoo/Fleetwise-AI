export interface Vehicle {
  id: number;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  fuelType: string;
  active: boolean;
  companyId: number;
}

export interface CreateVehicleRequest {
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  fuelType: string;
  active?: boolean;
  companyId: number;
}

