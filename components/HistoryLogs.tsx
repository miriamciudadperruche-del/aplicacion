
import React from 'react';
import { WorkLog, LogType } from '../types';
import { LogIn, LogOut, MapPin, Camera, Clock } from 'lucide-react';

interface HistoryLogsProps {
  logs: WorkLog[];
}

const HistoryLogs: React.FC<HistoryLogsProps> = ({ logs }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">Registros Recientes</h3>
        <span className="text-sm text-slate-400">{logs.length} registros totales</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Empleado</th>
              <th className="px-6 py-4">Tipo</th>
              <th className="px-6 py-4">Fecha y Hora</th>
              <th className="px-6 py-4">Evidencia</th>
              <th className="px-6 py-4">Ubicación</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                  <Clock className="mx-auto mb-2 opacity-20" size={40} />
                  No hay registros de actividad todavía.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs">
                        {log.staffName[0]}
                      </div>
                      <span className="font-medium text-slate-700">{log.staffName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${log.type === LogType.IN ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
                      {log.type === LogType.IN ? <LogIn size={12} /> : <LogOut size={12} />}
                      {log.type === LogType.IN ? 'ENTRADA' : 'SALIDA'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-700">{new Date(log.timestamp).toLocaleDateString()}</span>
                      <span className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {log.photo ? (
                      <div className="group relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200">
                        <img src={log.photo} alt="Verification" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                           <Camera size={14} className="text-white" />
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-300 italic">No disponible</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {log.location ? (
                      <button 
                        onClick={() => window.open(`https://www.google.com/maps?q=${log.location?.lat},${log.location?.lng}`, '_blank')}
                        className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
                      >
                        <MapPin size={16} />
                        <span className="text-xs font-medium">Ver mapa</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-300 italic">No disponible</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryLogs;
