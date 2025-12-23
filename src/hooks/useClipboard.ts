import { useState } from 'react';
import { APP_CONSTANTS } from '../utils/constants';

export function useClipboard() {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = async (text: string): Promise<boolean> => {
    if (!text) {
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), APP_CONSTANTS.COPY_SUCCESS_DURATION);
      return true;
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      return false;
    }
  };

  return {
    isCopied,
    copyToClipboard
  };
}
