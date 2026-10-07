export interface Fueling {
  id: number;
  date: string;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  odometer: number;
  fuelStation: string;
  vehicleId: number;
}

export interface CreateFuelingRequest {
  date: string;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  odometer: number;
  fuelStation: string;
  vehicleId: number;
}

