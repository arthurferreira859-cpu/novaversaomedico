import React from 'react';
import { Lock, FileCheck, UserCheck, Shield } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  return (
    <div className="bg-slate-50 border-y border-slate-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-600">
            <Lock className="w-5 h-5 text-medical-600" />
            <span className="text-sm font-medium">Dados Criptografados</span>
          </div>
          <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-600">
            <UserCheck className="w-5 h-5 text-medical-600" />
            <span className="text-sm font-medium">Médicos Credenciados</span>
          </div>
          <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-600">
            <FileCheck className="w-5 h-5 text-medical-600" />
            <span className="text-sm font-medium">Emissão Válida em todo BR</span>
          </div>
          <div className="flex items-center justify-center md:justify-start space-x-2 text-slate-600">
            <Shield className="w-5 h-5 text-medical-600" />
            <span className="text-sm font-medium">Conformidade LGPD</span>
          </div>
        </div>
      </div>
    </div>
  );
};