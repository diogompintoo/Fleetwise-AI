import { useQuery } from '@tanstack/react-query';
import { companyService } from '../services/api';
import type { Company } from '../types';

export default function Companies() {
    const { data: companies, isLoading, isError } = useQuery<Company[]>({
        queryKey: ['companies'],
        queryFn: companyService.findAll,
    });

    if (isLoading) return <p className="text-gray-400">Loading...</p>;
    if (isError) return <p className="text-red-400">Error loading companies.</p>;

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Companies</h2>

            {companies?.length === 0 ? (
                <p className="text-gray-400">No companies yet.</p>
            ) : (
                <table className="w-full text-sm">
                    <thead>
                    <tr className="text-left text-gray-400 border-b border-gray-800">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Tax Number</th>
                        <th className="pb-3">Created At</th>
                    </tr>
                    </thead>
                    <tbody>
                    {companies?.map((company) => (
                        <tr key={company.id} className="border-b border-gray-800 hover:bg-gray-900">
                            <td className="py-3">{company.name}</td>
                            <td className="py-3">{company.taxNumber}</td>
                            <td className="py-3">{new Date(company.createdAt).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}