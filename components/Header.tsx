import { Menu, Activity } from 'lucide-react';

interface HeaderProps {
  onStart: () => void;
  onHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onStart, onHome }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20 md:h-24 relative">
          
          {/* Lado Esquerdo: Navegação (Desktop) e Menu (Mobile) */}
          <div className="flex-1 flex items-center justify-start">
            <nav className="hidden lg:flex space-x-6">
              <a href="#como-funciona" className="text-slate-500 hover:text-medical-600 font-medium text-sm transition-colors">Como Funciona</a>
              <a href="#beneficios" className="text-slate-500 hover:text-medical-600 font-medium text-sm transition-colors">Benefícios</a>
            </nav>
            <button 
              onClick={onStart}
              className="lg:hidden p-2 text-slate-500 hover:text-medical-600"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Centro: Logo Centralizada e Grande */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div 
              className="cursor-pointer transition-transform active:scale-95 flex items-center gap-2" 
              onClick={(e) => {
                e.preventDefault();
                onHome();
              }}
            >
              <div className="bg-medical-600 p-2 rounded-lg">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-black text-slate-800 tracking-tight">MediFast<span className="text-medical-600">.</span></span>
            </div>
          </div>
          
          {/* Lado Direito: Botão Solicitar */}
          <div className="flex-1 flex items-center justify-end">
            <button 
              onClick={onStart}
              className="bg-medical-600 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-medical-700 transition-all shadow-lg shadow-medical-600/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
            >
              Solicitar
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};