import { useState } from 'react';
import { correctGrammar } from '../services/grammarService';
import { validateTextInput } from '../utils/validation';
import type { FormatOptions } from '../types';
import { UI_TEXT } from '../utils/constants';

export function useGrammarCheck() {
  const [inputText, setInputText] = useState<string>('');
  const [correctedText, setCorrectedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleCheck = async (formatOptions: FormatOptions, toUpperCase: boolean = false) => {
    const validation = validateTextInput(inputText);

    if (!validation.valid) {
      setError(validation.error || '');
      return;
    }

    setIsLoading(true);
    setError('');
    setCorrectedText('');

    try {
      const result = await correctGrammar(inputText, formatOptions);
      setCorrectedText(toUpperCase ? result.toUpperCase() : result);
    } catch (err: any) {
      setError(err.message || UI_TEXT.ERROR_DEFAULT);
      console.error('Grammar check error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setInputText('');
    setCorrectedText('');
    setError('');
  };

  return {
    inputText,
    setInputText,
    correctedText,
    setCorrectedText,
    isLoading,
    error,
    handleCheck,
    reset
  };
}
