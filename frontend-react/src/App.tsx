import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Dashboard from './pages/Dashboard';
import Companies from './pages/Companies';
import Vehicles from './pages/Vehicles';

const queryClient = new QueryClient();

function App() {
  return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-950 text-white">

            {/* Sidebar */}
            <aside className="fixed top-0 left-0 h-full w-64 bg-gray-900 border-r border-gray-800 p-6">
              <div className="mb-8">
                <h1 className="text-xl font-bold text-blue-400">FleetWise AI</h1>
                <p className="text-xs text-gray-500 mt-1">Fleet Management</p>
              </div>
              <nav className="space-y-1">
                <NavLink
                    to="/"
                    end
                    className={({ isActive }: { isActive: boolean }) =>
                        `block px-4 py-2 rounded-lg text-sm transition-colors ${
                            isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'
                        }`
                    }
                >
                  Dashboard
                </NavLink>
                <NavLink
                    to="/companies"
                    className={({ isActive }: { isActive: boolean }) =>
                        `block px-4 py-2 rounded-lg text-sm transition-colors ${
                            isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'
                        }`
                    }
                >
                  Companies
                </NavLink>
                <NavLink
                    to="/vehicles"
                    className={({ isActive }: { isActive: boolean }) =>
                        `block px-4 py-2 rounded-lg text-sm transition-colors ${
                            isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'
                        }`
                    }
                >
                  Vehicles
                </NavLink>
              </nav>
            </aside>

            {/* Main content */}
            <main className="ml-64 p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/companies" element={<Companies />} />
                <Route path="/vehicles" element={<Vehicles />} />
              </Routes>
            </main>

          </div>
        </BrowserRouter>
      </QueryClientProvider>
  );
}

export default App;