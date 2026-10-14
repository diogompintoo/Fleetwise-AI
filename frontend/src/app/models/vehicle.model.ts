export interface Vehicle {
  id: number;
  companyId: number;
  companyName: string;
  licensePlate: string;
  brand: string;
  model: string;
  manufactureYear: number;
  fuelType: string;
  initialMileage: number;
  active: boolean;
}

export interface CreateVehicleRequest {
  companyId: number;
  licensePlate: string;
  brand: string;
  model: string;
  manufactureYear: number;
  fuelType: string;
  initialMileage: number;
}

export interface UpdateVehicleRequest {
  licensePlate: string;
  brand: string;
  model: string;
  manufactureYear: number;
  fuelType: string;
  active: boolean;
}