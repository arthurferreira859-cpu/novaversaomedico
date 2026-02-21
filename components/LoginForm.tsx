import React, { useState } from 'react';

export const LoginForm: React.FC = () => {
  const [cpf, setCpf] = useState('');
  const [error, setError] = useState('');

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    // Validação básica de dígitos repetidos
    if (/^(\d)\1+$/.test(cleanCPF)) return false;
    return true;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    // Aplica máscara 000.000.000-00
    if (value.length > 9) {
      value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1.$2.$3');
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d+)/, '$1.$2');
    }
    
    setCpf(value);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCPF(cpf)) {
      alert("Iniciando busca de atestados para o CPF: " + cpf);
    } else {
      setError('CPF inválido. Por favor, verifique os números.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-white min-h-[500px]">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-sm border border-slate-100 text-center animate-fadeIn">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 mb-1">Fazer Login</h2>
        <p className="text-sm text-slate-500 mb-6 font-medium">Acesse seus atestados e indicações</p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="text-left">
            <label className="block text-xs font-black text-slate-700 mb-1.5 ml-1 uppercase tracking-wider">CPF</label>
            <input
              type="text"
              required
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
              className={`w-full px-5 py-3 border-2 rounded-xl outline-none transition-all text-base font-medium placeholder:text-slate-400 shadow-sm bg-white text-slate-900 ${error ? 'border-red-500' : 'border-slate-100 focus:border-medical-600'}`}
            />
            {error && <p className="text-[10px] text-red-500 mt-1.5 ml-1 font-bold">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-medical-600 text-white font-black py-3.5 rounded-xl text-lg shadow-lg shadow-medical-600/10 hover:bg-medical-700 transition-all active:scale-95"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};