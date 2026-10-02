import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, ReferenceLine
} from 'recharts';
import { 
  ShieldAlert, Activity, Server, UploadCloud, CheckCircle, AlertTriangle, 
  Search, Bell, Settings, ArrowUpRight, ArrowDownRight, Clock
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// --- MOCK DATA GENERATOR FOR PRO LOOK ---
const generateTimeSeriesData = () => {
  const data = [];
  const now = new Date();
  for (let i = 24; i >= 0; i--) {
    const isAnomaly = i === 4 || i === 3; // Spike 3-4 hours ago
    data.push({
      time: new Date(now.getTime() - i * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      bytes: isAnomaly ? 8500 + Math.random() * 2000 : 2000 + Math.random() * 1000,
      flows: isAnomaly ? 450 + Math.random() * 100 : 120 + Math.random() * 50,
      score: isAnomaly ? 3.8 + Math.random() * 1.5 : 0.5 + Math.random() * 1.2,
      threshold: 3.0
    });
  }
  return data;
};
const mockData = generateTimeSeriesData();

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [health, setHealth] = useState('checking...');
  
  useEffect(() => {
    axios.get(`${API_URL}/health`)
      .then(res => setHealth(res.data.status))
      .catch(() => setHealth('offline'));
  }, []);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <ShieldAlert className="w-7 h-7 text-indigo-500 mr-3" />
          <span className="font-bold text-lg text-slate-100 tracking-wide">NetGuard<span className="text-indigo-500">ML</span></span>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-2">
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu Principal</p>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'hover:bg-slate-800 hover:text-slate-100'}`}
          >
            <Activity className="w-5 h-5 mr-3" /> Vue Globale
          </button>
          <button 
            onClick={() => setActiveTab('analysis')}
            className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-colors ${activeTab === 'analysis' ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'hover:bg-slate-800 hover:text-slate-100'}`}
          >
            <Server className="w-5 h-5 mr-3" /> Institutions
          </button>
          <button 
            onClick={() => setActiveTab('import')}
            className={`w-full flex items-center px-4 py-2.5 rounded-lg transition-colors ${activeTab === 'import' ? 'bg-indigo-600/10 text-indigo-400 font-medium' : 'hover:bg-slate-800 hover:text-slate-100'}`}
          >
            <UploadCloud className="w-5 h-5 mr-3" /> Import Batch
          </button>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center px-2">
            <div className={`w-2.5 h-2.5 rounded-full mr-3 ${health === 'ok' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}></div>
            <span className="text-sm font-medium">{health === 'ok' ? 'API Connectée' : 'API Déconnectée'}</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* HEADER */}
        <header className="h-16 flex items-center justify-between px-8 bg-slate-900/50 border-b border-slate-800 backdrop-blur-sm z-10">
          <h1 className="text-xl font-semibold text-slate-100 capitalize">{activeTab.replace('-', ' ')}</h1>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
              <input type="text" placeholder="Rechercher une IP, ASN..." className="bg-slate-900 border border-slate-700 text-sm rounded-full pl-9 pr-4 py-1.5 focus:outline-none focus:border-indigo-500 transition-colors w-64" />
            </div>
            <button className="relative text-slate-400 hover:text-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <button className="text-slate-400 hover:text-slate-100 transition-colors"><Settings className="w-5 h-5" /></button>
          </div>
        </header>

        {/* SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {activeTab === 'dashboard' && (
            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
              {/* KPI CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-slate-400 text-sm font-medium">Trafic Global (24h)</div>
                    <Activity className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-3xl font-bold text-slate-100">4.2 TB</div>
                  <div className="flex items-center mt-2 text-xs text-emerald-500">
                    <ArrowUpRight className="w-3 h-3 mr-1" /> <span>+12.5% vs hier</span>
                  </div>
                </div>
                
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-slate-400 text-sm font-medium">Institutions Actives</div>
                    <Server className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="text-3xl font-bold text-slate-100">283</div>
                  <div className="flex items-center mt-2 text-xs text-slate-500">
                    <CheckCircle className="w-3 h-3 mr-1" /> <span>Toutes en ligne</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/10 rounded-bl-full"></div>
                  <div className="flex justify-between items-start mb-4 relative">
                    <div className="text-slate-400 text-sm font-medium">Alertes Critiques</div>
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="text-3xl font-bold text-rose-500 relative">14</div>
                  <div className="flex items-center mt-2 text-xs text-rose-500 relative">
                    <ArrowUpRight className="w-3 h-3 mr-1" /> <span>+3 depuis 1h</span>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-slate-400 text-sm font-medium">Taux d'Anomalie (Z-Score)</div>
                    <Activity className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-3xl font-bold text-slate-100">1.8%</div>
                  <div className="flex items-center mt-2 text-xs text-emerald-500">
                    <ArrowDownRight className="w-3 h-3 mr-1" /> <span>-0.4% vs hier</span>
                  </div>
                </div>
              </div>

              {/* CHARTS ROW */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* MAIN TRAFFIC CHART */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-2 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-base font-semibold text-slate-100">Volume de Trafic (Agrégé) & Alertes</h2>
                    <select className="bg-slate-950 border border-slate-800 text-xs rounded-md px-2 py-1 focus:outline-none focus:border-indigo-500 text-slate-400">
                      <option>Dernières 24 heures</option>
                      <option>7 derniers jours</option>
                    </select>
                  </div>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorBytes" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v/1000).toFixed(1)}k`} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', color: '#f8fafc' }}
                          itemStyle={{ color: '#818cf8' }}
                        />
                        <Area type="monotone" dataKey="bytes" name="Volume (Bytes)" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorBytes)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* ANOMALY SCORE CHART */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-base font-semibold text-slate-100">Score Composite LSTM</h2>
                  </div>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="time" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem' }}
                        />
                        <ReferenceLine y={3.0} stroke="#f43f5e" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Seuil Critique', fill: '#f43f5e', fontSize: 10 }} />
                        <Line type="monotone" dataKey="score" name="Score Z" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#f59e0b', stroke: '#0f172a', strokeWidth: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* RECENT ALERTS TABLE */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                  <h2 className="text-base font-semibold text-slate-100">Dernières Détections (Mahalanobis)</h2>
                  <button className="text-indigo-400 text-sm hover:text-indigo-300 font-medium">Voir tout</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                        <th className="px-6 py-3 font-medium">Institution ID</th>
                        <th className="px-6 py-3 font-medium">Heure</th>
                        <th className="px-6 py-3 font-medium">Type d'Alerte</th>
                        <th className="px-6 py-3 font-medium">Score Composite</th>
                        <th className="px-6 py-3 font-medium">Métriques Clés</th>
                        <th className="px-6 py-3 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-800/50">
                      <tr className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-200">INST_084</td>
                        <td className="px-6 py-4 text-slate-400"><div className="flex items-center"><Clock className="w-3 h-3 mr-1.5"/> 14:23</div></td>
                        <td className="px-6 py-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20">Comportement</span></td>
                        <td className="px-6 py-4 font-mono text-rose-400">4.12</td>
                        <td className="px-6 py-4 text-slate-400">tcp_udp_ratio, sum_n_dest_ip</td>
                        <td className="px-6 py-4 text-right"><button className="text-indigo-400 hover:text-indigo-300">Analyser</button></td>
                      </tr>
                      <tr className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-200">INST_211</td>
                        <td className="px-6 py-4 text-slate-400"><div className="flex items-center"><Clock className="w-3 h-3 mr-1.5"/> 12:45</div></td>
                        <td className="px-6 py-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">Volume</span></td>
                        <td className="px-6 py-4 font-mono text-amber-400">3.05</td>
                        <td className="px-6 py-4 text-slate-400">n_bytes_log1p</td>
                        <td className="px-6 py-4 text-right"><button className="text-indigo-400 hover:text-indigo-300">Analyser</button></td>
                      </tr>
                      <tr className="hover:bg-slate-800/20 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-200">INST_012</td>
                        <td className="px-6 py-4 text-slate-400"><div className="flex items-center"><Clock className="w-3 h-3 mr-1.5"/> 09:12</div></td>
                        <td className="px-6 py-4"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20">Critique (Les 2)</span></td>
                        <td className="px-6 py-4 font-mono text-rose-500 font-semibold">5.88</td>
                        <td className="px-6 py-4 text-slate-400">n_flows, dir_ratio_bytes</td>
                        <td className="px-6 py-4 text-right"><button className="text-indigo-400 hover:text-indigo-300">Analyser</button></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Server className="w-8 h-8 text-slate-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-100 mb-2">Sélectionnez une Institution</h2>
                <p className="text-slate-400 max-w-md mx-auto mb-6">
                  Le moteur d'inférence en temps réel est prêt. Veuillez configurer le flux de données ou sélectionner une institution dans la liste pour visualiser la reconstruction LSTM et les résidus d'erreur.
                </p>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Ouvrir le Sélecteur
                </button>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
               <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                 <h2 className="text-xl font-bold text-slate-100 mb-2">Analyse Batch (Fichier CSV)</h2>
                 <p className="text-slate-400 mb-8 text-sm">Uploadez un fichier contenant des fenêtres de 24 pas pour générer un rapport complet de détection avec le modèle LSTM + MinCovDet.</p>
                 
                 <div className="border-2 border-dashed border-slate-700 rounded-xl p-12 text-center hover:border-indigo-500 hover:bg-slate-800/30 transition-all cursor-pointer group">
                    <div className="w-16 h-16 bg-slate-800 group-hover:bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                      <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <p className="text-slate-200 font-medium mb-1">Glissez-déposez votre fichier .csv ici</p>
                    <p className="text-slate-500 text-sm mb-4">Supporte les exports structurés (max 50 MB)</p>
                    <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                      Parcourir les fichiers
                    </button>
                 </div>
               </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
