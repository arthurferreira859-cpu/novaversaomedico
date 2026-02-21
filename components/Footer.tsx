import React from 'react';
import { Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
        {/* Logo Branca Centralizada */}
        <div className="mb-6 flex items-center gap-2">
          <div className="bg-white/10 p-2 rounded-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight">MediFast<span className="text-medical-500">.</span></span>
        </div>

        <p className="text-sm md:text-base font-medium max-w-xl mb-10 text-slate-400">
          A maior e mais segura plataforma de emissão de atestados médicos online do Brasil.
        </p>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-10 text-left border-t border-white/10 pt-10">
          <div>
            <h4 className="text-medical-500 font-black uppercase tracking-widest text-[10px] mb-4">Serviços</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-bold text-xs">Solicitar Atestado</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-bold text-xs">Minha Conta</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors font-bold text-xs">Termos de Uso</a></li>
            </ul>
          </div>
          <div className="md:text-right">
            <h4 className="text-medical-500 font-black uppercase tracking-widest text-[10px] mb-4">MediFast 24h</h4>
            <p className="text-slate-500 text-[10px] leading-relaxed mb-4">
              © 2024 MediFast Tecnologia. CNPJ: 00.000.000/0001-00<br />
              Atendimento em conformidade com a Resolução CFM nº 2.314/2022.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};