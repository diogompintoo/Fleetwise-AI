import { useQuery } from '@tanstack/react-query';
import { companyService, vehicleService, tripService, fuelingService } from '../services/api';

export default function Dashboard() {
    const { data: companies } = useQuery({
        queryKey: ['companies'],
        queryFn: companyService.findAll,
    });

    const { data: vehicles } = useQuery({
        queryKey: ['vehicles'],
        queryFn: vehicleService.findAll,
    });

    const { data: trips } = useQuery({
        queryKey: ['trips'],
        queryFn: tripService.findAll,
    });

    const { data: fuelings } = useQuery({
        queryKey: ['fuelings'],
        queryFn: fuelingService.findAll,
    });

    const totalKm = trips?.reduce((sum: number, t: any) => sum + t.distance, 0) ?? 0;
    const totalFuelCost = fuelings?.reduce((sum: number, f: any) => sum + f.totalCost, 0) ?? 0;
    const totalLiters = fuelings?.reduce((sum: number, f: any) => sum + f.liters, 0) ?? 0;

    const stats = [
        { label: 'Companies', value: companies?.length ?? 0 },
        { label: 'Vehicles', value: vehicles?.length ?? 0 },
        { label: 'Total KM', value: totalKm.toFixed(0) },
        { label: 'Fuel Cost (€)', value: totalFuelCost.toFixed(2) },
        { label: 'Liters Used', value: totalLiters.toFixed(1) },
        { label: 'Trips', value: trips?.length ?? 0 },
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
            <p className="text-gray-400 mb-8">Fleet overview — real-time data</p>

            <div className="grid grid-cols-3 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                        <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}