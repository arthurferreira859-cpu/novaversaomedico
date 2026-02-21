
import React, { useState, useEffect } from 'react';
import { Step, TriageData, AiAnalysis } from '../types';
import { analyzeSymptoms } from '../services/geminiService';
import { trackEvent } from '../services/pixelService';
import { 
  Lock, 
  Check, 
  Clock, 
  Activity, 
  Zap,
  ArrowRight,
  ArrowLeft,
  Stethoscope,
  Calendar,
  Info,
  Thermometer,
  Brain,
  Biohazard,
  Droplet,
  HelpCircle,
  Pill
} from 'lucide-react';

interface IntakeFormProps {
  onCancel: () => void;
}

const problems = [
  { id: 'dor-costas', title: 'Dor nas costas', desc: 'Dor lombar', icon: Activity },
  { id: 'gripe', title: 'Gripe', desc: 'Infecção respiratória aguda', icon: Thermometer },
  { id: 'gastro', title: 'Gastroenterite', desc: 'Diarreia e gastroenterite', icon: Pill },
  { id: 'estresse', title: 'Estresse', desc: 'Esgotamento', icon: Brain },
  { id: 'resfriado', title: 'Resfriado', desc: 'Febre e mal-estar', icon: Thermometer },
  { id: 'covid', title: 'COVID-19', desc: 'Sintomas de coronavírus', icon: Biohazard },
  { id: 'colicas', title: 'Cólicas menstruais', desc: 'Dismenoreia', icon: Droplet },
  { id: 'cistite', title: 'Cistite', desc: 'Infecção urinária', icon: Droplet },
  { id: 'enxaqueca', title: 'Enxaqueca', desc: 'Dor de cabeça intensa', icon: Zap },
  { id: 'outros', title: 'Outro Problema', desc: 'Outra condição de saúde', icon: HelpCircle },
];

const availableSymptoms = [
  { id: '9e08ff5e-c0ab-4329-b7c5-4f54733042d8', label: 'Febre' },
  { id: '19161b33-ffa9-a3a2-45c6-3c036595fc9e', label: 'Náusea' },
  { id: 'c180f3b4-89ce-4316-70c6-4a9d15c36e82', label: 'Diarreia' },
  { id: '66ed065d-8143-5cc0-ea58-9b50e24c397f', label: 'Tosse sem catarro' },
  { id: '017440ae-4bce-e01a-c6a2-dd5813a018b6', label: 'Tosse com catarro' },
  { id: '896bcbe7-55dc-c71e-cd9d-1021b83ce037', label: 'Mal-estar' },
  { id: '82d43bee-5eb3-406b-5c9b-c312449bbf1b', label: 'Fadiga' },
  { id: '09641f27-1f93-1166-3cee-69a786b1d405', label: 'Pressão arterial elevada' },
  { id: '80e7980f-96bb-8ca5-27ba-eec20a84c722', label: 'O corpo não pode se mover livremente' },
  { id: '8d713f5e-3f89-00ee-5a1b-dbd9f026c5e9', label: 'Evento estressante na vida' },
  { id: '3abc37cf-390a-a773-2631-d754a6ac6182', label: 'Distúrbio do sono' },
];

export const IntakeForm: React.FC<IntakeFormProps> = ({ onCancel }) => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.PROBLEMA);
  const [data, setData] = useState<TriageData>({
    fullName: '',
    cpf: '',
    email: '',
    phone: '',
    cep: '',
    city: '',
    state: '',
    symptoms: '',
    duration: 'hoje',
    painLevel: 5,
    selectedProblem: '',
    previousDiagnosis: '',
    otherSymptoms: '',
    symptomsStartDate: new Date().toISOString().split('T')[0],
    certificateDays: 1,
    priceLabel: 'R$ 39,90',
    preferredHospital: '',
    selectedBumps: []
  });
  const [analysis, setAnalysis] = useState<AiAnalysis | null>(null);
  const [datePreset, setDatePreset] = useState<string>('Hoje');
  const [showPayment, setShowPayment] = useState(false);
  const [pixData, setPixData] = useState<{ qrCode: string; copyPaste: string; expiresAt: string; transactionId: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [showSalesNotification, setShowSalesNotification] = useState(false);
  const [salesNotificationData, setSalesNotificationData] = useState({ name: '', location: '' });

  useEffect(() => {
    const names = ['Maria', 'João', 'Ana', 'Pedro', 'Lucas', 'Julia', 'Marcos', 'Fernanda'];
    const locations = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Salvador', 'Brasília'];
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setSalesNotificationData({
          name: names[Math.floor(Math.random() * names.length)],
          location: locations[Math.floor(Math.random() * locations.length)]
        });
        setShowSalesNotification(true);
        setTimeout(() => setShowSalesNotification(false), 4000);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (showPayment && pixData?.transactionId && !isPaid) {
      interval = setInterval(async () => {
        try {
          const response = await fetch(`/api/check-status?transactionId=${pixData.transactionId}`);
          const result = await response.json();

          if (result.success && result.data.status === 'PAID') {
            setIsPaid(true);
            clearInterval(interval);
            trackEvent('Purchase', { 
              value: getPriceValue(data.priceLabel), 
              currency: 'BRL',
              transaction_id: pixData.transactionId
            });
          }
        } catch (error) {
          console.error("Erro ao verificar status:", error);
        }
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showPayment, pixData, isPaid]);

  const handleGeneratePix = async () => {
    setIsProcessing(true);
    setProcessingStep(0);
    
    const steps = [
      "Validando dados do paciente...",
      "Verificando disponibilidade médica...",
      "Gerando documento seguro...",
      "Criando QR Code PIX..."
    ];
    
    // Animation loop
    let currentStepIndex = 0;
    const animationInterval = setInterval(() => {
      currentStepIndex = (currentStepIndex + 1) % steps.length;
      setProcessingStep(currentStepIndex);
    }, 1500);

    try {
      const amount = Math.round(parseFloat(getTotalPrice().replace(',', '.')) * 100);
      const items = [
        {
          title: `Atestado Médico - ${data.certificateDays} dias`,
          unitPrice: Math.round(getPriceValue(data.priceLabel) * 100),
          quantity: 1,
          tangible: false
        },
        ...data.selectedBumps.map(bumpId => {
          const bump = bumps.find(b => b.id === bumpId);
          return {
            title: bump?.label || 'Serviço Adicional',
            unitPrice: Math.round((bump?.price || 0) * 100),
            quantity: 1,
            tangible: false
          };
        })
      ];

      const payload = {
        amount,
        paymentMethod: "pix",
        items,
        customer: {
          name: data.fullName,
          email: data.email,
          phone: data.phone.replace(/\D/g, ''),
          document: {
            number: data.cpf.replace(/\D/g, ''),
            type: "cpf"
          }
        },
        shipping: {
          name: data.fullName,
          street: data.city, // Using city as placeholder for street if not collected
          number: "123", // Placeholder
          complement: "Apto 45", // Placeholder
          neighborhood: "Centro", // Placeholder
          city: data.city,
          state: data.state,
          zipCode: data.cep.replace(/\D/g, '')
        },
        pix: {
          expiresInDays: 1
        },
        externalRef: `ORDER-${Date.now()}`,
        utm_source: "site",
        utm_medium: "organic",
        utm_campaign: "atestado_medico"
      };

      console.log("Enviando payload:", payload);

      const response = await fetch('/api/create-sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let result;
      try {
        result = await response.json();
      } catch (e) {
        console.error("Erro ao parsear resposta:", e);
        throw new Error("Resposta inválida do servidor");
      }

      console.log("Resposta API:", result);

      if (result.success && result.data?.paymentData) {
        setPixData({
          qrCode: result.data.paymentData.qrCodeBase64,
          copyPaste: result.data.paymentData.copyPaste,
          expiresAt: result.data.paymentData.expiresAt,
          transactionId: result.data.transactionId
        });
        
        setTimeout(() => {
            clearInterval(animationInterval);
            setIsProcessing(false);
            setShowPayment(true);
        }, 1500);
      } else {
        clearInterval(animationInterval);
        setIsProcessing(false);
        console.error("Erro API:", result);
        alert("Erro ao gerar pagamento. Verifique seus dados e tente novamente.");
      }
    } catch (error) {
      clearInterval(animationInterval);
      setIsProcessing(false);
      console.error("Erro requisição:", error);
      alert("Erro de conexão. Tente novamente.");
    }
  };

  const bumps = [
    { id: 'whatsapp', label: 'Envio Prioritário no WhatsApp', price: 4.90 },
    { id: 'sms', label: 'Notificação via SMS', price: 2.90 },
    { id: 'insurance', label: 'Garantia de Reembolso Estendida', price: 9.90 }
  ];

  const getTotalPrice = () => {
    let total = getPriceValue(data.priceLabel);
    data.selectedBumps?.forEach(bumpId => {
      const bump = bumps.find(b => b.id === bumpId);
      if (bump) total += bump.price;
    });
    return total.toFixed(2).replace('.', ',');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const fetchAddressByCEP = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setData(prev => ({
            ...prev,
            city: data.localidade,
            state: data.uf
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const getPriceValue = (label?: string) => {
    if (!label) return 39.90;
    return parseFloat(label.replace('R$ ', '').replace(',', '.'));
  };

  const toggleSymptom = (label: string) => {
    const selected = data.symptoms.split(', ').filter(s => s !== '');
    if (selected.includes(label)) {
      setData(prev => ({ ...prev, symptoms: selected.filter(s => s !== label).join(', ') }));
    } else {
      setData(prev => ({ ...prev, symptoms: [...selected, label].join(', ') }));
    }
  };

  const getValidDate = () => {
    if (!data.symptomsStartDate) return '';
    const d = new Date(data.symptomsStartDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    return d.toLocaleDateString('pt-BR');
  };

  const nextStep = () => {
    switch (currentStep) {
      case Step.PROBLEMA:
        if (!data.selectedProblem) {
          alert("Por favor, selecione seu problema de saúde.");
          return;
        }
        setCurrentStep(Step.CONTATO);
        break;
      case Step.CONTATO:
        if (!data.fullName || !data.email || !data.phone) {
          alert("Por favor, preencha todos os campos de contato.");
          return;
        }
        setCurrentStep(Step.DIAGNOSTICO);
        break;
      case Step.DIAGNOSTICO:
        if (!data.previousDiagnosis) {
          alert("Por favor, selecione uma opção.");
          return;
        }
        setCurrentStep(Step.SINTOMAS);
        break;
      case Step.SINTOMAS:
        if (!data.symptoms) {
          alert("Por favor, selecione ao menos um sintoma.");
          return;
        }
        setCurrentStep(Step.DETALHES);
        break;
      case Step.DETALHES:
        if (!data.symptomsStartDate || !data.certificateDays || !data.preferredHospital) {
          alert("Por favor, preencha todos os campos obrigatórios.");
          return;
        }
        setCurrentStep(Step.DADOS);
        break;
      case Step.DADOS:
        if (!data.fullName || !data.cpf || !data.city || !data.state) {
          alert("Por favor, preencha todos os campos obrigatórios.");
          return;
        }
        setCurrentStep(Step.FINALIZACAO);
        trackEvent('InitiateCheckout', { value: getPriceValue(data.priceLabel) });
        break;
      default:
        break;
    }
  };

  const prevStep = () => {
    if (currentStep > Step.PROBLEMA) {
      setCurrentStep(prev => (prev - 1) as Step);
    }
  };

  const isNextDisabled = () => {
    if (currentStep === Step.PROBLEMA && !data.selectedProblem) return true;
    if (currentStep === Step.CONTATO && (!data.fullName || !data.email || !data.phone)) return true;
    if (currentStep === Step.DIAGNOSTICO && !data.previousDiagnosis) return true;
    if (currentStep === Step.SINTOMAS && !data.symptoms) return true;
    if (currentStep === Step.DETALHES && (!data.symptomsStartDate || !data.certificateDays || !data.preferredHospital)) return true;
    if (currentStep === Step.DADOS && (!data.fullName || !data.cpf || !data.city || !data.state)) return true;
    return false;
  };

  const renderProgressBar = () => {
    const totalSteps = 7;
    const progress = (currentStep / totalSteps) * 100;
    
    return (
      <div className="w-full max-w-md mx-auto mb-8 px-4">
        <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
          <span>Progresso</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-medical-600 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="solicitation-container relative">
      {showSalesNotification && (
        <div className="fixed bottom-4 left-4 z-50 bg-white p-4 rounded-xl shadow-2xl border border-slate-100 animate-slideIn flex items-center gap-3 max-w-[300px]">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <Check size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">{salesNotificationData.name} acabou de comprar</p>
            <p className="text-xs text-slate-500">em {salesNotificationData.location}</p>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-6">
          <div className="w-20 h-20 border-4 border-slate-200 border-t-medical-600 rounded-full animate-spin mb-8"></div>
          <h3 className="text-xl font-black text-slate-800 mb-2 text-center">Processando sua solicitação</h3>
          <p className="text-slate-500 text-center animate-pulse">
            {[
              "Validando dados do paciente...",
              "Verificando disponibilidade médica...",
              "Gerando documento seguro...",
              "Criando QR Code PIX..."
            ][processingStep]}
          </p>
        </div>
      )}
      
      <div className="solicitation-top">
        <h1 className="page-title">EMISSÃO DO ATESTADO</h1>
      </div>

      {renderProgressBar()}

      <div className="content-card">
        <div className="card-header border-b border-slate-100">
          {currentStep === Step.PROBLEMA && (
            <>
              <h2 className="text-xl md:text-2xl font-bold">Qual seu problema de saúde?</h2>
              <p className="text-sm md:text-base text-slate-500">Selecione o motivo principal do seu atestado.</p>
            </>
          )}
          {currentStep === Step.CONTATO && (
            <>
              <h2 className="text-xl md:text-2xl font-bold">Seus Dados de Contato</h2>
              <p className="text-sm md:text-base text-slate-500">Precisamos saber quem é você para personalizar seu atendimento.</p>
            </>
          )}
          {currentStep === Step.DIAGNOSTICO && (
            <>
              <h2>Diagnóstico Prévio</h2>
              <p className="text-slate-500">Certo, <span className="text-medical-600 font-bold">{data.fullName.split(' ')[0]}</span>. Informação importante para o médico avaliador.</p>
            </>
          )}
          {currentStep === Step.SINTOMAS && (
            <>
              <h2>Seus Sintomas</h2>
              <p className="text-slate-500"><span className="text-medical-600 font-bold">{data.fullName.split(' ')[0]}</span>, escolha os sintomas que você está sentindo.</p>
            </>
          )}
          {currentStep === Step.DETALHES && (
            <>
              <h2>Detalhes Finais</h2>
              <p className="text-slate-500">Informações sobre o início dos sintomas e período desejado.</p>
            </>
          )}
          {currentStep === Step.DADOS && (
            <>
              <h2>Dados do Paciente</h2>
              <p className="text-slate-500">Informações obrigatórias para o documento legal.</p>
            </>
          )}
          {currentStep === Step.FINALIZACAO && (
            <>
              <h2>Resumo e Finalização</h2>
              <p className="text-slate-500">Confira os dados antes de emitir seu atestado.</p>
            </>
          )}
        </div>

        <div className="card-body">
          {currentStep === Step.PROBLEMA && (
            <div className="problems-grid">
              {problems.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => setData(prev => ({ ...prev, selectedProblem: p.title }))}
                  className={`problem-card active:scale-95 transition-transform ${data.selectedProblem === p.title ? 'selected ring-2 ring-medical-600 bg-medical-50' : 'hover:border-medical-200'}`}
                >
                  <div className={`problem-icon-wrapper rounded-full p-3 ${data.selectedProblem === p.title ? 'bg-medical-600 text-white' : 'bg-medical-50 text-medical-600'}`}>
                    <p.icon className="problem-icon-img" size={32} />
                  </div>
                  <div className="problem-info">
                    <h4 className="font-bold text-slate-800">{p.title}</h4>
                    <p className="text-sm text-slate-500">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentStep === Step.CONTATO && (
            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-medium text-sm text-slate-700">Nome Completo <span className="text-pink-500">*</span></label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Digite seu nome completo" 
                    value={data.fullName}
                    onChange={(e) => setData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full p-4 border-b border-slate-200 bg-transparent outline-none text-lg focus:border-medical-600 transition-colors"
                  />
                  {data.fullName.length > 5 && (
                    <Check className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5 animate-fadeIn" />
                  )}
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium text-sm text-slate-700">E-mail <span className="text-pink-500">*</span></label>
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={data.email}
                    onChange={(e) => setData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-4 border-b border-slate-200 bg-transparent outline-none text-lg focus:border-medical-600 transition-colors"
                  />
                  {data.email.includes('@') && data.email.includes('.') && (
                    <Check className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5 animate-fadeIn" />
                  )}
                </div>
              </div>
              <div>
                <label className="block mb-2 font-medium text-sm text-slate-700">WhatsApp <span className="text-pink-500">*</span></label>
                <div className="relative">
                  <input 
                    type="tel"
                    inputMode="numeric"
                    placeholder="(00) 00000-0000" 
                    maxLength={15} 
                    value={data.phone}
                    onChange={(e) => setData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                    className="w-full p-4 border-b border-slate-200 bg-transparent outline-none text-lg focus:border-medical-600 transition-colors"
                  />
                  {data.phone.length >= 14 && (
                    <Check className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5 animate-fadeIn" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-2">Enviaremos o atestado para este número.</p>
              </div>
            </div>
          )}

          {currentStep === Step.DIAGNOSTICO && (
            <div className="step-diagnosis">
              <div className="diagnosis-question flex items-center gap-2 mb-6 text-slate-700 font-bold">
                <Stethoscope size={18} className="question-icon text-medical-600" />
                <span className="question-text">UM MÉDICO JÁ TE DIAGNOSTICOU ESTA DOENÇA PESSOALMENTE?<span className="required text-pink-500">*</span></span>
              </div>
              <div className="diagnosis-buttons grid grid-cols-3 gap-4">
                {['Sim', 'Não', 'Talvez'].map(option => (
                  <button 
                    key={option}
                    type="button" 
                    className={`diagnosis-btn p-4 rounded-xl border-2 font-bold transition-all active:scale-95 ${data.previousDiagnosis === option ? 'border-medical-600 bg-medical-600 text-white shadow-lg shadow-medical-600/30' : 'border-slate-200 text-slate-600 hover:border-medical-200 bg-white'}`}
                    onClick={() => setData(prev => ({ ...prev, previousDiagnosis: option }))}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === Step.SINTOMAS && (
            <div className="step-symptoms">
              <div className="symptoms-tags flex flex-wrap gap-3">
                {availableSymptoms.map(symptom => (
                  <button 
                    key={symptom.id}
                    id={symptom.id}
                    type="button" 
                    className={`symptom-btn px-4 py-2 rounded-full border transition-all text-sm font-medium active:scale-95 ${data.symptoms.includes(symptom.label) ? 'bg-medical-600 text-white border-medical-600 shadow-md shadow-medical-600/20' : 'bg-white text-slate-600 border-slate-200 hover:border-medical-300'}`}
                    onClick={() => toggleSymptom(symptom.label)}
                  >
                    {symptom.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === Step.DETALHES && (
            <div className="animate-fadeIn">
              <div className="mb-8">
                <label className="block mb-2 font-medium text-sm text-slate-700 dark:text-slate-300">Outros sintomas ou detalhes que gostaria de mencionar?</label>
                <textarea 
                  placeholder="Descreva aqui outros sintomas ou detalhes importantes..." 
                  className="w-full p-3 border-2 border-slate-200 dark:border-slate-700 rounded-lg min-h-[100px] text-sm resize-y bg-transparent dark:text-white focus:border-medical-500 outline-none transition-colors"
                  value={data.otherSymptoms}
                  onChange={(e) => setData(prev => ({ ...prev, otherSymptoms: e.target.value }))}
                />
              </div>
              <div className="mb-8">
                <label className="block mb-3 font-medium text-sm text-slate-700 dark:text-slate-300">Quando começaram os sintomas?</label>
                <div className="relative mb-4">
                  <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                  <input 
                    id="symptomsStartDateInput"
                    type="date" 
                    className="w-full h-12 p-3 pl-10 border-2 border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-transparent dark:text-white focus:border-medical-500 outline-none transition-colors text-left appearance-none"
                    value={data.symptomsStartDate}
                    onChange={(e) => {
                      setData(prev => ({ ...prev, symptomsStartDate: e.target.value }));
                      setDatePreset('Personalizado');
                    }}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['Amanhã', 'Hoje', 'Ontem', 'Personalizado'].map(preset => (
                    <button 
                      key={preset}
                      type="button"
                      onClick={() => {
                        setDatePreset(preset);
                        if (preset === 'Amanhã') {
                          const d = new Date();
                          d.setDate(d.getDate() + 1);
                          setData(prev => ({ ...prev, symptomsStartDate: d.toISOString().split('T')[0] }));
                        } else if (preset === 'Hoje') {
                          setData(prev => ({ ...prev, symptomsStartDate: new Date().toISOString().split('T')[0] }));
                        } else if (preset === 'Ontem') {
                          const d = new Date();
                          d.setDate(d.getDate() - 1);
                          setData(prev => ({ ...prev, symptomsStartDate: d.toISOString().split('T')[0] }));
                        } else {
                          document.getElementById('symptomsStartDateInput')?.focus();
                        }
                      }}
                      className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${datePreset === preset ? 'bg-medical-600 text-white border border-medical-600 shadow-md shadow-medical-600/20' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-medical-300'}`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-900/50 rounded-lg text-teal-700 dark:text-teal-300 text-xs flex items-center gap-2">
                  <Info size={16} className="shrink-0" />
                  <span>O atestado será válido a partir de <strong>{getValidDate()}</strong> (1 dia após o início dos sintomas).</span>
                </div>
              </div>
              <div className="mb-8">
                <label className="block mb-3 font-medium text-sm text-slate-700 dark:text-slate-300">Por quantos dias você precisa do atestado?</label>
                <div className="flex flex-col gap-3">
                  {[
                    { days: 1, label: '1 dia', price: 'R$ 39,90' },
                    { days: 2, label: '2 dias', price: 'R$ 43,90' },
                    { days: 3, label: '3 dias', price: 'R$ 49,90', bestValue: true },
                    { days: 5, label: '5 dias', price: 'R$ 59,90' },
                    { days: 7, label: '7 dias', price: 'R$ 69,90' },
                    { days: 10, label: '10 dias', price: 'R$ 79,90' },
                    { days: 15, label: '15 dias', price: 'R$ 89,90' }
                  ].map(opt => (
                    <div 
                      key={opt.days}
                      onClick={() => setData(prev => ({ ...prev, certificateDays: opt.days, priceLabel: opt.price }))}
                      className={`relative flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all ${data.certificateDays === opt.days ? 'border-2 border-medical-600 bg-medical-50/30 dark:bg-medical-900/20' : 'border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800'} ${opt.bestValue ? 'ring-2 ring-yellow-400 ring-offset-2 dark:ring-offset-slate-900' : ''}`}
                    >
                      {opt.bestValue && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                          Melhor Custo-Benefício
                        </span>
                      )}
                      <span className={`font-medium ${data.certificateDays === opt.days ? 'text-medical-700 dark:text-medical-400' : 'text-slate-700 dark:text-slate-300'}`}>{opt.label}</span>
                      <span className="font-bold text-medical-700 dark:text-medical-400">{opt.price}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-center gap-2 text-xs text-amber-800 dark:text-amber-200">
                  <Info size={16} />
                  <span>O período final de afastamento será definido pelo médico após a avaliação do seu caso clínico.</span>
                </div>
              </div>
              <div className="mb-8">
                <label className="block mb-3 font-medium text-sm text-slate-700 dark:text-slate-300">Hospital de Preferência</label>
                <p className="block mb-3 text-xs text-red-500">* Obrigatório</p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { id: 'ubs', label: 'UBS', img: 'https://sorriso.mt.leg.br/storage/app/uploads/public/405/dca/939/thumb__600_0_0_0_auto.jpg' },
                    { id: 'hapvida', label: 'Hapvida', img: 'https://leandrobatistarp.com.br/painel/wp-content/uploads/2025/02/8d23dffd45f7ccdd2668edc02a0fb098.png' },
                    { id: 'unimed', label: 'Unimed', img: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Unimed_institucional.png' },
                    { id: 'sus', label: 'SUS', img: 'https://logodownload.org/wp-content/uploads/2017/02/sus-logo-1-1.png' },
                    { id: 'upa', label: 'UPA', img: 'https://www.aracruz.es.gov.br/storage/portal-antigo/Banner_Noticias_UPA-msf1s4237slk3liblg35194btzg8pynt2vw9gn9goc.jpg' },
                    { id: 'sao-camilo', label: 'Hospital São Camilo', img: 'https://abrale.org.br/wp-content/uploads/2024/01/hospital-sao-camilo.jpg' }
                  ].map(h => (
                    <div 
                      key={h.id}
                      onClick={() => setData(prev => ({ ...prev, preferredHospital: h.label }))}
                      className={`border-2 rounded-xl p-4 text-center cursor-pointer flex flex-col items-center gap-2 min-h-[120px] justify-center transition-all ${data.preferredHospital === h.label ? 'border-medical-600 bg-medical-50/30 dark:bg-medical-900/20' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-medical-200'}`}
                    >
                      <img src={h.img} alt={h.label} className="max-h-[50px] max-w-full object-contain" />
                      <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{h.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === Step.DADOS && (
            <div className="space-y-6">
              <div className="mb-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg flex items-start gap-3 text-yellow-800 dark:text-yellow-200">
                <Info className="shrink-0 mt-0.5" size={20} />
                <span className="text-sm">
                  <strong>Atenção:</strong> Os dados informados abaixo (CPF, Estado e Cidade) serão utilizados <strong>exatamente como digitados</strong> para a emissão do seu atestado. Verifique com atenção antes de prosseguir.
                </span>
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label className="block mb-2 font-medium text-sm text-slate-700 dark:text-slate-300">CPF</label>
                  <div className="relative">
                    <input 
                      type="tel"
                      inputMode="numeric"
                      placeholder="000.000.000-00" 
                      maxLength={14} 
                      value={data.cpf}
                      onChange={(e) => setData(prev => ({ ...prev, cpf: formatCPF(e.target.value) }))}
                      className="w-full p-4 border-b border-slate-200 dark:border-slate-700 bg-transparent outline-none text-lg focus:border-medical-600 dark:focus:border-medical-500 transition-colors dark:text-white"
                    />
                    {data.cpf.length === 14 && (
                      <Check className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5 animate-fadeIn" />
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block mb-2 font-medium text-sm text-slate-700 dark:text-slate-300">E-mail</label>
                  <input 
                    type="email" 
                    value={data.email}
                    readOnly
                    className="w-full p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-sm text-slate-700 dark:text-slate-300">Telefone</label>
                  <input 
                    type="text" 
                    value={data.phone}
                    readOnly
                    className="w-full p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block mb-2 font-medium text-sm text-slate-700 dark:text-slate-300">CEP <span className="text-pink-500">*</span></label>
                    <div className="relative">
                      <input 
                        type="tel"
                        inputMode="numeric"
                        placeholder="00000-000" 
                        maxLength={9} 
                        value={data.cep || ''}
                        onChange={(e) => {
                          const formatted = formatCEP(e.target.value);
                          setData(prev => ({ ...prev, cep: formatted }));
                          if (formatted.length === 9) {
                            fetchAddressByCEP(formatted);
                          }
                        }}
                        className="w-full p-4 border-b border-slate-200 dark:border-slate-700 bg-transparent outline-none text-lg focus:border-medical-600 dark:focus:border-medical-500 transition-colors dark:text-white"
                      />
                      {data.cep && data.cep.length === 9 && (
                        <Check className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 w-5 h-5 animate-fadeIn" />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-sm text-slate-700 dark:text-slate-300">Cidade <span className="text-pink-500">*</span></label>
                    <input 
                      type="text" 
                      placeholder="São Paulo" 
                      value={data.city}
                      onChange={(e) => setData(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full p-4 border-b border-slate-200 dark:border-slate-700 bg-transparent outline-none text-lg focus:border-medical-600 dark:focus:border-medical-500 transition-colors dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-sm text-slate-700 dark:text-slate-300">Estado <span className="text-pink-500">*</span></label>
                    <select 
                      value={data.state}
                      onChange={(e) => setData(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full p-4 border-b border-slate-200 dark:border-slate-700 bg-transparent outline-none text-lg focus:border-medical-600 dark:focus:border-medical-500 transition-colors dark:text-white appearance-none"
                      style={{ 
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23666\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                        backgroundPosition: 'right 8px center',
                        backgroundRepeat: 'no-repeat'
                      }}
                    >
                      <option value="" className="dark:bg-slate-800">Selecione...</option>
                      <option value="AC" className="dark:bg-slate-800">AC - Acre</option>
                      <option value="AL" className="dark:bg-slate-800">AL - Alagoas</option>
                      <option value="AP" className="dark:bg-slate-800">AP - Amapá</option>
                      <option value="AM" className="dark:bg-slate-800">AM - Amazonas</option>
                      <option value="BA" className="dark:bg-slate-800">BA - Bahia</option>
                      <option value="CE" className="dark:bg-slate-800">CE - Ceará</option>
                      <option value="DF" className="dark:bg-slate-800">DF - Distrito Federal</option>
                      <option value="ES" className="dark:bg-slate-800">ES - Espírito Santo</option>
                      <option value="GO" className="dark:bg-slate-800">GO - Goiás</option>
                      <option value="MA" className="dark:bg-slate-800">MA - Maranhão</option>
                      <option value="MT" className="dark:bg-slate-800">MT - Mato Grosso</option>
                      <option value="MS" className="dark:bg-slate-800">MS - Mato Grosso do Sul</option>
                      <option value="MG" className="dark:bg-slate-800">MG - Minas Gerais</option>
                      <option value="PA" className="dark:bg-slate-800">PA - Pará</option>
                      <option value="PB" className="dark:bg-slate-800">PB - Paraíba</option>
                      <option value="PR" className="dark:bg-slate-800">PR - Paraná</option>
                      <option value="PE" className="dark:bg-slate-800">PE - Pernambuco</option>
                      <option value="PI" className="dark:bg-slate-800">PI - Piauí</option>
                      <option value="RJ" className="dark:bg-slate-800">RJ - Rio de Janeiro</option>
                      <option value="RN" className="dark:bg-slate-800">RN - Rio Grande do Norte</option>
                      <option value="RS" className="dark:bg-slate-800">RS - Rio Grande do Sul</option>
                      <option value="RO" className="dark:bg-slate-800">RO - Rondônia</option>
                      <option value="RR" className="dark:bg-slate-800">RR - Roraima</option>
                      <option value="SC" className="dark:bg-slate-800">SC - Santa Catarina</option>
                      <option value="SP" className="dark:bg-slate-800">SP - São Paulo</option>
                      <option value="SE" className="dark:bg-slate-800">SE - Sergipe</option>
                      <option value="TO" className="dark:bg-slate-800">TO - Tocantins</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === Step.FINALIZACAO && (
            showPayment && pixData ? (
              isPaid ? (
                <div className="animate-fadeIn text-center py-12">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mb-4">Pagamento Confirmado!</h3>
                  <p className="text-slate-500 mb-8 max-w-md mx-auto">Seu atestado foi gerado com sucesso e já está disponível para download. Também enviamos uma cópia para seu e-mail e WhatsApp.</p>
                  
                  <button className="bg-medical-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-medical-700 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3 mx-auto w-full max-w-sm">
                    Baixar Atestado PDF
                    <ArrowRight size={20} />
                  </button>
                </div>
              ) : (
                <div className="animate-fadeIn">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-slate-800 mb-2">Pagamento PIX</h3>
                    <p className="text-slate-500">Escaneie o QR Code ou copie o código abaixo para finalizar.</p>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border-2 border-medical-600 shadow-xl mb-8 flex flex-col items-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full bg-medical-600 text-white text-center py-1 text-xs font-bold uppercase tracking-widest">
                      Expira em 10:00
                    </div>
                    <div className="mt-6 p-4 bg-white rounded-xl shadow-inner mb-4">
                      <img src={pixData.qrCode} alt="QR Code PIX" className="w-48 h-48" />
                    </div>
                    <div className="w-full">
                      <p className="text-xs text-center text-slate-400 mb-2 uppercase font-bold">Código Copia e Cola</p>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between gap-2">
                        <code className="text-xs text-slate-600 truncate flex-1">{pixData.copyPaste}</code>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(pixData.copyPaste);
                            alert("Código copiado!");
                          }}
                          className="text-medical-600 font-bold text-xs uppercase hover:underline"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Prévia Borrada do Atestado */}
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-lg mb-8 opacity-75">
                    <div className="absolute inset-0 backdrop-blur-md bg-white/60 z-10 flex flex-col items-center justify-center text-center p-6">
                      <Lock className="w-12 h-12 text-slate-400 mb-3" />
                      <h4 className="text-lg font-bold text-slate-800 mb-1">Atestado Gerado</h4>
                      <p className="text-sm text-slate-500">Aguardando confirmação do pagamento para liberar o download.</p>
                      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 animate-pulse">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Aguardando pagamento...
                      </div>
                    </div>
                    <div className="bg-white p-8 min-h-[300px] flex flex-col gap-4 filter blur-[6px]">
                      <div className="flex justify-between items-center border-b pb-4">
                        <div className="w-32 h-8 bg-slate-200 rounded"></div>
                        <div className="w-24 h-4 bg-slate-100 rounded"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="w-full h-4 bg-slate-100 rounded"></div>
                        <div className="w-3/4 h-4 bg-slate-100 rounded"></div>
                        <div className="w-1/2 h-4 bg-slate-100 rounded"></div>
                      </div>
                      <div className="mt-8 p-4 border rounded bg-slate-50">
                        <div className="w-full h-20 bg-slate-200 rounded"></div>
                      </div>
                      <div className="mt-auto pt-8 border-t flex justify-between items-end">
                        <div className="w-40 h-12 bg-slate-100 rounded"></div>
                        <div className="w-20 h-20 bg-slate-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsPaid(true)} // Simulação para teste local se necessário, ou remover em prod
                    className="w-full bg-slate-100 text-slate-500 py-4 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                  >
                    Já realizei o pagamento
                  </button>
                </div>
              )
            ) : (
              <div className="space-y-8">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 md:p-10 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
                   <div className="flex justify-between text-sm mb-4">
                     <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px]">Paciente:</span>
                     <span className="font-black text-slate-800 dark:text-white">{data.fullName || "Não informado"}</span>
                   </div>
                   <div className="flex justify-between text-sm mb-4">
                     <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px]">Motivo:</span>
                     <span className="font-black text-slate-800 dark:text-white">{data.selectedProblem}</span>
                   </div>
                   <div className="flex justify-between text-sm mb-4">
                     <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px]">CPF:</span>
                     <span className="font-black text-slate-800 dark:text-white">{data.cpf}</span>
                   </div>
                   
                   <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>
                   
                   {/* Order Bumps */}
                   <div className="space-y-3 mb-6">
                     <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Adicionais Recomendados:</p>
                     {bumps.map(bump => (
                       <label 
                         key={bump.id}
                         className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${data.selectedBumps?.includes(bump.id) ? 'border-medical-600 bg-medical-50/50 dark:bg-medical-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-medical-300 dark:hover:border-medical-500'}`}
                       >
                         <input 
                           type="checkbox"
                           checked={data.selectedBumps?.includes(bump.id)}
                           onChange={(e) => {
                             const isChecked = e.target.checked;
                             setData(prev => ({
                               ...prev,
                               selectedBumps: isChecked 
                                 ? [...(prev.selectedBumps || []), bump.id]
                                 : (prev.selectedBumps || []).filter(id => id !== bump.id)
                             }));
                           }}
                           className="w-5 h-5 text-medical-600 rounded focus:ring-medical-500"
                         />
                         <div className="ml-3 flex-1">
                           <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">{bump.label}</span>
                           <span className="block text-xs text-medical-600 dark:text-medical-400 font-bold">+ R$ {bump.price.toFixed(2).replace('.', ',')}</span>
                         </div>
                       </label>
                     ))}
                   </div>

                   <div className="border-t border-slate-200 dark:border-slate-700 my-6"></div>

                   <div className="flex justify-between items-center">
                     <span className="font-black text-slate-600 dark:text-slate-300">Total:</span>
                     <span className="text-4xl font-black text-[#125F39] dark:text-medical-400">R$ {getTotalPrice()}</span>
                   </div>
                </div>
                <button 
                  onClick={handleGeneratePix}
                  className="w-full bg-[#125F39] text-white py-6 rounded-3xl font-black text-lg flex items-center justify-center gap-4 shadow-2xl hover:bg-[#0e4b2d] transition-all active:scale-95 shadow-green-900/20"
                >
                  Gerar PIX e Receber Atestado
                  <Zap size={20} fill="currentColor" />
                </button>
              </div>
            )
          )}
        </div>

        <div className="card-footer">
           {currentStep !== Step.PROBLEMA && currentStep !== Step.FINALIZACAO && (
             <button 
               className="btn-back" 
               id="8b2f5d50-9c4b-74ae-e6b1-93f5026134b2"
               onClick={prevStep}
             >
               <ArrowLeft size={16} />
               Etapa Anterior
             </button>
           )}

           {currentStep !== Step.FINALIZACAO && (
             <button 
               className="btn-next" 
               id="1a8ea1e7-d0c8-ad11-77a1-4b00d372e7d6"
               onClick={nextStep} 
               disabled={isNextDisabled()}
             >
               Próxima Etapa
               <ArrowRight size={16} />
             </button>
           )}
        </div>
      </div>

      <div className="security-badges">
        <div className="badge-item">
          <Lock size={14} />
          <span>AMBIENTE SEGURO</span>
        </div>
        <div className="badge-item">
          <Check size={14} />
          <span>CFM RESOLUÇÃO 2.314/2022</span>
        </div>
        <div className="badge-item">
          <Clock size={14} />
          <span>SUPORTE 24H</span>
        </div>
      </div>

    </div>
  );
};
