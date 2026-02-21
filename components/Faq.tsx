import React, { useState } from 'react';
import { Plus, Minus, ArrowRight } from 'lucide-react';

const faqData = [
  {
    question: "O atestado médico online é válido legalmente?",
    answer: "Sim, o atestado médico digital é válido legalmente em todo o território nacional, conforme a Resolução CFM nº 2.299/21. Ele possui assinatura digital com certificado ICP-Brasil, garantindo sua autenticidade e validade jurídica para fins trabalhistas e estudantis."
  },
  {
    question: "Quanto tempo leva para receber o atestado médico online?",
    answer: "O processo é extremamente rápido. Após o preenchimento do questionário e confirmação do pagamento via PIX, o atestado é gerado e disponibilizado em poucos minutos."
  },
  {
    question: "Por quanto tempo posso me afastar com o atestado médico online?",
    answer: "O tempo de afastamento depende da avaliação dos seus sintomas e do protocolo médico adequado para a sua condição de saúde."
  },
  {
    question: "E se meu empregador não aceitar o atestado médico online?",
    answer: "Por lei (Lei nº 605/49 e Resolução CFM nº 1.658/2002), o atestado médico digital com assinatura válida (ICP-Brasil) deve ser aceito da mesma forma que o atestado em papel."
  },
  {
    question: "Preciso fazer uma consulta por vídeo para conseguir um atestado online?",
    answer: "Geralmente não. A triagem é realizada através de um questionário detalhado de saúde (anamnese), que é avaliado por nossos médicos. Se necessário, uma interação adicional pode ser solicitada."
  },
  {
    question: "Como funciona o pagamento para atestado médico online?",
    answer: "O pagamento é realizado de forma segura e prática através do PIX, garantindo a liberação imediata do seu documento após a aprovação."
  },
  {
    question: "Posso pagar o atestado médico online com boleto bancário?",
    answer: "Para garantir a agilidade e entrega em minutos, atualmente trabalhamos exclusivamente com PIX e Cartão de Crédito."
  },
  {
    question: "Como funciona a política de reembolso para atestado médico online?",
    answer: "Caso seu atestado não seja emitido por qualquer critério médico, devolvemos 100% do seu dinheiro."
  },
  {
    question: "Quem são os médicos que emitem os atestados online?",
    answer: "Trabalhamos com uma rede de médicos parceiros, todos devidamente registrados no Conselho Regional de Medicina (CRM) e habilitados para telemedicina."
  },
  {
    question: "Os médicos que emitem atestados online são licenciados?",
    answer: "Sim, todos os médicos emissores possuem CRM ativo e certificado digital para assinatura válida em todo território nacional."
  },
  {
    question: "O atestado médico online serve para justificar faltas em qualquer situação?",
    answer: "Serve para justificar faltas no trabalho, escola ou faculdade por motivos de doença, conforme a legislação trabalhista e educacional."
  },
  {
    question: "Meus dados estão seguros ao solicitar um atestado médico online?",
    answer: "Absolutamente. Utilizamos criptografia de ponta e seguimos rigorosamente a Lei Geral de Proteção de Dados (LGPD) e o sigilo médico."
  },
  {
    question: "O serviço de atestado médico online está disponível 24 horas por dia?",
    answer: "Sim! Nossa plataforma funciona 24 horas por dia, 7 dias por semana, inclusive feriados."
  },
  {
    question: "O que diz a lei sobre o atestado médico no Brasil?",
    answer: "A lei valida o uso da telemedicina e a emissão de documentos médicos digitais, desde que assinados com certificado digital ICP-Brasil."
  }
];

export const Faq: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-black tracking-widest uppercase mb-4 block" style={{ color: '#125F39' }}>DÚVIDAS</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Perguntas Frequentes</h2>
          <p className="text-slate-500 font-medium">Tire suas dúvidas sobre nosso serviço de emissão de atestados.</p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, idx) => (
            <div 
              key={idx} 
              className={`border rounded-[1.5rem] transition-all duration-300 ${openIndex === idx ? 'border-medical-200 bg-medical-50/20 shadow-lg shadow-medical-600/5' : 'border-slate-100'}`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left font-black text-slate-800 hover:text-medical-600 transition-colors"
              >
                <span className="pr-8">{item.question}</span>
                {openIndex === idx ? <Minus className="w-5 h-5 flex-shrink-0 text-medical-600" /> : <Plus className="w-5 h-5 flex-shrink-0 text-slate-400" />}
              </button>
              {openIndex === idx && (
                <div className="px-6 pb-6 animate-fadeIn">
                  <div className="h-px bg-slate-100 mb-4 w-full" />
                  <p className="text-slate-600 leading-relaxed font-medium">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <button 
            onClick={onStart}
            className="inline-flex items-center justify-center px-12 py-5 rounded-2xl text-white font-black text-xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-medical-600/20"
            style={{ backgroundColor: '#125F39' }}
          >
            Emitir Atestado Agora
            <ArrowRight className="w-6 h-6 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
};