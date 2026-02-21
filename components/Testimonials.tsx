
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    text: "Excelente alternativa para quem não pode se deslocar até uma clínica. Processo seguro e documento aceito sem problemas pelo meu empregador.",
    author: "Roberto Almeida",
    time: "há 2 semanas",
  },
  {
    text: "Fiquei surpresa com a rapidez. Em menos de 10 minutos já estava com o PDF em mãos. Muito prático e confiável!",
    author: "Ana Beatriz Costa",
    time: "há 1 semana",
  },
  {
    text: "Preço justo pela conveniência. O documento vem com assinatura digital ICP-Brasil, o que dá total segurança jurídica.",
    author: "Ricardo Souza",
    time: "há 4 dias",
  },
  {
    text: "Segunda vez que utilizo e o padrão continua alto. Recomendo para quem busca agilidade e seriedade.",
    author: "Carla Ferreira",
    time: "há 6 dias",
  },
  {
    text: "Sistema intuitivo e muito rápido. Salvou meu dia pois estava com muita febre e não conseguia dirigir até o hospital.",
    author: "Juliana Mendes",
    time: "há 5 dias",
  },
  {
    text: "Muito melhor que ficar horas em uma sala de espera. O médico foi muito criterioso na avaliação do questionário.",
    author: "Fernando Lima",
    time: "há 2 dias",
  },
  {
    text: "Rápido, fácil e seguro. O atestado foi validado pela empresa imediatamente através do código de verificação.",
    author: "Patrícia Gomes",
    time: "há 1 dia",
  }
];

export const Testimonials: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleIndicator = (index: number) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  // Autoplay para navegação contínua já que as setas foram removidas
  useEffect(() => {
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <section className="py-24 bg-[#1A1A2E] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Título e Estrelas conforme o print */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight">
            Avaliações dos nossos<br />clientes
          </h2>
          <div className="flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
            ))}
          </div>
        </div>

        <div className="relative max-w-2xl mx-auto">
          {/* Conteúdo do Depoimento (Sem fundo branco, texto centralizado) */}
          <div 
            className={`transition-all duration-500 flex flex-col items-center text-center ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
          >
            <p className="text-lg md:text-xl text-white font-bold leading-relaxed mb-10 max-w-lg">
              "{testimonials[activeIndex].text}"
            </p>
            
            <div className="flex flex-col items-center">
              <strong className="text-xl font-black text-white mb-2">
                {testimonials[activeIndex].author}
              </strong>
              
              <div className="flex items-center gap-3 text-slate-400 font-medium">
                <span className="text-sm">{testimonials[activeIndex].time}</span>
                <div className="w-8 h-[1px] bg-slate-600"></div>
              </div>
            </div>
          </div>

          {/* Indicadores estilo print (Pílula para o ativo) */}
          <div className="flex justify-center gap-2 mt-12">
            {testimonials.map((_, i) => (
              <button 
                key={i} 
                onClick={() => handleIndicator(i)}
                className={`transition-all duration-300 rounded-full h-1.5 ${i === activeIndex ? 'bg-medical-500 w-8' : 'bg-slate-700 w-1.5'}`} 
                aria-label={`Ir para slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
