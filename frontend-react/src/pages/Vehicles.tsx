import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '../services/api';
import type { Vehicle } from '../types';

export default function Vehicles() {
    const { data: vehicles, isLoading, isError } = useQuery<Vehicle[]>({
        queryKey: ['vehicles'],
        queryFn: vehicleService.findAll,
    });

    if (isLoading) return <p className="text-gray-400">Loading...</p>;
    if (isError) return <p className="text-red-400">Error loading vehicles.</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Vehicles</h2>

            {vehicles?.length === 0 ? (
                <p className="text-gray-400">No vehicles yet.</p>
            ) : (
                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-800">
                        <th className="pb-3">License Plate</th>
                        <th className="pb-3">Brand</th>
                        <th className="pb-3">Model</th>
                        <th className="pb-3">Year</th>
                        <th className="pb-3">Fuel Type</th>
                        <th className="pb-3">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {vehicles?.map((vehicle) => (
                        <tr key={vehicle.id} className="border-b border-gray-800 hover:bg-gray-900">
                            <td className="py-3 font-mono">{vehicle.licensePlate}</td>
                            <td className="py-3">{vehicle.brand}</td>
                            <td className="py-3">{vehicle.model}</td>
                            <td className="py-3">{vehicle.year}</td>
                            <td className="py-3">{vehicle.fuelType}</td>
                            <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                      vehicle.active
                          ? 'bg-green-900 text-green-400'
                          : 'bg-red-900 text-red-400'
                  }`}>
                    {vehicle.active ? 'Active' : 'Inactive'}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}