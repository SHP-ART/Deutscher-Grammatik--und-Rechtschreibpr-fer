import React from 'react';
import LoadingSpinner from '../common/LoadingSpinner';
import { CheckIcon, ClipboardIcon } from '../icons';

interface TextOutputSectionProps {
  text: string;
  isLoading: boolean;
  error: string;
  onCopy: () => void;
  isCopied: boolean;
}

const TextOutputSection: React.FC<TextOutputSectionProps> = ({
  text,
  isLoading,
  error,
  onCopy,
  isCopied
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-3 flex justify-between items-center">
        <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Ergebnis
        </span>
        {text && (
          <button
            onClick={onCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-white bg-gradient-to-r from-gray-100 to-gray-100 hover:from-blue-500 hover:to-slate-600 rounded-full transition-all shadow-sm hover:shadow-md"
            aria-label="Kopieren"
          >
            {isCopied ? (
              <>
                <CheckIcon className="h-4 w-4" />
                <span>Kopiert!</span>
              </>
            ) : (
              <>
                <ClipboardIcon className="h-4 w-4" />
                <span>Kopieren</span>
              </>
            )}
          </button>
        )}
      </div>
      <div className="relative flex-1">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-10 rounded-xl border-2 border-blue-200">
            <LoadingSpinner />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50 p-6 z-10 rounded-xl border-2 border-red-300">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}
        <div className="h-full w-full p-4 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white overflow-y-auto shadow-sm hover:shadow-md transition-all">
          <pre className="whitespace-pre-wrap break-words font-sans text-gray-900 leading-relaxed text-sm">
            {text || (
              <span className="text-gray-400 italic">
                Das Ergebnis wird hier angezeigt...
              </span>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TextOutputSection;
