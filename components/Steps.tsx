import React from 'react';

export const Steps: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-black tracking-widest uppercase mb-4 block" style={{ color: '#125F39' }}>PASSO A PASSO</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Como Funciona o Atestado Médico Online</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Obtenha seu atestado médico em poucos minutos seguindo apenas 3 passos simples.</p>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 md:gap-4">
          {/* Timeline Connector Desktop */}
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 border-t-2 border-dashed border-slate-200"></div>

          {/* Passo 1 */}
          <div className="flex-1 flex flex-col items-center text-center z-10">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-4xl border border-slate-100 transition-transform hover:scale-110 duration-300">📝</div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-medical-600 text-white flex items-center justify-center font-black border-4 border-slate-50 shadow-lg">1</div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Preencha o Questionário</h3>
            <p className="text-slate-500 max-w-[200px]">Responda algumas perguntas sobre seus sintomas e histórico de saúde.</p>
          </div>

          {/* Passo 2 */}
          <div className="flex-1 flex flex-col items-center text-center z-10">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-4xl border border-slate-100 transition-transform hover:scale-110 duration-300">🩺</div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-medical-600 text-white flex items-center justify-center font-black border-4 border-slate-50 shadow-lg">2</div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Avaliação Médica</h3>
            <p className="text-slate-500 max-w-[200px]">Nosso sistema e médicos avaliam suas informações instantaneamente.</p>
          </div>

          {/* Passo 3 */}
          <div className="flex-1 flex flex-col items-center text-center z-10">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-4xl border border-slate-100 transition-transform hover:scale-110 duration-300">📥</div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-medical-600 text-white flex items-center justify-center font-black border-4 border-slate-50 shadow-lg">3</div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Receba seu Atestado</h3>
            <p className="text-slate-500 max-w-[200px]">Após aprovação e pagamento, baixe seu atestado assinado digitalmente.</p>
          </div>
        </div>
      </div>
    </section>
  );
};