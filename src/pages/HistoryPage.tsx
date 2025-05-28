import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useScan } from '../context/ScanContext';
import ScanCard from '../components/history/ScanCard';
import { FileText, Clock, Search, PlusCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const HistoryPage: React.FC = () => {
  const { scans } = useScan();

  return (
    <AppLayout>
      {/* Container centralisé avec padding responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Scan History
            </h1>
            <div className="flex items-center mt-2 text-gray-600">
              <FileText className="h-5 w-5 mr-2 text-blue-500" />
              <p>Review and manage all your previous scans</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/scan">
              <Button icon={<PlusCircle className="h-4 w-4" />} variant="primary">
                New Scan
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 mb-8 border border-gray-100 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-amber-500 mr-2" />
              <span className="text-gray-700">
                <span className="font-medium">{scans.length}</span> scans in total
              </span>
            </div>
            <div className="flex items-center">
              <Search className="h-5 w-5 text-indigo-500 mr-2" />
              <span className="text-gray-700">
                Last scan: {scans.length > 0 
                  ? new Date(scans[0].createdAt).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })
                  : 'Never'}
              </span>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        {scans.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-2xl mx-auto">
            <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No scans yet</h3>
            <p className="text-gray-500 mb-6">
              Start by creating your first scan to see results here
            </p>
            <Link to="/scan">
              <Button icon={<PlusCircle className="h-4 w-4" />} variant="primary">
                Perform First Scan
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Barre de recherche/filtre (optionnelle) */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search scans..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Grille de scans */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {scans.map((scan) => (
                <ScanCard key={scan.id} scan={scan} />
              ))}
            </div>

            {/* Pagination (optionnelle) */}
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="px-3 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-3 py-1 rounded-md bg-blue-500 text-white">
                  1
                </button>
                <button className="px-3 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50">
                  Next
                </button>
              </nav>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default HistoryPage;