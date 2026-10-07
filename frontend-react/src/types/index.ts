export interface Company {
    id: number;
    name: string;
    taxNumber: string;
    createdAt: string;
}

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