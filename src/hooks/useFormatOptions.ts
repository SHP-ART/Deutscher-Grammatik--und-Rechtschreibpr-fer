import { useState } from 'react';
import { GEMINI_MODELS } from '../utils/constants';

export interface FormatOptionsState {
  toUpperCase: boolean;
  asEmail: boolean;
  asInvoice: boolean;
  withResearch: boolean;
  selectedModel: string;
}

export function useFormatOptions() {
  const [toUpperCase, setToUpperCase] = useState<boolean>(false);
  const [asEmail, setAsEmail] = useState<boolean>(false);
  const [asInvoice, setAsInvoice] = useState<boolean>(false);
  const [withResearch, setWithResearch] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>(GEMINI_MODELS[0].id);

  const toggleEmail = (checked: boolean) => {
    setAsEmail(checked);
    if (checked) setAsInvoice(false);
  };

  const toggleInvoice = (checked: boolean) => {
    setAsInvoice(checked);
    if (checked) setAsEmail(false);
  };

  const getFormatOptions = () => ({
    asEmail,
    asInvoice,
    withResearch,
    modelName: selectedModel
  });

  const reset = () => {
    setToUpperCase(false);
    setAsEmail(false);
    setAsInvoice(false);
    setWithResearch(false);
    setSelectedModel(GEMINI_MODELS[0].id);
  };

  return {
    toUpperCase,
    setToUpperCase,
    asEmail,
    asInvoice,
    withResearch,
    setWithResearch,
    selectedModel,
    setSelectedModel,
    toggleEmail,
    toggleInvoice,
    getFormatOptions,
    reset
  };
}
