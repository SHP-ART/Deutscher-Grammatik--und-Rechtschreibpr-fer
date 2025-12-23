import { useState } from 'react';
import { configureApiKey } from '../services/setupService';
import { validateApiKey } from '../utils/validation';

export function useSetup(onSetupComplete: () => void) {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateApiKey(apiKey);
    if (!validation.valid) {
      setError(validation.error || '');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await configureApiKey(apiKey.trim());

      setSuccess(response.message);
      setTimeout(() => {
        onSetupComplete();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Konfigurieren');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    apiKey,
    setApiKey,
    isLoading,
    error,
    success,
    handleSubmit
  };
}
