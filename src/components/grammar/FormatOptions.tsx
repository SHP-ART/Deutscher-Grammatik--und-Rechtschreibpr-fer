import React from 'react';
import Checkbox from '../common/Checkbox';
import { FORMAT_OPTIONS_LABELS, GEMINI_MODELS } from '../../utils/constants';

interface FormatOptionsProps {
  toUpperCase: boolean;
  onToUpperCaseChange: (checked: boolean) => void;
  asEmail: boolean;
  onEmailChange: (checked: boolean) => void;
  asInvoice: boolean;
  onInvoiceChange: (checked: boolean) => void;
  withResearch: boolean;
  onResearchChange: (checked: boolean) => void;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

const FormatOptions: React.FC<FormatOptionsProps> = ({
  toUpperCase,
  onToUpperCaseChange,
  asEmail,
  onEmailChange,
  asInvoice,
  onInvoiceChange,
  withResearch,
  onResearchChange,
  selectedModel,
  onModelChange
}) => {
  return (
    <div className="space-y-4 border-t-2 border-gray-200 pt-6">
      {/* Gemini Model Selection */}
      <div className="bg-gradient-to-r from-blue-50 to-slate-100 p-4 rounded-xl">
        <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Modell wählen
        </p>
        <div className="flex gap-3 flex-wrap">
          {GEMINI_MODELS.map((model) => (
            <Checkbox
              key={model.id}
              label={`${model.name} (${model.description})`}
              checked={selectedModel === model.id}
              onChange={() => onModelChange(model.id)}
            />
          ))}
        </div>
      </div>

      {/* Format Options */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-100 p-4 rounded-xl">
        <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Optionen
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Checkbox
            label={FORMAT_OPTIONS_LABELS.TO_UPPERCASE}
            checked={toUpperCase}
            onChange={(e) => onToUpperCaseChange(e.target.checked)}
          />
          <Checkbox
            label={FORMAT_OPTIONS_LABELS.AS_EMAIL}
            checked={asEmail}
            onChange={(e) => onEmailChange(e.target.checked)}
          />
          <Checkbox
            label={FORMAT_OPTIONS_LABELS.AS_INVOICE}
            checked={asInvoice}
            onChange={(e) => onInvoiceChange(e.target.checked)}
          />
          <Checkbox
            label={FORMAT_OPTIONS_LABELS.WITH_RESEARCH}
            checked={withResearch}
            onChange={(e) => onResearchChange(e.target.checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default FormatOptions;
