import React from 'react';
import { Clock, ShieldCheck, FileCheck, User, CreditCard, MessageCircle } from 'lucide-react';

export const Features: React.FC = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Rápido e Conveniente',
      desc: 'Receba seu atestado em minutos, sem sair de casa.'
    },
    {
      icon: ShieldCheck,
      title: '100% Online',
      desc: 'Todo o processo é digital, do questionário ao recebimento.'
    },
    {
      icon: FileCheck,
      title: 'Seguro e Legal',
      desc: 'Atestados emitidos de acordo com as normas vigentes.'
    },
    {
      icon: User,
      title: 'Sigilo Médico',
      desc: 'Suas informações são protegidas por sigilo absoluto.'
    },
    {
      icon: CreditCard,
      title: 'Pagamento Facilitado',
      desc: 'Aceitamos PIX para maior agilidade na liberação.'
    },
    {
      icon: MessageCircle,
      title: 'Suporte Dedicado',
      desc: 'Equipe pronta para ajudar em qualquer etapa.'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-black tracking-widest uppercase mb-4 block text-[#125F39]">BENEFÍCIOS</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Por que escolher nosso serviço?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <div 
              key={idx} 
              className="p-8 rounded-[2.5rem] border border-slate-100 hover:border-medical-200 hover:bg-medical-50/50 transition-all duration-300 group flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-[1.5rem] bg-medical-50 text-medical-600 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-medical-600 group-hover:text-white transition-all duration-300">
                <benefit.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-3">{benefit.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};