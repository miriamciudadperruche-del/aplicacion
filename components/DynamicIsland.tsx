
import React, { useState, useEffect } from 'react';
import { WorkLog, LogType } from '../types';
import { Users, LogIn, LogOut, Info } from 'lucide-react';

interface DynamicIslandProps {
  lastLog: WorkLog | null;
  activeCount: number;
}

const DynamicIsland: React.FC<DynamicIslandProps> = ({ lastLog, activeCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (lastLog) {
      setShowNotification(true);
      const timer = setTimeout(() => setShowNotification(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastLog]);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          pointer-events-auto cursor-pointer
          bg-slate-900 text-white shadow-2xl
          flex items-center justify-center gap-3
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${showNotification || isExpanded ? 'px-6 py-3 rounded-[2rem]' : 'px-4 py-2 rounded-full'}
          ${isExpanded ? 'w-[320px] h-[120px]' : showNotification ? 'w-[280px] h-[48px]' : 'w-[140px] h-[36px]'}
        `}
      >
        {isExpanded ? (
          <div className="flex flex-col w-full animate-in fade-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Estado del Sistema</span>
              <Info size={14} className="text-white/40" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl">
                {activeCount}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">Personal en Turno</p>
                <p className="text-xs text-white/60">Operando actualmente</p>
              </div>
            </div>
          </div>
        ) : showNotification && lastLog ? (
          <div className="flex items-center gap-3 w-full animate-in slide-in-from-top-2 duration-300">
            <div className={`p-1.5 rounded-full ${lastLog.type === LogType.IN ? 'bg-emerald-500' : 'bg-orange-500'}`}>
              {lastLog.type === LogType.IN ? <LogIn size={14} /> : <LogOut size={14} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{lastLog.staffName}</p>
              <p className="text-[10px] text-white/60 uppercase">{lastLog.type === LogType.IN ? 'Ha entrado' : 'Ha salido'}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 animate-in fade-in duration-300">
            <Users size={14} className="text-indigo-400" />
            <span className="text-xs font-bold">{activeCount} Activos</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicIsland;
