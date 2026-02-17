
import React, { useState } from 'react';
import { ShieldLock, KeyRound, ArrowRight, AlertCircle } from 'lucide-react';

interface AdminAuthGateProps {
  onSuccess: () => void;
}

const AdminAuthGate: React.FC<AdminAuthGateProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const ADMIN_PASSWORD = 'admin123'; // Contraseña predeterminada

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
      setPassword('');
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] border border-slate-200 shadow-2xl p-10 text-center space-y-8 relative overflow-hidden">
        {/* Background decorative element */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <div className="w-20 h-20 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/30 mb-6">
            <ShieldLock size={40} />
          </div>
          
          <h2 className="text-3xl font-black text-slate-800 mb-2">Área Protegida</h2>
          <p className="text-slate-500 font-medium">Ingresa la contraseña de administrador para gestionar el sistema.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative">
          <div className="relative group">
            <KeyRound className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-500' : 'text-slate-400 group-focus-within:text-indigo-600'}`} size={20} />
            <input 
              autoFocus
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className={`w-full pl-12 pr-6 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-bold text-slate-800 ${error ? 'border-red-200 bg-red-50 shake' : 'border-slate-100 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10'}`}
            />
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 text-red-600 text-xs font-bold uppercase tracking-wider animate-in slide-in-from-top-2">
              <AlertCircle size={14} />
              Contraseña incorrecta
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95"
          >
            VERIFICAR ACCESO
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Acceso Restringido a Personal Autorizado</p>
      </div>
      
      <style>{`
        .shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default AdminAuthGate;
