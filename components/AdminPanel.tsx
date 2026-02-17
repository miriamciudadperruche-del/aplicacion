
import React, { useState } from 'react';
import { Staff, StaffStatus, WorkLog } from '../types';
import { UserPlus, Trash2, ShieldAlert, Check, X, UserCog, BadgeCheck, Briefcase } from 'lucide-react';

interface AdminPanelProps {
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
  logs: WorkLog[];
  setLogs: React.Dispatch<React.SetStateAction<WorkLog[]>>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ staff, setStaff, logs, setLogs }) => {
  const [newStaff, setNewStaff] = useState({ name: '', position: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.position) return;
    
    const employee: Staff = {
      id: crypto.randomUUID(),
      name: newStaff.name,
      position: newStaff.position,
      status: StaffStatus.ACTIVE,
      currentWorkStatus: 'OUT'
    };
    
    setStaff(prev => [...prev, employee]);
    setNewStaff({ name: '', position: '' });
  };

  const toggleStaffStatus = (id: string) => {
    setStaff(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === StaffStatus.ACTIVE ? StaffStatus.INACTIVE : StaffStatus.ACTIVE } : s
    ));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Registration Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
            <h2 className="text-2xl font-black text-slate-800 mb-2 flex items-center gap-3">
              <UserPlus className="text-indigo-600" size={28} />
              Registro de Nuevo Personal
            </h2>
            <p className="text-slate-500 mb-8 font-medium">Completa los datos para dar de alta un nuevo miembro en el equipo.</p>
            
            <form onSubmit={handleAddStaff} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block transition-colors group-focus-within:text-indigo-600">Nombre del Empleado</label>
                  <input 
                    type="text" 
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                    placeholder="Ej: Roberto Sánchez"
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-800"
                  />
                </div>
                <div className="relative group">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block transition-colors group-focus-within:text-indigo-600">Cargo o Departamento</label>
                  <input 
                    type="text" 
                    value={newStaff.position}
                    onChange={(e) => setNewStaff({...newStaff, position: e.target.value})}
                    placeholder="Ej: Logística / Ventas"
                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium text-slate-800"
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={!newStaff.name || !newStaff.position}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-[1.5rem] font-black text-lg shadow-2xl shadow-indigo-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-wider"
              >
                Registrar Empleado
              </button>
            </form>
          </div>
        </div>

        {/* Live Preview Card */}
        <div className="relative h-full flex items-center justify-center">
           <div className="absolute inset-0 bg-indigo-600/5 rounded-[3rem] -rotate-2 scale-105"></div>
           <div className="relative bg-white w-full max-w-[400px] aspect-[4/5] rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col items-center text-center p-10 animate-in zoom-in duration-500">
              <div className="mb-8 relative">
                 <div className="w-32 h-32 bg-slate-100 rounded-[2rem] flex items-center justify-center text-5xl font-black text-slate-300 ring-8 ring-indigo-50 transition-all group-hover:ring-indigo-100">
                    {newStaff.name ? newStaff.name[0].toUpperCase() : '?'}
                 </div>
                 <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl shadow-lg">
                    <BadgeCheck size={20} />
                 </div>
              </div>
              
              <div className="space-y-2 mb-8">
                 <h3 className="text-3xl font-black text-slate-800 truncate px-4">
                    {newStaff.name || 'Nombre del Personal'}
                 </h3>
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full font-bold text-sm uppercase tracking-wide">
                    <Briefcase size={14} />
                    {newStaff.position || 'Puesto de Trabajo'}
                 </div>
              </div>

              <div className="w-full pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
                 <div className="text-left">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Empresa</p>
                    <p className="text-sm font-bold text-slate-700">StaffSync Pro</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Estado</p>
                    <p className="text-sm font-bold text-emerald-500 italic">Pendiente Alta</p>
                 </div>
              </div>
              
              <div className="mt-auto text-[10px] text-slate-300 font-medium italic">Válido para todas las sedes</div>
           </div>
        </div>
      </section>

      {/* Directory Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <UserCog className="text-indigo-600" size={28} />
            Directorio Activo
          </h2>
          <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">{staff.length} Registrados</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map(s => (
            <div key={s.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${s.status === StaffStatus.ACTIVE ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                  {s.name[0]}
                </div>
                <div>
                  <h4 className={`font-black text-lg leading-tight ${s.status === StaffStatus.ACTIVE ? 'text-slate-800' : 'text-slate-400 line-through'}`}>{s.name}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{s.position}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => toggleStaffStatus(s.id)}
                  className={`p-2.5 rounded-xl transition-colors ${s.status === StaffStatus.ACTIVE ? 'text-emerald-600 hover:bg-emerald-50' : 'text-orange-600 hover:bg-orange-50'}`}
                >
                  {s.status === StaffStatus.ACTIVE ? <Check size={20} /> : <X size={20} />}
                </button>
                <button 
                  onClick={() => setStaff(prev => prev.filter(item => item.id !== s.id))}
                  className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Danger Zone Section */}
      <section className="bg-red-50/50 p-10 rounded-[3rem] border-2 border-dashed border-red-100 flex flex-col md:flex-row items-center gap-8 justify-between">
         <div className="flex items-center gap-6">
            <div className="bg-red-600 text-white p-5 rounded-[1.5rem] shadow-xl shadow-red-600/30">
               <ShieldAlert size={40} />
            </div>
            <div>
               <h3 className="text-xl font-black text-red-900">Mantenimiento de Datos</h3>
               <p className="text-red-700/60 font-medium">Borrar el historial liberará almacenamiento local del navegador.</p>
            </div>
         </div>
         
         {!showDeleteConfirm ? (
           <button 
             onClick={() => setShowDeleteConfirm(true)}
             className="px-8 py-4 bg-white text-red-600 border-2 border-red-600/20 hover:bg-red-600 hover:text-white rounded-2xl font-black transition-all shadow-xl active:scale-95"
           >
             LIMPIAR HISTORIAL
           </button>
         ) : (
           <div className="flex gap-4 animate-in zoom-in duration-300">
             <button onClick={() => setShowDeleteConfirm(false)} className="px-6 py-4 bg-slate-200 text-slate-700 rounded-2xl font-bold">CANCELAR</button>
             <button 
               onClick={() => { setLogs([]); setShowDeleteConfirm(false); }} 
               className="px-6 py-4 bg-red-600 text-white rounded-2xl font-black shadow-lg shadow-red-600/40"
             >
               SI, BORRAR TODO
             </button>
           </div>
         )}
      </section>
    </div>
  );
};

export default AdminPanel;
