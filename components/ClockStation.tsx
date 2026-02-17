
import React, { useState, useRef, useEffect } from 'react';
import { Staff, LogType } from '../types';
import { Camera, MapPin, CheckCircle2, Search, X } from 'lucide-react';

interface ClockStationProps {
  staff: Staff[];
  onClockAction: (staffId: string, type: LogType, photo?: string, location?: {lat: number, lng: number}) => void;
}

const ClockStation: React.FC<ClockStationProps> = ({ staff, onClockAction }) => {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [search, setSearch] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [success, setSuccess] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.position.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isCapturing && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Camera access denied", err));
    }
  }, [isCapturing]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setPhoto(dataUrl);
        setIsCapturing(false);
        // Stop stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      }
    }
  };

  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error("Location denied", err)
    );
  };

  const handleAction = (type: LogType) => {
    if (!selectedStaff) return;
    onClockAction(selectedStaff.id, type, photo || undefined, location || undefined);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setSelectedStaff(null);
      setPhoto(null);
      setLocation(null);
      setSearch('');
    }, 2000);
  };

  if (success) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4 animate-in zoom-in duration-300">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800">¡Registro Exitoso!</h2>
        <p className="text-slate-500">Que tengas una excelente jornada, {selectedStaff?.name}.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 h-full">
      {!selectedStaff ? (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-800">Selecciona tu Perfil</h2>
            <p className="text-slate-500">Busca tu nombre para registrar tu entrada o salida</p>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
            <input 
              type="text" 
              placeholder="Escribe tu nombre o cargo..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStaff.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedStaff(s)}
                className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all text-left flex items-center gap-4 group"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  {s.name[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{s.name}</h3>
                  <p className="text-sm text-slate-400">{s.position}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-right-4 duration-300">
          <div className="bg-indigo-600 p-8 text-white flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center font-bold text-2xl">
                 {selectedStaff.name[0]}
               </div>
               <div>
                 <h2 className="text-2xl font-bold">{selectedStaff.name}</h2>
                 <p className="text-indigo-100">{selectedStaff.position}</p>
               </div>
            </div>
            <button onClick={() => setSelectedStaff(null)} className="p-2 hover:bg-white/10 rounded-full">
              <X />
            </button>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Media Section */}
              <div className="space-y-4">
                <div className="aspect-video bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 relative overflow-hidden flex items-center justify-center">
                  {photo ? (
                    <img src={photo} alt="Verification" className="w-full h-full object-cover" />
                  ) : isCapturing ? (
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400">
                      <Camera size={40} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Verificación facial opcional</p>
                    </div>
                  )}
                  {isCapturing && (
                    <button 
                      onClick={capturePhoto}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold shadow-lg hover:bg-indigo-500 transition-colors"
                    >
                      Tomar Foto
                    </button>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsCapturing(true)}
                    className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Camera size={20} />
                    {photo ? 'Cambiar Foto' : 'Usar Cámara'}
                  </button>
                  <button 
                    onClick={requestLocation}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${location ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
                  >
                    <MapPin size={20} />
                    {location ? 'Ubicación OK' : 'GPS'}
                  </button>
                </div>
              </div>

              {/* Action Section */}
              <div className="flex flex-col justify-center gap-4">
                <p className="text-slate-500 text-sm text-center mb-2">
                  Estado actual: <span className={`font-bold ${selectedStaff.currentWorkStatus === 'IN' ? 'text-emerald-600' : 'text-slate-400'}`}>{selectedStaff.currentWorkStatus}</span>
                </p>
                <button 
                  disabled={selectedStaff.currentWorkStatus === 'IN'}
                  onClick={() => handleAction(LogType.IN)}
                  className="w-full py-6 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-2xl text-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-3"
                >
                  <LogIn className="w-8 h-8" />
                  REGISTRAR ENTRADA
                </button>
                <button 
                  disabled={selectedStaff.currentWorkStatus === 'OUT'}
                  onClick={() => handleAction(LogType.OUT)}
                  className="w-full py-6 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-2xl text-2xl font-bold shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-3"
                >
                  <LogOut className="w-8 h-8" />
                  REGISTRAR SALIDA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

const LogIn = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

const LogOut = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default ClockStation;
