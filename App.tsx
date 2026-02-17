
import React, { useState, useEffect } from 'react';
import { Layout, UserCheck, History, Settings, LayoutDashboard, Search, Bell, LogOut } from 'lucide-react';
import { Staff, WorkLog, StaffStatus, LogType } from './types';
import Dashboard from './components/Dashboard';
import ClockStation from './components/ClockStation';
import HistoryLogs from './components/HistoryLogs';
import AdminPanel from './components/AdminPanel';
import DynamicIsland from './components/DynamicIsland';
import AdminAuthGate from './components/AdminAuthGate';

const INITIAL_STAFF: Staff[] = [
  { id: '1', name: 'Ana García', position: 'Desarrolladora Senior', status: StaffStatus.ACTIVE, currentWorkStatus: 'OUT' },
  { id: '2', name: 'Carlos Ruiz', position: 'Diseñador UI/UX', status: StaffStatus.ACTIVE, currentWorkStatus: 'OUT' },
  { id: '3', name: 'Elena Beltrán', position: 'Gerente de Proyecto', status: StaffStatus.ACTIVE, currentWorkStatus: 'OUT' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clock' | 'history' | 'admin'>('dashboard');
  const [lastLog, setLastLog] = useState<WorkLog | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('staff_data');
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });
  const [logs, setLogs] = useState<WorkLog[]>(() => {
    const saved = localStorage.getItem('logs_data');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('staff_data', JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem('logs_data', JSON.stringify(logs));
  }, [logs]);

  const handleClockAction = (staffId: string, type: LogType, photo?: string, location?: {lat: number, lng: number}) => {
    const employee = staff.find(s => s.id === staffId);
    if (!employee) return;

    const newLog: WorkLog = {
      id: crypto.randomUUID(),
      staffId,
      staffName: employee.name,
      type,
      timestamp: Date.now(),
      photo,
      location
    };

    setLogs(prev => [newLog, ...prev]);
    setLastLog(newLog);
    setStaff(prev => prev.map(s => 
      s.id === staffId ? { ...s, currentWorkStatus: type === LogType.IN ? 'IN' : 'OUT' } : s
    ));
  };

  const activeCount = staff.filter(s => s.currentWorkStatus === 'IN').length;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard staff={staff} logs={logs} />;
      case 'clock':
        return <ClockStation staff={staff.filter(s => s.status === StaffStatus.ACTIVE)} onClockAction={handleClockAction} />;
      case 'history':
        return <HistoryLogs logs={logs} />;
      case 'admin':
        if (!isAdminAuthenticated) {
          return <AdminAuthGate onSuccess={() => setIsAdminAuthenticated(true)} />;
        }
        return (
          <div className="space-y-4">
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setIsAdminAuthenticated(false)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-all"
              >
                <LogOut size={14} />
                CERRAR SESIÓN ADMIN
              </button>
            </div>
            <AdminPanel staff={staff} setStaff={setStaff} logs={logs} setLogs={setLogs} />
          </div>
        );
      default:
        return <Dashboard staff={staff} logs={logs} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      <DynamicIsland lastLog={lastLog} activeCount={activeCount} />

      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">StaffSync</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800/50'}`}
          >
            <LayoutDashboard size={20} />
            <span>Panel Control</span>
          </button>
          <button 
            onClick={() => setActiveTab('clock')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'clock' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800/50'}`}
          >
            <UserCheck size={20} />
            <span>Registrar Entrada</span>
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800/50'}`}
          >
            <History size={20} />
            <span>Historial</span>
          </button>
          <button 
            onClick={() => setActiveTab('admin')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'admin' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800/50'}`}
          >
            <Settings size={20} />
            <span>Administración</span>
          </button>
        </nav>

        <div className="p-6 border-t border-indigo-800">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-indigo-800/30">
            <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center font-bold">A</div>
            <div>
              <p className="text-sm font-medium">Administrador</p>
              <p className="text-xs text-indigo-300">{isAdminAuthenticated ? 'Sessión Activa' : 'Área Protegida'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-slate-800 capitalize">
              {activeTab === 'dashboard' ? 'Dashboard' : 
               activeTab === 'clock' ? 'Registro de Tiempo' : 
               activeTab === 'history' ? 'Historial Completo' : 'Gestión de Personal'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {renderContent()}
        </div>

        {/* Mobile Nav */}
        <nav className="md:hidden h-16 bg-white border-t border-slate-200 flex items-center justify-around shrink-0 px-2">
           <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-slate-400'}`}>
              <LayoutDashboard size={20} />
              <span className="text-[10px] font-medium">Panel</span>
           </button>
           <button onClick={() => setActiveTab('clock')} className={`flex flex-col items-center gap-1 ${activeTab === 'clock' ? 'text-indigo-600' : 'text-slate-400'}`}>
              <UserCheck size={20} />
              <span className="text-[10px] font-medium">Reloj</span>
           </button>
           <button onClick={() => setActiveTab('admin')} className={`flex flex-col items-center gap-1 ${activeTab === 'admin' ? 'text-indigo-600' : 'text-slate-400'}`}>
              <Settings size={20} />
              <span className="text-[10px] font-medium">Admin</span>
           </button>
        </nav>
      </main>
    </div>
  );
};

export default App;
