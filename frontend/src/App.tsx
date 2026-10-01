import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea 
} from 'recharts';
import { ShieldAlert, Activity, BarChart3, UploadCloud, CheckCircle, AlertTriangle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [health, setHealth] = useState<string>('checking...');
  const [institutions, setInstitutions] = useState(0);

  useEffect(() => {
    axios.get(\/health).then(res => setHealth(res.data.status)).catch(() => setHealth('offline'));
    axios.get(\/institutions).then(res => setInstitutions(res.data.n_institutions)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-8 h-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">NetGuard ML</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-sm">
                <span className="text-gray-500">API Status:</span>
                {health === 'ok' ? (
                  <span className="flex items-center text-green-600"><CheckCircle className="w-4 h-4 mr-1"/> Online</span>
                ) : (
                  <span className="flex items-center text-red-600"><AlertTriangle className="w-4 h-4 mr-1"/> {health}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-4 mb-8">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={px-4 py-2 rounded-md font-medium flex items-center space-x-2 \}
          >
            <Activity className="w-4 h-4" /> <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('analysis')}
            className={px-4 py-2 rounded-md font-medium flex items-center space-x-2 \}
          >
            <BarChart3 className="w-4 h-4" /> <span>Analyse Institution</span>
          </button>
          <button 
            onClick={() => setActiveTab('import')}
            className={px-4 py-2 rounded-md font-medium flex items-center space-x-2 \}
          >
            <UploadCloud className="w-4 h-4" /> <span>Import CSV</span>
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Vue d'ensemble</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium mb-1">Institutions Monitorées</h3>
                <div className="text-3xl font-bold">{institutions || '--'}</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium mb-1">Alertes Récentes</h3>
                <div className="text-3xl font-bold text-orange-600">3</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium mb-1">Taux d'anomalie global</h3>
                <div className="text-3xl font-bold text-blue-600">1.2%</div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-6 h-96">
              <h3 className="text-lg font-medium mb-4">Aperçu du Flux Temps Réel (Simulé)</h3>
              <div className="flex h-full items-center justify-center text-gray-400">
                {/* Placeholder for chart */}
                <p>Graphique des tendances d'anomalies en attente de données temps réel.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
             <h2 className="text-2xl font-bold mb-4">Analyse détaillée</h2>
             <p className="text-gray-600 mb-6">Sélectionnez une institution pour voir les prédictions LSTM et les zones d'anomalie détectées.</p>
             <div className="p-12 border-2 border-dashed border-gray-200 rounded-lg text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune donnée chargée</h3>
                <p className="text-sm text-gray-500">La fonctionnalité de simulation de flux nécessite les fichiers de test .npy.</p>
             </div>
           </div>
        )}

        {activeTab === 'import' && (
           <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
             <h2 className="text-2xl font-bold mb-4">Importation Batch CSV</h2>
             <div className="mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Uploader un fichier</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p className="pl-1">ou glisser-déposer</p>
                  </div>
                  <p className="text-xs text-gray-500">CSV jusqu'à 50MB</p>
                </div>
              </div>
           </div>
        )}

      </div>
    </div>
  );
}

export default App;
