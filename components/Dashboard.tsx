
import React, { useState, useEffect } from 'react';
import { Staff, WorkLog, LogType } from '../types';
import { Users, LogIn, LogOut, Activity, BrainCircuit, Sparkles, Download } from 'lucide-react';
import { analyzeAttendance } from '../services/geminiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  staff: Staff[];
  logs: WorkLog[];
}

const Dashboard: React.FC<DashboardProps> = ({ staff, logs }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const activeNow = staff.filter(s => s.currentWorkStatus === 'IN').length;
  const totalStaff = staff.length;

  const handleRunAiAnalysis = async () => {
    setLoadingAi(true);
    const result = await analyzeAttendance(logs, staff);
    setAiAnalysis(result || '');
    setLoadingAi(false);
  };

  const getChartData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const start = new Date(date.setHours(0, 0, 0, 0)).getTime();
      const end = new Date(date.setHours(23, 59, 59, 999)).getTime();
      
      const count = logs.filter(l => l.timestamp >= start && l.timestamp <= end).length;
      data.push({
        name: date.toLocaleDateString('es-ES', { weekday: 'short' }),
        logs: count
      });
    }
    return data;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {deferredPrompt && (
        <div className="bg-indigo-600 text-white p-4 rounded-2xl flex items-center justify-between shadow-lg animate-bounce-short">
          <div className="flex items-center gap-3">
            <Download size={20} />
            <p className="text-sm font-bold text-white">Instala StaffSync en tu escritorio para acceso rápido.</p>
          </div>
          <button 
            onClick={handleInstallClick}
            className="px-4 py-2 bg-white text-indigo-600 rounded-xl text-xs font-black uppercase tracking-wider"
          >
            Instalar Ahora
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Personal Activo" 
          value={activeNow.toString()} 
          subtitle={`${totalStaff} total registrados`}
          icon={<Users className="text-indigo-600" />}
          trend={`${Math.round((activeNow / (totalStaff || 1)) * 100)}% de ocupación`}
        />
        <StatCard 
          title="Entradas Hoy" 
          value={logs.filter(l => l.type === LogType.IN && new Date(l.timestamp).toDateString() === new Date().toDateString()).length.toString()} 
          subtitle="Últimas 24 horas"
          icon={<LogIn className="text-emerald-600" />}
        />
        <StatCard 
          title="Salidas Hoy" 
          value={logs.filter(l => l.type === LogType.OUT && new Date(l.timestamp).toDateString() === new Date().toDateString()).length.toString()} 
          subtitle="Últimas 24 horas"
          icon={<LogOut className="text-orange-600" />}
        />
        <StatCard 
          title="Actividad Total" 
          value={logs.length.toString()} 
          subtitle="Registros históricos"
          icon={<Activity className="text-blue-600" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
            Tendencia de Actividad Semanal
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getChartData()}>
                <defs>
                  <linearGradient id="colorLogs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="logs" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorLogs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 p-6 rounded-2xl border border-indigo-700 shadow-xl text-white">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <BrainCircuit className="text-indigo-300" />
              Asistente IA
            </h3>
            <button 
              onClick={handleRunAiAnalysis}
              disabled={loadingAi}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
            >
              {loadingAi ? 'Analizando...' : <><Sparkles size={14} /> Actualizar</>}
            </button>
          </div>

          <div className="space-y-4">
            {aiAnalysis ? (
              <div className="text-sm text-indigo-100 leading-relaxed whitespace-pre-wrap">
                {aiAnalysis}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center opacity-60">
                <BrainCircuit size={40} className="mb-4" />
                <p className="text-sm">Genera un análisis inteligente de la asistencia con Gemini AI</p>
                <button 
                  onClick={handleRunAiAnalysis}
                  className="mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-sm font-semibold transition-all"
                >
                  Iniciar Análisis
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, trend }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 group-hover:bg-slate-100 rounded-xl transition-colors">
        {icon}
      </div>
      {trend && <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">{trend}</span>}
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <h4 className="text-2xl font-bold text-slate-800 mt-1">{value}</h4>
      <p className="text-slate-400 text-xs mt-1">{subtitle}</p>
    </div>
  </div>
);

export default Dashboard;
