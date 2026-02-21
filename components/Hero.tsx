
import React from 'react';
import { ArrowRight, Shield, Star } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
  onLogin: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart, onLogin }) => {
  return (
    <section className="bg-white py-8 md:py-16 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Lado Esquerdo: Conteúdo */}
        <div className="flex-1 text-center lg:text-left">
          <div 
            className="inline-flex items-center px-2.5 py-1 rounded-full mb-4 mx-auto lg:mx-0 animate-fadeIn bg-[#F0FDF4] text-[#166534] border border-[#BBF7D8]"
          >
            <Shield className="w-3 h-3 mr-1.5" />
            <span className="text-[9px] font-bold uppercase tracking-wider">100% Seguro e Confidencial</span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-6">
            Atestado Médico<br />
            Online <span className="text-[#125F39]">24/7 em 5 minutos</span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Obtenha seu atestado médico agora por apenas <strong className="text-[#15803D]">R$ 29</strong>, 
            simplesmente por meio de um questionário on-line em <strong className="text-slate-900">5 minutos</strong>.
          </p>

          {/* Features Checklist */}
          <div className="space-y-3 mb-8 text-left inline-block lg:block">
            <div className="flex items-center text-slate-700">
              <div className="w-5 h-5 rounded-full bg-medical-50 flex items-center justify-center mr-3">
                <Shield className="w-3 h-3 text-medical-600" />
              </div>
              <span className="text-sm font-medium">Simples, <strong className="text-slate-900">rápido</strong> e confiável</span>
            </div>
            <div className="flex items-center text-slate-700">
              <div className="w-5 h-5 rounded-full bg-medical-50 flex items-center justify-center mr-3">
                <Shield className="w-3 h-3 text-medical-600" />
              </div>
              <span className="text-sm font-medium"><strong className="text-slate-900">100% on-line</strong> sem consulta médica</span>
            </div>
            <div className="flex items-center text-slate-700">
              <div className="w-5 h-5 rounded-full bg-medical-50 flex items-center justify-center mr-3">
                <Shield className="w-3 h-3 text-medical-600" />
              </div>
              <span className="text-sm font-medium">Atestado Médico com <strong className="text-slate-900">CRM Ativo!</strong></span>
            </div>
          </div>

          {/* Botões Estilo Quadrado e Lado a Lado */}
          <div className="flex flex-row gap-3 justify-center lg:justify-start items-center">
            <button 
              onClick={onStart}
              className="group flex flex-col items-center justify-center w-36 h-20 md:w-44 md:h-24 rounded-2xl text-white font-bold transition-all btn-pulse relative"
              style={{ backgroundColor: '#125F39' }}
            >
              <span className="text-xs md:text-sm leading-tight">Solicitar</span>
              <span className="text-xs md:text-sm leading-tight">Atestado</span>
              <ArrowRight className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 opacity-80 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={onLogin}
              className="flex flex-col items-center justify-center w-36 h-20 md:w-44 md:h-24 rounded-2xl border-2 font-bold transition-all hover:bg-slate-50 bg-white text-[#125F39] border-[#125F39]"
            >
              <span className="text-xs md:text-sm leading-tight">Acessar Minha</span>
              <span className="text-xs md:text-sm leading-tight">Conta</span>
            </button>
          </div>
        </div>

        {/* Lado Direito: Imagem Horizontal com Badges Flutuantes Ajustados */}
        <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
          <div className="relative rounded-[2.5rem] overflow-visible">
            {/* Container da Imagem principal */}
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Médico Atendimento" 
                className="w-full h-auto aspect-[3/2] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
            </div>
            
            {/* Badge: 100% Seguro */}
            <div className="absolute top-6 -right-3 md:top-8 md:-right-6 bg-white p-2.5 md:p-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-float z-20 border border-slate-50 min-w-[130px] md:min-w-[155px]">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#2A2E45] flex items-center justify-center text-blue-400 shrink-0">
                <Shield className="w-4.5 h-4.5 md:w-5.5 md:h-5.5 fill-current" />
              </div>
              <div className="flex flex-col">
                <strong className="text-[11px] md:text-[13px] font-black text-slate-900 leading-tight">100% Seguro</strong>
                <span className="text-[9px] md:text-[10px] text-slate-500 font-medium">Dados protegidos</span>
              </div>
            </div>

            {/* Badge: Avaliações */}
            <div className="absolute bottom-4 left-2 md:-bottom-2 md:-left-4 bg-white p-2.5 md:p-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-float-delayed z-20 border border-slate-50 min-w-[110px] md:min-w-[135px]">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-[#2A2E45] flex items-center justify-center text-yellow-400 shrink-0">
                <Star className="w-4.5 h-4.5 md:w-5.5 md:h-5.5 fill-current" />
              </div>
              <div className="flex flex-col">
                <strong className="text-[11px] md:text-[13px] font-black text-slate-900 leading-tight">4.9/5</strong>
                <span className="text-[9px] md:text-[10px] text-slate-500 font-medium">Avaliações</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
