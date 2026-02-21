
import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { Hero } from './components/Hero.tsx';
import { Steps } from './components/Steps.tsx';
import { Features } from './components/Features.tsx';
import { Testimonials } from './components/Testimonials.tsx';
import { Faq } from './components/Faq.tsx';
import { Footer } from './components/Footer.tsx';
import { IntakeForm } from './components/IntakeForm.tsx';
import { LoginForm } from './components/LoginForm.tsx';
import { trackEvent } from './services/pixelService.ts';

function App() {
  const [view, setView] = useState<'home' | 'form' | 'login'>('home');

  const startFlow = () => {
    setView('form');
    trackEvent('InitiateCheckout', { content_name: 'Início Triagem Médica' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openLogin = () => {
    setView('login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <Header onStart={startFlow} onHome={goHome} />
      
      <main className="flex-grow relative">
        {view === 'form' ? (
          <div className="py-8 bg-[#fafafa] min-h-[calc(100vh-80px)]">
             <div className="max-w-[800px] mx-auto px-4 mb-4">
                <button 
                  onClick={goHome}
                  className="text-[11px] font-black text-slate-400 hover:text-medical-600 inline-flex items-center group transition-all uppercase tracking-widest"
                >
                  <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> 
                  Página Inicial
                </button>
             </div>
             <IntakeForm onCancel={goHome} />
          </div>
        ) : view === 'login' ? (
          <div className="bg-[#fafafa] min-h-[calc(100vh-80px)] py-8">
             <div className="max-w-[800px] mx-auto px-4 mb-4">
                <button 
                  onClick={goHome}
                  className="text-[11px] font-black text-slate-400 hover:text-medical-600 inline-flex items-center group transition-all uppercase tracking-widest"
                >
                  <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> 
                  Página Inicial
                </button>
             </div>
             <LoginForm />
          </div>
        ) : (
          <div className="bg-white">
            <Hero onStart={startFlow} onLogin={openLogin} />
            <Steps />
            <Features />
            <Testimonials />
            <Faq onStart={startFlow} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
